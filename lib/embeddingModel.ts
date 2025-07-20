import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"

export const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
})