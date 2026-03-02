'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, FileCode, FileJson, FileText, Palette } from 'lucide-react'

type Props = {
  files: { [filename: string]: string }
  activeFile: string
  onFileSelect: (filename: string) => void
}

type FileNode = {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  path?: string
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return <FileCode className="w-4 h-4 text-blue-400" />
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-400" />
    case 'css':
      return <Palette className="w-4 h-4 text-pink-400" />
    case 'md':
      return <FileText className="w-4 h-4 text-gray-400" />
    default:
      return <File className="w-4 h-4 text-gray-400" />
  }
}

const buildFileTree = (files: { [filename: string]: string }): FileNode[] => {
  const root: { [key: string]: FileNode } = {}
  
  Object.keys(files).forEach(filepath => {
    const parts = filepath.split('/')
    let current = root
    
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        // File
        current[part] = {
          name: part,
          type: 'file',
          path: filepath,
        }
      } else {
        // Folder
        if (!current[part]) {
          current[part] = {
            name: part,
            type: 'folder',
            children: [],
          }
        }
        current = current[part].children ? 
          current[part].children!.reduce((acc, node) => ({ ...acc, [node.name]: node }), {} as { [key: string]: FileNode }) : 
          {}
      }
    })
  })
  
  const convertToArray = (node: { [key: string]: FileNode }): FileNode[] => {
    return Object.values(node)
      .sort((a, b) => {
        // Folders first, then files
        if (a.type === 'folder' && b.type === 'file') return -1
        if (a.type === 'file' && b.type === 'folder') return 1
        return a.name.localeCompare(b.name)
      })
      .map(node => ({
        ...node,
        children: node.children ? convertToArray(node.children!.reduce((acc, n) => ({ ...acc, [n.name]: n }), {} as { [key: string]: FileNode })) : undefined
      }))
  }
  
  return convertToArray(root)
}

function FileTreeItem({ 
  node, 
  activeFile, 
  onFileSelect, 
  depth = 0 
}: { 
  node: FileNode
  activeFile: string
  onFileSelect: (filename: string) => void
  depth?: number 
}) {
  const [isOpen, setIsOpen] = useState(depth === 0)
  
  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-dark-700 rounded transition-colors file-tree-item"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <Folder className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-gray-300">{node.name}</span>
        </button>
        
        {isOpen && node.children && (
          <div>
            {node.children.map(child => (
              <FileTreeItem
                key={child.path || child.name}
                node={child}
                activeFile={activeFile}
                onFileSelect={onFileSelect}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <button
      onClick={() => node.path && onFileSelect(node.path)}
      className={`w-full flex items-center gap-2 px-2 py-1.5 hover:bg-dark-700 rounded transition-colors file-tree-item ${
        activeFile === node.path ? 'active bg-dark-700' : ''
      }`}
      style={{ paddingLeft: `${depth * 16 + 24}px` }}
    >
      {getFileIcon(node.name)}
      <span className="text-sm text-gray-300">{node.name}</span>
    </button>
  )
}

export default function FileTree({ files, activeFile, onFileSelect }: Props) {
  const fileTree = buildFileTree(files)
  const fileCount = Object.keys(files).length
  
  if (fileCount === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-dark-600">
          <h3 className="font-semibold text-sm">Files</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
          <div>
            <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No files yet</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-dark-600 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Files</h3>
        <span className="text-xs text-gray-500">{fileCount} files</span>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {fileTree.map(node => (
          <FileTreeItem
            key={node.path || node.name}
            node={node}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  )
}
