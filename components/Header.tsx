'use client'

import { Sparkles, Github, Info, GitBranch, Search, Upload, Download } from 'lucide-react'
import { useState } from 'react'

type Props = {
  projectName?: string
  onImportClick?: () => void
  onAnalyzeClick?: () => void
  onPushClick?: () => void
  onDownloadClick?: () => void
  hasFiles?: boolean
}

export default function Header({ 
  projectName, 
  onImportClick, 
  onAnalyzeClick, 
  onPushClick, 
  onDownloadClick,
  hasFiles = false
}: Props) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <header className="h-14 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">AI Studio Clone</span>
        </div>
        {projectName && (
          <span className="text-sm text-gray-400 px-2 py-1 bg-dark-700 rounded">
            {projectName}
          </span>
        )}
        <span className="text-xs text-gray-500 px-2 py-1 bg-dark-700 rounded-full">
          Powered by MiniMax M2.5
        </span>
      </div>
      
      <nav className="flex items-center gap-2">
        <button
          onClick={onImportClick}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          title="Import Repository"
        >
          <GitBranch className="w-5 h-5 text-gray-400" />
        </button>
        
        {hasFiles && (
          <>
            <button
              onClick={onAnalyzeClick}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
              title="Analyze Code"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={onPushClick}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
              title="Push to GitHub"
            >
              <Upload className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={onDownloadClick}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-400" />
            </button>
          </>
        )}
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          title="About"
        >
          <Info className="w-5 h-5 text-gray-400" />
        </button>
        <a
          href="https://github.com/drakelarson/ai-studio-clone"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          title="GitHub"
        >
          <Github className="w-5 h-5 text-gray-400" />
        </a>
      </nav>
      
      {showInfo && (
        <div className="absolute top-16 right-4 w-80 bg-dark-700 border border-dark-500 rounded-xl p-4 shadow-2xl z-50">
          <h3 className="font-bold mb-2">AI Studio Clone</h3>
          <p className="text-sm text-gray-400 mb-3">
            Build AI-powered applications using natural language. Similar to Google AI Studio's Build Mode.
          </p>
          <div className="border-t border-dark-500 pt-3">
            <h4 className="text-sm font-semibold mb-2">Features:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>✨ Generate apps from natural language</li>
              <li>📝 Iterate with conversational feedback</li>
              <li>📥 Import & analyze existing repos</li>
              <li>🔍 Live preview</li>
              <li>🚀 Push to GitHub</li>
            </ul>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  )
}
