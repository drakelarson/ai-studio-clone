'use client';

import { useAppStore } from '@/lib/store';
import { classNames } from '@/lib/utils';
import { ChevronDown, Settings2, Code2, Search, Terminal, Globe, FileSearch, Shield, X } from 'lucide-react';

export function SettingsPanel() {
  const {
    settings,
    systemPrompt,
    setSystemPrompt,
    setSettings,
    settingsPanelOpen,
    toggleSettingsPanel,
    model,
    setModel,
  } = useAppStore();

  return (
    <aside
      className={classNames(
        'flex flex-col bg-zinc-900/50 border-l border-zinc-800 transition-all duration-300',
        settingsPanelOpen ? 'w-80' : 'w-12'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        {settingsPanelOpen && (
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-zinc-400" />
            <span className="font-medium text-sm">Run Settings</span>
          </div>
        )}
        <button
          onClick={toggleSettingsPanel}
          className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
        >
          {settingsPanelOpen ? (
            <X className="w-4 h-4 text-zinc-400" />
          ) : (
            <Settings2 className="w-4 h-4 text-zinc-400" />
          )}
        </button>
      </div>

      {settingsPanelOpen && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Model Selection */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Model</label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="Google Gemini">
                  <option value="gemini-3.1-pro">Gemini 3.1 Pro</option>
                  <option value="gemini-3-flash">Gemini 3 Flash</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                </optgroup>
                <optgroup label="OpenAI">
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="o1-pro">o1 Pro</option>
                  <option value="o3-mini">o3-mini</option>
                </optgroup>
                <optgroup label="Anthropic">
                  <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
                  <option value="claude-opus-4-20250514">Claude Opus 4</option>
                </optgroup>
                <optgroup label="Open Models (via OpenRouter)">
                  <option value="google/gemma-3">Gemma 3</option>
                  <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B</option>
                  <option value="deepseek/deepseek-r1">DeepSeek R1</option>
                </optgroup>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* System Instructions */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">System Instructions</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter system instructions that define how the AI should behave..."
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Temperature</label>
              <span className="text-sm text-zinc-300">{settings.temperature.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => setSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Max Tokens</label>
              <span className="text-sm text-zinc-300">{settings.maxTokens.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="256"
              max="32768"
              step="256"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ maxTokens: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Thinking Budget */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Thinking Budget</label>
            <div className="flex gap-2">
              {(['none', 'low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSettings({ thinking: level })}
                  className={classNames(
                    'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition-colors',
                    settings.thinking === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Tools</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tools.googleSearch}
                  onChange={(e) => setSettings({
                    tools: { ...settings.tools, googleSearch: e.target.checked }
                  })}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                />
                <Globe className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Google Search</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tools.codeExecution}
                  onChange={(e) => setSettings({
                    tools: { ...settings.tools, codeExecution: e.target.checked }
                  })}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                />
                <Terminal className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Code Execution</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tools.urlContext}
                  onChange={(e) => setSettings({
                    tools: { ...settings.tools, urlContext: e.target.checked }
                  })}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">URL Context</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tools.fileSearch}
                  onChange={(e) => setSettings({
                    tools: { ...settings.tools, fileSearch: e.target.checked }
                  })}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                />
                <FileSearch className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">File Search</span>
              </label>
            </div>
          </div>

          {/* Safety Settings */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
              <Shield className="w-3 h-3 inline mr-1" />
              Safety Settings
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Harassment</span>
                <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300">
                  <option>BLOCK_SOME</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Hate Speech</span>
                <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300">
                  <option>BLOCK_SOME</option>
                </select>
              </div>
            </div>
          </div>

          {/* Structured Output */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
              <Code2 className="w-3 h-3 inline mr-1" />
              Structured Output
            </label>
            <button className="w-full py-2 px-3 rounded-lg border border-dashed border-zinc-700 text-sm text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 transition-colors">
              Define JSON Schema...
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
