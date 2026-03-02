'use client'

import { useState, useCallback } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import PromptInput from '@/components/PromptInput'
import CodeEditor from '@/components/CodeEditor'
import Preview from '@/components/Preview'
import FileTree from '@/components/FileTree'
import AnalysisPanel from '@/components/AnalysisPanel'
import { Sparkles, Code2, Play, GitBranch, Download, Loader2 } from 'lucide-react'

export type FileContent = {
  [filename: string]: string
}

export type RepoInfo = {
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
}

export type Analysis = {
  summary: string
  tech_stack: string[]
  architecture: string
  features: string[]
  suggestions: string[]
  file_purposes: { [file: string]: string }
}

export default function Home() {
  const [view, setView] = useState<'edit' | 'preview' | 'split'>('split')
  const [files, setFiles] = useState<FileContent>({})
  const [activeFile, setActiveFile] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [projectName, setProjectName] = useState<string>('')
  
  // Import/Analysis state
  const [showImport, setShowImport] = useState(false)
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_ZO_SPACE_URL || 'https://larsondrake.zo.space'

  const handleGenerate = useCallback(async (prompt: string, name?: string) => {
    setIsGenerating(true)
    setError(null)
    setProjectName(name || 'my-app')
    
    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, projectName: name || 'my-app' }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFiles(data.files)
        setActiveFile(Object.keys(data.files)[0] || '')
        if (data.conversation_id) {
          setConversationId(data.conversation_id)
        }
      } else {
        setError(data.error || 'Generation failed')
      }
    } catch (err) {
      setError('Failed to connect to AI service')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }, [API_BASE])

  const handleIterate = useCallback(async (prompt: string) => {
    if (!conversationId || Object.keys(files).length === 0) {
      setError('No project to iterate on. Generate an app first.')
      return
    }
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/api/iterate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          currentFiles: files,
          conversationId 
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFiles(prev => ({ ...prev, ...data.files }))
        if (data.deleted && data.deleted.length > 0) {
          setFiles(prev => {
            const newFiles = { ...prev }
            data.deleted.forEach((f: string) => delete newFiles[f])
            return newFiles
          })
        }
        if (data.conversation_id) {
          setConversationId(data.conversation_id)
        }
      } else {
        setError(data.error || 'Iteration failed')
      }
    } catch (err) {
      setError('Failed to connect to AI service')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }, [API_BASE, conversationId, files])

  const handleImport = useCallback(async (repoUrl: string) => {
    setIsImporting(true)
    setError(null)
    setAnalysis(null)
    
    try {
      const response = await fetch(`${API_BASE}/api/import-repo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFiles(data.files)
        setRepoInfo(data.repo)
        setActiveFile(Object.keys(data.files)[0] || '')
        setProjectName(data.repo.name)
        setShowImport(false)
        
        // Auto-analyze after import
        handleAnalyze(data.files, data.repo)
      } else {
        setError(data.error || 'Import failed')
      }
    } catch (err) {
      setError('Failed to import repository')
      console.error(err)
    } finally {
      setIsImporting(false)
    }
  }, [API_BASE])

  const handleAnalyze = useCallback(async (filesToAnalyze?: FileContent, repo?: RepoInfo) => {
    const targetFiles = filesToAnalyze || files
    const targetRepo = repo || repoInfo
    
    if (Object.keys(targetFiles).length === 0) {
      setError('No files to analyze')
      return
    }
    
    setIsAnalyzing(true)
    
    try {
      const response = await fetch(`${API_BASE}/api/analyze-repo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          files: targetFiles, 
          repoInfo: targetRepo 
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (err) {
      setError('Failed to analyze repository')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }, [API_BASE, files, repoInfo])

  const handlePushToGitHub = useCallback(async () => {
    if (Object.keys(files).length === 0) {
      setError('No files to push')
      return
    }
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/api/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'push',
          files,
          repoName: projectName,
          message: 'Built with AI Studio Clone',
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`Pushed to GitHub: ${data.repo.html_url}`)
      } else {
        setError(data.error || 'Push failed')
      }
    } catch (err) {
      setError('Failed to push to GitHub')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }, [API_BASE, files, projectName])

  const handleDownload = useCallback(() => {
    const content = Object.entries(files)
      .map(([filename, code]) => `// --- ${filename} ---\n${code}`)
      .join('\n\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName || 'project'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [files, projectName])

  return (
    <div className="flex flex-col h-screen bg-dark-900">
      <Header 
        projectName={projectName}
        onImportClick={() => setShowImport(true)}
        onAnalyzeClick={() => handleAnalyze()}
        onPushClick={handlePushToGitHub}
        onDownloadClick={handleDownload}
        hasFiles={Object.keys(files).length > 0}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          <FileTree 
            files={files} 
            activeFile={activeFile}
            onFileSelect={setActiveFile}
          />
        </Sidebar>
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* View Toggle */}
          <div className="flex items-center gap-2 p-2 bg-dark-800 border-b border-dark-600">
            <button
              onClick={() => setView('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                view === 'edit' ? 'bg-accent-blue text-white' : 'hover:bg-dark-600'
              }`}
            >
              <Code2 size={18} />
              Code
            </button>
            <button
              onClick={() => setView('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                view === 'preview' ? 'bg-accent-blue text-white' : 'hover:bg-dark-600'
              }`}
            >
              <Play size={18} />
              Preview
            </button>
            <button
              onClick={() => setView('split')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                view === 'split' ? 'bg-accent-blue text-white' : 'hover:bg-dark-600'
              }`}
            >
              Split
            </button>
            
            {isGenerating && (
              <div className="flex items-center gap-2 ml-auto text-accent-blue">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mx-4 mt-2 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              {error}
              <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
            </div>
          )}
          
          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {(view === 'edit' || view === 'split') && (
              <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} overflow-hidden`}>
                <CodeEditor 
                  files={files}
                  activeFile={activeFile}
                  onFileChange={(filename, content) => {
                    setFiles(prev => ({ ...prev, [filename]: content }))
                  }}
                />
              </div>
            )}
            
            {(view === 'preview' || view === 'split') && (
              <div className={`${view === 'split' ? 'w-1/2 border-l border-dark-600' : 'w-full'} overflow-hidden`}>
                <Preview files={files} />
              </div>
            )}
          </div>
          
          {/* Analysis Panel */}
          {analysis && (
            <AnalysisPanel 
              analysis={analysis}
              onClose={() => setAnalysis(null)}
            />
          )}
          
          {/* Prompt Input */}
          <PromptInput 
            onSubmit={(prompt, projectName) => {
              if (Object.keys(files).length === 0) {
                handleGenerate(prompt, projectName)
              } else {
                handleIterate(prompt)
              }
            }}
            isLoading={isGenerating}
            hasProject={Object.keys(files).length > 0}
          />
        </main>
      </div>
      
      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-lg border border-dark-600">
            <h2 className="text-xl font-bold mb-4">Import GitHub Repository</h2>
            <input
              type="text"
              placeholder="https://github.com/owner/repo"
              className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:outline-none focus:border-accent-blue"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleImport((e.target as HTMLInputElement).value)
                }
              }}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowImport(false)}
                className="flex-1 py-2 border border-dark-500 rounded-lg hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="github"]') as HTMLInputElement
                  handleImport(input?.value)
                }}
                disabled={isImporting}
                className="flex-1 py-2 bg-accent-blue rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isImporting ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
