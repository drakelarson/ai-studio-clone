'use client'

import { X, Lightbulb, Wrench, Layers, Star, FileCode } from 'lucide-react'

type Analysis = {
  summary: string
  tech_stack: string[]
  architecture: string
  features: string[]
  suggestions: string[]
  file_purposes: { [file: string]: string }
}

type Props = {
  analysis: Analysis
  onClose: () => void
}

export default function AnalysisPanel({ analysis, onClose }: Props) {
  return (
    <div className="absolute inset-0 bg-dark-900/95 z-20 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Repository Analysis</h2>
              <p className="text-sm text-gray-400">AI-powered code understanding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Summary */}
        <div className="bg-dark-800 rounded-xl p-5 mb-4 border border-dark-600">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Summary</h3>
          <p className="text-gray-200 leading-relaxed">{analysis.summary}</p>
        </div>
        
        {/* Tech Stack */}
        <div className="bg-dark-800 rounded-xl p-5 mb-4 border border-dark-600">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.tech_stack.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-dark-700 rounded-lg text-sm border border-dark-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {/* Architecture */}
        <div className="bg-dark-800 rounded-xl p-5 mb-4 border border-dark-600">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Architecture</h3>
          <p className="text-gray-200 leading-relaxed">{analysis.architecture}</p>
        </div>
        
        {/* Features */}
        <div className="bg-dark-800 rounded-xl p-5 mb-4 border border-dark-600">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-accent-orange" />
            <h3 className="text-sm font-semibold text-gray-400">Key Features</h3>
          </div>
          <ul className="space-y-2">
            {analysis.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent-green mt-1">✓</span>
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Suggestions */}
        <div className="bg-dark-800 rounded-xl p-5 mb-4 border border-dark-600">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-semibold text-gray-400">Suggested Improvements</h3>
          </div>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent-blue mt-1">→</span>
                <span className="text-gray-300 text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* File Purposes */}
        {Object.keys(analysis.file_purposes).length > 0 && (
          <div className="bg-dark-800 rounded-xl p-5 border border-dark-600">
            <div className="flex items-center gap-2 mb-3">
              <FileCode className="w-4 h-4 text-accent-blue" />
              <h3 className="text-sm font-semibold text-gray-400">File Analysis</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {Object.entries(analysis.file_purposes).map(([file, purpose], i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-dark-700 last:border-0">
                  <code className="text-sm text-accent-blue flex-shrink-0">{file}</code>
                  <span className="text-sm text-gray-400">{purpose}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-accent-blue rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  )
}
