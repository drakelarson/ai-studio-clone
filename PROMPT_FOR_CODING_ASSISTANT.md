# Prompt for Coding Assistant - Build AI Studio Clone

## Task

Build a complete, production-ready clone of Google AI Studio's Build Mode. This is a web application that allows users to generate React applications from natural language prompts using AI.

## Overview

The app has two main parts:
1. **Frontend** (Vercel): Next.js application with code editor, preview, and prompt input
2. **Backend** (zo.space): API routes that call MiniMax M2.5 for code generation

## Architecture

```
User → Vercel Frontend → zo.space API → MiniMax M2.5 (via Zo)
                                    ↓
                                GitHub (optional)
```

## Core Features to Implement

### 1. App Generation Flow
- User enters a prompt describing the app they want
- Frontend calls `/api/generate` on zo.space
- API uses MiniMax M2.5 to generate React code
- Returns multiple files (App.tsx, index.tsx, index.css, etc.)
- Frontend displays files in a tree structure
- Live preview shows the generated app

### 2. Iteration Flow
- User types natural language feedback: "Add dark mode"
- Frontend calls `/api/iterate` with current files + prompt
- AI updates specific files based on the request
- Preview refreshes with changes
- Conversation continues for multiple iterations

### 3. Import Repository Flow
- User provides GitHub URL
- Frontend calls `/api/import-repo`
- API fetches all files from the repository
- User can then call `/api/analyze-repo`
- AI generates comprehensive analysis:
  - Summary of what the codebase does
  - Tech stack identification
  - Architecture overview
  - Key features list
  - Suggested improvements
  - File-by-file purpose descriptions

### 4. GitHub Integration
- User can push generated app to GitHub
- Creates new repo or updates existing
- Uses proper commit messages
- Enables Vercel auto-deploy

### 5. Live Preview
- Transforms TSX to browser-runnable code
- Uses Babel standalone for transpilation
- Injects React/ReactDOM from CDN
- Supports responsive preview (desktop/tablet/mobile)
- Refresh button to reload preview

## Technical Requirements

### Frontend (Next.js)

**Pages:**
- `/` - Main app interface

**Components:**
- `Header` - Logo, info, GitHub link
- `Sidebar` - New project, import repo buttons
- `PromptInput` - Textarea with suggestions
- `CodeEditor` - Syntax highlighted code display with line numbers
- `Preview` - Iframe showing live app with device switcher
- `FileTree` - Hierarchical file browser
- `AnalysisPanel` - Repo analysis display

**State Management:**
- Files object: `{ [filename: string]: string }`
- Active file: string
- Conversation ID: string (for iteration context)
- Loading states: isGenerating, isImporting, isAnalyzing
- View mode: 'edit' | 'preview' | 'split'

**Styling:**
- Tailwind CSS with dark theme
- Custom colors: dark-900, dark-800, accent-blue, accent-purple
- Smooth transitions and hover effects
- Responsive layout

### Backend (zo.space Routes)

All routes should:
- Return JSON with `{ success: boolean, ...data }`
- Handle errors gracefully
- Use `ZO_CLIENT_IDENTITY_TOKEN` for Zo API auth
- Call MiniMax M2.5 via `api.zo.computer/zo/ask`
- Support CORS for frontend calls

**Route: `/api/generate`**
```typescript
Input: { prompt: string, projectName: string }
Process:
  1. Build system prompt for app generation
  2. Call MiniMax with structured output format
  3. Parse response into file map
  4. Return files + conversation ID
Output: { 
  success: true, 
  files: { [filename: string]: string },
  conversationId: string 
}
```

**Route: `/api/iterate`**
```typescript
Input: { 
  prompt: string, 
  files: { [filename: string]: string },
  conversationId?: string 
}
Process:
  1. Build context with current files
  2. Call MiniMax with iteration prompt
  3. Parse updated/new/deleted files
  4. Return changes
Output: { 
  success: true, 
  files: { [filename: string]: string },
  deleted: string[] 
}
```

**Route: `/api/preview`**
```typescript
Input: { files: { [filename: string]: string } }
Process:
  1. Transform TSX to browser-runnable code
  2. Strip TypeScript types
  3. Wrap in HTML with React CDN
Output: { html: string }
```

**Route: `/api/import-repo`**
```typescript
Input: { repoUrl: string }
Process:
  1. Parse owner/repo from URL
  2. Fetch file tree from GitHub API
  3. Get content for each file
  4. Filter out binary/large files
Output: { 
  success: true, 
  files: { [filename: string]: string },
  repoInfo: { name, description, stars, ... } 
}
```

**Route: `/api/analyze-repo`**
```typescript
Input: { 
  files: { [filename: string]: string },
  repoInfo: { ... } 
}
Process:
  1. Build analysis prompt
  2. Send files + context to MiniMax
  3. Parse structured analysis
Output: {
  success: true,
  analysis: {
    summary: string,
    tech_stack: string[],
    architecture: string,
    features: string[],
    suggestions: string[],
    file_purposes: { [file: string]: string }
  }
}
```

**Route: `/api/github`**
```typescript
Input: { 
  action: 'create' | 'push',
  files: { [filename: string]: string },
  repoName: string,
  message: string 
}
Process:
  1. Create repo (if action === 'create')
  2. Push files as commit
  3. Return repo URL
Output: { 
  success: true, 
  repo: { html_url, clone_url, ... } 
}
```

## MiniMax M2.5 Integration

### System Prompts

**For Generation:**
```
You are an expert React developer. Generate a complete React application based on the user's description.

Rules:
1. Use TypeScript (.tsx) for all components
2. Use Tailwind CSS for styling
3. Create multiple files: App.tsx, index.tsx, index.css
4. Use React hooks (useState, useEffect, etc.)
5. Make it functional and visually appealing
6. Include all necessary imports
7. No placeholder code - everything should work

Output format:
--- filename.tsx ---
<code>
--- filename.tsx ---
<code>
```

**For Iteration:**
```
You are refining an existing React application based on user feedback.

Current files:
--- App.tsx ---
<current code>

User request: "Add dark mode"

Update the files as needed. Output only changed/new files.
Mark deleted files with: DELETE: filename.tsx
```

**For Analysis:**
```
Analyze this codebase and provide:

1. Summary: What does this application do?
2. Tech Stack: List technologies/frameworks used
3. Architecture: Describe the code structure
4. Features: List key functionality
5. Suggestions: 3-5 improvements
6. File Purposes: Brief description for each file

Output as JSON.
```

### API Call Pattern

```typescript
const response = await fetch("https://api.zo.computer/zo/ask", {
  method: "POST",
  headers: {
    "Authorization": process.env.ZO_CLIENT_IDENTITY_TOKEN,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    input: fullPrompt,
    model_name: "openrouter:minimax/minimax-m2.5",
  }),
});

const data = await response.json();
const aiOutput = data.output;
```

## UI/UX Requirements

### Layout
- Dark theme with gradients
- Three-panel layout: Sidebar | Editor/Tree | Preview
- Resizable panels (optional)
- Tabs for multiple open files (optional)

### Animations
- Smooth transitions for file tree expand/collapse
- Loading shimmer for code generation
- Subtle hover effects on interactive elements
- Glow effects on active elements

### Responsive
- Mobile: Stack panels vertically
- Tablet: Collapsible sidebar
- Desktop: Full three-panel view

### Accessibility
- Keyboard navigation
- ARIA labels
- High contrast text
- Focus indicators

## File Structure to Create

```
ai-studio-clone/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── PromptInput.tsx
│   ├── CodeEditor.tsx
│   ├── Preview.tsx
│   ├── FileTree.tsx
│   └── AnalysisPanel.tsx
├── lib/
│   └── api.ts (optional - can inline in page.tsx)
├── hooks/
│   └── useProject.ts (optional - can use state in page.tsx)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
└── .env.example
```

## Environment Variables

- `NEXT_PUBLIC_ZO_SPACE_URL` - Your zo.space URL (e.g., https://yourname.zo.space)
- `GITHUB_TOKEN` - Optional, for import/push features

## Testing the Build

1. Generate: "Build a counter app with increment and decrement buttons"
   - Should create App.tsx, index.tsx, index.css
   - Preview should show working counter

2. Iterate: "Add a reset button"
   - Should update App.tsx with reset functionality
   - Preview should update

3. Import: "https://github.com/facebook/react"
   - Should fetch and display React repo files
   - Analysis should describe React's architecture

## Deployment Checklist

- [ ] All components render without errors
- [ ] API routes return proper responses
- [ ] Preview displays generated apps
- [ ] File tree navigates correctly
- [ ] Iteration preserves conversation context
- [ ] Import handles large repos gracefully
- [ ] Analysis provides useful insights
- [ ] GitHub push creates proper commits
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Environment variables documented

## Success Criteria

The clone should feel like a polished product:
- Clean, modern UI similar to Google AI Studio
- Fast response times (streaming if possible)
- Accurate code generation
- Meaningful repo analysis
- Smooth iteration flow
- One-click deploy to GitHub

Build this as if it will be used by real developers to prototype real applications.
