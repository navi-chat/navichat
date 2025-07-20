import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

export const textSplitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 50,
    chunkSize: 300
})