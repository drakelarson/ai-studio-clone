'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, RefreshCw, Lightbulb } from 'lucide-react'

type Props = {
  onSubmit: (prompt: string, projectName?: string) => void
  isLoading: boolean
  hasProject: boolean
}

const SUGGESTIONS = [
  "Build a todo app with local storage",
  "Create a weather dashboard with charts",
  "Make a markdown editor with preview",
  "Design a portfolio website with animations",
  "Build a chat interface with AI responses",
]

export default function PromptInput({ onSubmit, isLoading, hasProject }: Props) {
  const [prompt, setPrompt] = useState('')
  const [projectName, setProjectName] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [prompt])

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return
    
    if (!hasProject && projectName.trim()) {
      onSubmit(prompt, projectName)
    } else {
      onSubmit(prompt)
    }
    
    setPrompt('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setPrompt(suggestion)
    setShowSuggestions(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="border-t border-dark-600 bg-dark-800 p-4">
      {!hasProject && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Project name (optional)"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-500 rounded-lg text-sm focus:outline-none focus:border-accent-blue"
          />
        </div>
      )}
      
      <div className="relative">
        <div className="flex items-start gap-2 bg-dark-700 border border-dark-500 rounded-xl p-3 focus-within:border-accent-blue transition-colors">
          <Sparkles className="w-5 h-5 text-accent-purple mt-1 flex-shrink-0" />
          
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => !hasProject && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={
              hasProject 
                ? "Describe changes you want to make..." 
                : "Describe the app you want to build..."
            }
            className="flex-1 bg-transparent resize-none focus:outline-none text-sm min-h-[40px] max-h-[200px]"
            rows={1}
            disabled={isLoading}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="px-4 py-2 bg-accent-blue rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isLoading ? 'Working...' : hasProject ? 'Iterate' : 'Generate'}
            </span>
          </button>
        </div>
        
        {/* Suggestions dropdown */}
        {!hasProject && showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-500 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
            <div className="p-2 border-b border-dark-500 flex items-center gap-2 text-xs text-gray-400">
              <Lightbulb className="w-4 h-4" />
              <span>Suggestions</span>
            </div>
            {SUGGESTIONS.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-dark-600 text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>
          Press <kbd className="px-1.5 py-0.5 bg-dark-600 rounded">Enter</kbd> to submit, 
          <kbd className="px-1.5 py-0.5 bg-dark-600 rounded ml-1">Shift+Enter</kbd> for new line
        </span>
        {hasProject && (
          <span className="text-accent-blue">Iterating on project</span>
        )}
      </div>
    </div>
  )
}
