# AI Studio Clone

A functional clone of Google AI Studio's Build Mode, powered by MiniMax M2.5 and deployed on Vercel + zo.space.

## Features

- ✨ **Generate apps from natural language** - Describe what you want, AI builds it
- 🔄 **Iterate with conversation** - Refine your app with natural language feedback
- 📥 **Import existing repositories** - AI understands and describes codebases
- 🎨 **Live preview** - See your app in real-time with device switching
- 📁 **File tree navigation** - Browse and edit all generated files
- 🚀 **Push to GitHub** - Version control and Vercel auto-deploy

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User's Browser                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  Vercel Frontend                            ││
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ ││
│  │  │ Prompt  │  │ Code     │  │ Preview  │  │ File Tree   │ ││
│  │  │ Input   │  │ Editor   │  │ Pane     │  │ Sidebar     │ ││
│  │  └────┬────┘  └────┬─────┘  └────┬─────┘  └─────────────┘ ││
│  └───────┼────────────┼─────────────┼──────────────────────────┘│
│          │            │             │                            │
└──────────┼────────────┼─────────────┼────────────────────────────┘
           │            │             │
           ▼            ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     zo.space API Routes                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ /api/generate│  │ /api/iterate │  │ /api/preview │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
│         │                 │                                      │
│  ┌──────┴─────────────────┴───────┐  ┌──────────────┐          │
│  │      api.zo.computer/zo/ask    │  │ /api/github  │          │
│  │         (MiniMax M2.5)         │  │ /api/import  │          │
│  │         FREE - 196K ctx        │  │ /api/analyze │          │
│  └────────────────────────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Setup

### 1. Clone and Install

```bash
git clone <your-repo>
cd ai-studio-clone
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# Zo Space API (required)
NEXT_PUBLIC_ZO_SPACE_URL=https://your-username.zo.space

# GitHub (optional - for import/push features)
GITHUB_TOKEN=ghp_your_token_here
```

### 3. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Routes (zo.space)

All backend logic runs on zo.space:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/generate` | POST | Generate app from prompt |
| `/api/iterate` | POST | Refine existing app |
| `/api/preview` | POST | Transform for preview |
| `/api/github` | POST | Push to GitHub |
| `/api/import-repo` | POST | Import GitHub repo |
| `/api/analyze-repo` | POST | AI analysis of codebase |

### Example Request

```bash
curl -X POST https://your-username.zo.space/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Build a todo app", "projectName": "my-todos"}'
```

## Usage

### Generate New App

1. Enter project name (optional)
2. Describe your app: "Build a weather dashboard with charts"
3. Click **Generate**
4. Preview and iterate

### Import Existing Repo

1. Click **Import** button in sidebar
2. Enter GitHub URL: `https://github.com/user/repo`
3. AI analyzes and describes the codebase
4. Suggests improvements

### Iterate on Project

1. With existing files, type: "Add dark mode"
2. AI updates relevant files
3. Preview refreshes automatically
4. Continue iterating

### Push to GitHub

1. Click **Push to GitHub** button
2. Creates/updates repository
3. Vercel auto-deploys if connected

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: zo.space (Bun + Hono)
- **AI**: MiniMax M2.5 (FREE via Zo)
- **Deployment**: Vercel (frontend) + zo.space (API)

## Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### zo.space (API)

The API routes are already deployed at your zo.space URL.

## Development

### Project Structure

```
ai-studio-clone/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Global styles
├── components/
│   ├── Header.tsx      # Top navigation
│   ├── Sidebar.tsx     # Left sidebar
│   ├── PromptInput.tsx # Prompt textarea
│   ├── CodeEditor.tsx  # Code display
│   ├── Preview.tsx     # Live preview
│   ├── FileTree.tsx    # File navigation
│   └── AnalysisPanel.tsx # Repo analysis
├── lib/
│   └── api.ts          # API client
├── hooks/
│   └── useProject.ts   # Project state
└── package.json
```

### Adding Features

1. **New API route**: Add in zo.space
2. **New component**: Add in `/components`
3. **New hook**: Add in `/hooks`

## License

MIT

## Credits

- Inspired by [Google AI Studio](https://aistudio.google.com/)
- AI powered by [MiniMax M2.5](https://minimax.io/)
- Built with [Zo Computer](https://zo.computer/)
