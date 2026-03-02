'use client'

import { useState, useEffect, useRef } from 'react'
import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react'

type Props = {
  files: { [filename: string]: string }
  projectName: string
}

export default function Preview({ files, projectName }: Props) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [key, setKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  const generatePreviewHTML = (): string => {
    // Get the main component files
    const appTsx = files['App.tsx'] || ''
    const indexTsx = files['index.tsx'] || ''
    const indexCss = files['index.css'] || ''
    
    // Simple transpilation for preview (in production, use actual transpiler)
    const transpileTSX = (code: string): string => {
      return code
        .replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '')
        .replace(/export\s+default\s+/g, '')
        .replace(/interface\s+\w+\s*\{[\s\S]*?\}\n?/g, '')
        .replace(/type\s+\w+\s*=\s*[^;]+;?\n?/g, '')
        .replace(/:\s*(string|number|boolean|any|void|React\.\w+|\{\s*\w+\s*\})/g, '')
        .replace(/<(\w+)([^>]*)>/g, '<$1$2>')
    }
    
    const appCode = transpileTSX(appTsx)
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <style>
    ${indexCss}
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useCallback, useRef } = React;
    
    ${appCode}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
  </script>
</body>
</html>
    `
  }

  const previewHTML = Object.keys(files).length > 0 ? generatePreviewHTML() : ''

  return (
    <div className="h-full flex flex-col bg-dark-900">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-dark-600">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">Preview</span>
          {projectName && (
            <span className="text-xs text-gray-500">• {projectName}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Device toggles */}
          <div className="flex items-center bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded ${device === 'desktop' ? 'bg-accent-blue' : 'hover:bg-dark-600'}`}
              title="Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded ${device === 'tablet' ? 'bg-accent-blue' : 'hover:bg-dark-600'}`}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded ${device === 'mobile' ? 'bg-accent-blue' : 'hover:bg-dark-600'}`}
              title="Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setKey(k => k + 1)}
            className="p-2 hover:bg-dark-700 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Preview iframe */}
      <div className="flex-1 flex items-start justify-center p-4 bg-dark-800/50 overflow-auto">
        {Object.keys(files).length > 0 ? (
          <iframe
            key={key}
            ref={iframeRef}
            srcDoc={previewHTML}
            className="bg-white rounded-lg shadow-2xl transition-all duration-300"
            style={{ 
              width: deviceWidths[device],
              height: device === 'desktop' ? '100%' : device === 'tablet' ? '1024px' : '667px',
              minHeight: '500px',
              border: 'none',
            }}
            sandbox="allow-scripts allow-modals"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Monitor className="w-16 h-16 mb-4 opacity-50" />
            <p>No preview available</p>
            <p className="text-sm">Generate or import a project to see the preview</p>
          </div>
        )}
      </div>
    </div>
  )
}
