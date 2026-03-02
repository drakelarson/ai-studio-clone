import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, RunSettings, Project } from '@/types';

export interface AppState {
  // Current chat state
  messages: Message[];
  systemPrompt: string;
  model: string;
  settings: RunSettings;
  isLoading: boolean;
  error: string | null;

  // Projects
  projects: Project[];
  currentProjectId: string | null;

  // Sidebar state
  sidebarOpen: boolean;
  settingsPanelOpen: boolean;

  // API Key (stored locally)
  apiKey: string;
  provider: 'openai' | 'anthropic' | 'google' | 'openrouter';

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, content: string) => void;
  clearMessages: () => void;
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setSettings: (settings: Partial<RunSettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Project actions
  createProject: () => void;
  loadProject: (id: string) => void;
  saveProject: () => void;
  deleteProject: (id: string) => void;

  // UI actions
  toggleSidebar: () => void;
  toggleSettingsPanel: () => void;

  // API actions
  setApiKey: (key: string) => void;
  setProvider: (provider: 'openai' | 'anthropic' | 'google' | 'openrouter') => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultSettings: RunSettings = {
  temperature: 1.0,
  maxTokens: 8192,
  thinking: 'none',
  tools: {
    googleSearch: false,
    codeExecution: false,
    urlContext: false,
    fileSearch: false,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      systemPrompt: '',
      model: 'gemini-2.5-flash',
      settings: defaultSettings,
      isLoading: false,
      error: null,
      projects: [],
      currentProjectId: null,
      sidebarOpen: true,
      settingsPanelOpen: true,
      apiKey: '',
      provider: 'openrouter',

      // Message actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }],
      })),

      updateMessage: (id, content) => set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id ? { ...m, content } : m
        ),
      })),

      clearMessages: () => set({ messages: [] }),

      // Settings actions
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      setModel: (model) => set({ model }),
      setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Project actions
      createProject: () => {
        const state = get();
        const project: Project = {
          id: generateId(),
          name: `Project ${state.projects.length + 1}`,
          messages: state.messages,
          systemPrompt: state.systemPrompt,
          model: state.model,
          settings: state.settings,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((s) => ({
          projects: [...s.projects, project],
          currentProjectId: project.id,
        }));
      },

      loadProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (project) {
          set({
            messages: project.messages,
            systemPrompt: project.systemPrompt,
            model: project.model,
            settings: project.settings,
            currentProjectId: id,
          });
        }
      },

      saveProject: () => {
        const state = get();
        if (state.currentProjectId) {
          set((s) => ({
            projects: s.projects.map((p) =>
              p.id === state.currentProjectId
                ? {
                    ...p,
                    messages: state.messages,
                    systemPrompt: state.systemPrompt,
                    model: state.model,
                    settings: state.settings,
                    updatedAt: new Date(),
                  }
                : p
            ),
          }));
        }
      },

      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
      })),

      // UI actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSettingsPanel: () => set((state) => ({ settingsPanelOpen: !state.settingsPanelOpen })),

      // API actions
      setApiKey: (key) => set({ apiKey: key }),
      setProvider: (provider) => set({ provider }),
    }),
    {
      name: 'ai-studio-storage',
      partialize: (state) => ({
        projects: state.projects,
        model: state.model,
        settings: state.settings,
        systemPrompt: state.systemPrompt,
        apiKey: state.apiKey,
        provider: state.provider,
      }),
    }
  )
);
