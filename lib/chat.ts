import { useAppStore } from '@/lib/store';
import { useState, useCallback } from 'react';
import type { Message } from '@/types';

const API_URL = 'https://larsondrake.zo.space/api/chat';

export function useChat() {
  const {
    messages,
    systemPrompt,
    model,
    settings,
    apiKey,
    provider,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    error,
    isLoading,
  } = useAppStore();

  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    addMessage({ role: 'user', content });
    setLoading(true);
    setError(null);

    // Create placeholder for assistant message
    const assistantId = Math.random().toString(36).substring(2, 15);
    addMessage({ role: 'assistant', content: '' });
    setStreamingMessageId(assistantId);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
          model,
          system: systemPrompt,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          provider,
          api_key: apiKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || '';

      updateMessage(assistantId, assistantContent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      updateMessage(assistantId, `Error: ${errorMessage}`);
    } finally {
      setLoading(false);
      setStreamingMessageId(null);
    }
  }, [messages, systemPrompt, model, settings, apiKey, provider, addMessage, updateMessage, setLoading, setError]);

  const regenerateLastMessage = useCallback(async () => {
    if (messages.length < 2) return;

    // Get the last user message
    const lastUserMessage = [...messages].reverse().find((m: Message) => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove last assistant message and regenerate
    const messageIndex = messages.findIndex((m: Message) => m.id === lastUserMessage.id);
    if (messageIndex === -1) return;

    // Reset and regenerate
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.slice(0, messageIndex + 1).map((m: Message) => ({
            role: m.role,
            content: m.content,
          })),
          model,
          system: systemPrompt,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          provider,
          api_key: apiKey || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || '';

      // Update the last assistant message
      const lastAssistantId = messages[messages.length - 1].id;
      updateMessage(lastAssistantId, assistantContent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [messages, systemPrompt, model, settings, apiKey, provider, updateMessage, setLoading, setError]);

  return {
    messages,
    sendMessage,
    regenerateLastMessage,
    isLoading,
    error,
    streamingMessageId,
  };
}
