'use client'

import { FolderOpen, GitImport, Sparkles, History, Settings } from 'lucide-react'

type Props = {
  onImport: () => void
  hasProject: boolean
}

export default function Sidebar({ onImport, hasProject }: Props) {
  return (
    <aside className="w-12 bg-dark-800 border-r border-dark-600 flex flex-col items-center py-4 gap-2">
      <button
        className="p-2 hover:bg-dark-700 rounded-lg transition-colors group relative"
        title="New Project"
      >
        <Sparkles className="w-5 h-5 text-accent-blue" />
        <span className="absolute left-14 px-2 py-1 bg-dark-700 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          New Project
        </span>
      </button>
      
      <button
        onClick={onImport}
        className="p-2 hover:bg-dark-700 rounded-lg transition-colors group relative"
        title="Import Repository"
      >
        <GitImport className="w-5 h-5 text-gray-400" />
        <span className="absolute left-14 px-2 py-1 bg-dark-700 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Import Repo
        </span>
      </button>
      
      <div className="flex-1" />
      
      {hasProject && (
        <button
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors group relative"
          title="History"
        >
          <History className="w-5 h-5 text-gray-400" />
          <span className="absolute left-14 px-2 py-1 bg-dark-700 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            History
          </span>
        </button>
      )}
    </aside>
  )
}
