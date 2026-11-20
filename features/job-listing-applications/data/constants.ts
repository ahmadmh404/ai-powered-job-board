export const RATING_OPTIONS = [null, 1, 2, 3, 4, 5] as const;

// AI
export const GROQ_BASE_URL = "https://groq.com";
export const CEREBRAS_BASE_URL = "https://cerebras.ai";

export const AI_MODELS = {
  HIGH_REASONING: "gpt-oss-120b",
  LOW_REASONING: "gpt-oss-20b",
} as const;
