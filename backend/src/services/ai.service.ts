import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (apiKey) {
  openai = new OpenAI({ apiKey });
}

export const getAIClient = () => {
  if (!openai) {
    throw new Error("AI service not configured");
  }
  return openai;
};
