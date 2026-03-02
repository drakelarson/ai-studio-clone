'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  code: string
  filename: string
  onChange?: (code: string) => void
  readOnly?: boolean
}

export default function CodeEditor({ code, filename, onChange, readOnly = true }: Props) {
  const codeRef = useRef<HTMLElement>(null)
  const [highlighted, setHighlighted] = useState('')

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const langMap: { [key: string]: string } = {
      'ts': 'typescript',
      'tsx': 'tsx',
      'js': 'javascript',
      'jsx': 'jsx',
      'css': 'css',
      'json': 'json',
      'sh': 'bash',
      'py': 'python',
      'md': 'markdown',
    }
    return langMap[ext || ''] || 'typescript'
  }

  useEffect(() => {
    // Dynamic import of Prism only on client side
    const loadPrism = async () => {
      const Prism = await import('prismjs')
      
      // Load language components
      await import('prismjs/components/prism-typescript')
      await import('prismjs/components/prism-tsx')
      await import('prismjs/components/prism-javascript')
      await import('prismjs/components/prism-jsx')
      await import('prismjs/components/prism-css')
      await import('prismjs/components/prism-json')
      await import('prismjs/components/prism-bash')
      await import('prismjs/components/prism-python')
      
      const lang = getLanguage(filename)
      const grammar = Prism.default.languages[lang] || Prism.default.languages.typescript
      const highlighted = Prism.default.highlight(code, grammar, lang)
      setHighlighted(highlighted)
    }
    
    loadPrism().catch(() => {
      // Fallback to plain text if Prism fails
      setHighlighted(code)
    })
  }, [code, filename])

  return (
    <div className="h-full flex flex-col bg-dark-900">
      {/* Minimap indicator */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-dark-600">
        <span className="text-xs text-gray-400">{filename}</span>
        <span className="text-xs text-gray-500">
          {code.split('\n').length} lines
        </span>
      </div>
      
      {/* Code area */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="flex">
          {/* Line numbers */}
          <div className="flex-shrink-0 pr-4 pl-4 py-4 text-right text-gray-600 text-sm font-mono select-none bg-dark-800/50">
            {code.split('\n').map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
          
          {/* Code content */}
          <div className="flex-1 py-4 pr-4">
            <pre className={`language-${getLanguage(filename)}`}>
              <code 
                ref={codeRef} 
                className={`language-${getLanguage(filename)}`}
                dangerouslySetInnerHTML={{ __html: highlighted || code }}
              />
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
