import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MODEL_OPTIONS = [
  { value: "openai/gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini", provider: "OpenAI" },
  { value: "openai/gpt-4-turbo", label: "GPT-4 Turbo", provider: "OpenAI" },
  { value: "openai/gpt-3.5-turbo", label: "GPT-3.5 Turbo", provider: "OpenAI" },
  { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { value: "anthropic/claude-3-opus", label: "Claude 3 Opus", provider: "Anthropic" },
  { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku", provider: "Anthropic" },
  { value: "google/gemini-pro-1.5", label: "Gemini 1.5 Pro", provider: "Google" },
  { value: "google/gemini-flash-1.5", label: "Gemini 1.5 Flash", provider: "Google" },
  { value: "meta-llama/llama-3.1-405b", label: "Llama 3.1 405B", provider: "Meta" },
  { value: "meta-llama/llama-3.1-70b", label: "Llama 3.1 70B", provider: "Meta" },
] as const

export type ModelOption = typeof MODEL_OPTIONS[number]

export interface ModelResult {
  id: string
  provider: string
  model: string
  status: "pending" | "running" | "completed" | "error"
  answer?: string
  error?: string
  elapsedMs?: number
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
    cost?: number
  }
  startedAt: number
  completedAt?: number
}

export interface ComparisonHistory {
  id: string
  prompt: string
  models: string[]
  results: ModelResult[]
  createdAt: number
}

export const STORAGE_KEYS = {
  API_KEY: "openrouter_api_key",
  SELECTED_MODELS: "selected_models",
  HISTORY: "comparison_history",
} as const