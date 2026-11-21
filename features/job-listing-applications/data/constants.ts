export const RATING_OPTIONS = [null, 1, 2, 3, 4, 5] as const;

// AI
export const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

export const AI_MODELS = {
  HIGH_REASONING: "openai/gpt-oss-120b",
  LOW_REASONING: "openai/gpt-oss-20b",
} as const;
