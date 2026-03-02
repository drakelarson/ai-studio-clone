export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  tokens?: {
    prompt: number;
    completion: number;
  };
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  pricing: {
    input: number;
    output: number;
  };
  features: string[];
  description: string;
}

export interface Project {
  id: string;
  name: string;
  messages: Message[];
  systemPrompt: string;
  model: string;
  settings: RunSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface RunSettings {
  temperature: number;
  maxTokens: number;
  thinking: "none" | "low" | "medium" | "high";
  tools: {
    googleSearch: boolean;
    codeExecution: boolean;
    urlContext: boolean;
    fileSearch: boolean;
  };
}

export interface ChatState {
  messages: Message[];
  systemPrompt: string;
  model: string;
  settings: RunSettings;
  isLoading: boolean;
  error: string | null;
}

export interface ModelsResponse {
  models: Model[];
  providers: string[];
  default: string;
}
