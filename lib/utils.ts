export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`;
  }
  return tokens.toString();
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  inputPrice: number,
  outputPrice: number
): string {
  const cost = (inputTokens * inputPrice) + (outputTokens * outputPrice);
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(2)}K`;
  }
  return `$${cost.toFixed(4)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function generateCodeSnippet(
  messages: Array<{ role: string; content: string }>,
  model: string,
  systemPrompt: string,
  temperature: number,
  language: 'python' | 'javascript' | 'curl'
): string {
  const formattedMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  switch (language) {
    case 'python':
      return `import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

model = genai.GenerativeModel('${model}')

response = model.generate_content(
    ${JSON.stringify(formattedMessages.map(m => m.content).join('\n'), null, 2)},
    generation_config=genai.types.GenerationConfig(
        temperature=${temperature},
    )
)

print(response.text)`;

    case 'javascript':
      return `const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "${model}" });

const result = await model.generateContent({
  messages: ${JSON.stringify(formattedMessages, null, 2)},
  generationConfig: {
    temperature: ${temperature},
  },
});

console.log(result.response.text());`;

    case 'curl':
      return `curl "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=YOUR_API_KEY" \\
  -H 'Content-Type: application/json' \\
  -d '{
    "contents": [{
      "parts": [{
        "text": ${JSON.stringify(formattedMessages.map(m => m.content).join('\n'))}
      }]
    }],
    "generationConfig": {
      "temperature": ${temperature}
    }
  }'`;

    default:
      return '';
  }
}
