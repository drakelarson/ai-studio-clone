'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/lib/chat';
import { useAppStore } from '@/lib/store';
import { classNames, formatDate, copyToClipboard } from '@/lib/utils';
import { Send, RotateCcw, Copy, Check, Bot, User, Loader2, Paperclip, Mic } from 'lucide-react';
import type { Message } from '@/types';

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-4 py-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot" />
      <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot" />
      <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot" />
    </div>
  );
}

function MessageBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await copyToClipboard(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={classNames(
        'flex gap-3 p-4 animate-fade-in',
        isUser ? 'bg-transparent' : 'bg-zinc-900/50'
      )}
    >
      <div
        className={classNames(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-zinc-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-zinc-300" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-zinc-300">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-zinc-500">
            {formatDate(message.timestamp)}
          </span>
        </div>
        <div className="text-sm text-zinc-200 whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
          )}
        </div>
      </div>
      {!isUser && message.content && !isStreaming && (
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

export function ChatInterface() {
  const { messages, sendMessage, regenerateLastMessage, isLoading, error, streamingMessageId } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const systemPrompt = useAppStore((s) => s.systemPrompt);
  const setSystemPrompt = useAppStore((s) => s.setSystemPrompt);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">
      {/* System Instructions (Collapsible) */}
      {systemPrompt && (
        <div className="border-b border-zinc-800 p-3 bg-zinc-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">System Instructions</span>
            <button
              onClick={() => setSystemPrompt('')}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Clear
            </button>
          </div>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{systemPrompt}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-2">Start a conversation</h2>
            <p className="text-zinc-500 max-w-md">
              Choose a model, set your system instructions, and start chatting. Your prompts and responses will appear here.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={message.id === streamingMessageId && isLoading}
              />
            ))}
            {isLoading && !streamingMessageId && (
              <div className="flex gap-3 p-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-900/20 border-t border-red-900/50">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-zinc-800 p-4 bg-zinc-900/30">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a prompt here..."
              rows={1}
              className="w-full px-4 py-3 pr-24 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={classNames(
                'px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2',
                input.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
              Send
            </button>
            {messages.length > 0 && !isLoading && (
              <button
                type="button"
                onClick={regenerateLastMessage}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-3 h-3" />
                Regenerate
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
