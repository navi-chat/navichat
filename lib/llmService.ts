import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

export const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
});