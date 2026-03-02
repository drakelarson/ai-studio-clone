# API Keys Setup Guide

To use the AI Studio Clone, you need at least one API key from a supported provider.

## Option 1: OpenRouter (Recommended)

OpenRouter provides access to 100+ models through a single API.

1. Go to [openrouter.ai](https://openrouter.ai)
2. Create an account
3. Navigate to [Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Add to your `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-...
```

**Benefits:**
- Single key for all models
- Pay-as-you-go pricing
- Access to open models (Llama, Mistral, DeepSeek)
- Automatic fallbacks

## Option 2: Direct Provider Keys

### Google AI Studio (Free Tier Available)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google
3. Click "Get API Key" in the sidebar
4. Create a new API key
5. Add to your `.env.local`:

```env
GOOGLE_API_KEY=AIza...
```

**Free Tier:**
- 15 RPM (requests per minute)
- 1 million tokens per day
- Gemini 2.5 Flash/Pro

### OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account
3. Navigate to API Keys
4. Create a new secret key
5. Add to your `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

**Pricing:** Pay-as-you-go, starts at $5

### Anthropic

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account
3. Navigate to API Keys
4. Create a new key
5. Add to your `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

**Pricing:** Pay-as-you-go, starts at $5

## Setting Keys in zo.space

For the backend API routes on zo.space:

1. Go to [Settings > Advanced](/?t=settings&s=advanced)
2. Scroll to **Secrets** section
3. Add your API keys:
   - `OPENROUTER_API_KEY`
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_API_KEY`
4. Click Save

## Security Notes

- **Never commit API keys to git**
- Add `.env.local` to `.gitignore`
- Rotate keys if they're ever exposed
- Use environment variables in production
- Consider using a secrets manager for team projects

## Cost Estimation

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Gemini 2.5 Flash | $0.075 | $0.30 |
| Gemini 3.1 Pro | $0.31 | $1.25 |
| GPT-4o | $2.50 | $10.00 |
| GPT-4o Mini | $0.15 | $0.60 |
| Claude Sonnet 4 | $3.00 | $15.00 |
| Claude Opus 4 | $15.00 | $75.00 |

**Tip:** Start with Gemini 2.5 Flash or GPT-4o Mini for testing - they're the most cost-effective.
