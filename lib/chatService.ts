'use server'
import { Annotation, END, MemorySaver, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph"
import { llm } from "./llmService"
import { v4 as uuidv4 } from "uuid"
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { Message } from "@/components/PlaygroundBotInterface"
import { getContactById, getContactsList, matchContacts } from "./actions/contacts.actions"
import { getTextById, getTextsList, matchTexts } from "./actions/texts.actions"
import { getFAQById, getFAQsList, matchFAQs } from "./actions/faqs.actions"
import { getProductById, getProductsList, matchProducts } from "./actions/products.actions"
import { embeddingsModel } from "./embeddingModel"
import { textSplitter } from "./textSplitterModel"
import { cosineSimilarity } from "./cosine"

llm.maxOutputTokens = 500

const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y)
    })
})

const memory = new MemorySaver();

const dataTool = tool(async ({ query, bot_id }: { query: string, bot_id: string }) => {
    const query_embedding = await embeddingsModel.embedQuery(query)
    const scoredResults: { text: string; score: number }[] = [];

    const textsRes = await matchTexts({ bot_id, embedding: query_embedding })
    const faqsRes = await matchFAQs({ bot_id, embedding: query_embedding })
    const productsRes = await matchProducts({ bot_id, embedding: query_embedding })

    faqsRes.data.forEach((faq: any) => {
        scoredResults.push({
            text: `Question: ${faq.question}, Answer: ${faq.answer}`,
            score: faq.score
        })
    })
    for (const text of textsRes.data) {
        const chunks = await textSplitter.splitText(text.text);
        const scoredChunks: { chunk: string; score: number }[] = [];

        for (const chunk of chunks) {
            const chunkEmbedding = await embeddingsModel.embedQuery(chunk);
            const score = cosineSimilarity(query_embedding, chunkEmbedding);
            scoredChunks.push({ chunk, score });
        }

        scoredChunks.sort((a, b) => b.score - a.score);

        const bestChunks = scoredChunks.slice(0, 2).map(c => c.chunk).join("\n");
        const finalResult = `Title: ${text.title}\nText: ${bestChunks}`;

        scoredResults.push({
            text: finalResult,
            score: text.score, // NOTE: You might want to use top `chunk.score` instead?
        });
    }

    productsRes.data.forEach((product: any) => {
        const priceStr = product.price !== null ? ` Price: ${product.price} ${product.currency}` : "";
        scoredResults.push({
            text: `Title: ${product.title}, Description: ${product.description}${priceStr} ${product.image_urls.length > 0 && `Images: ${product.image_urls.join(',')}`}`,
            score: product.score
        });
    })

    scoredResults.sort((a, b) => a.score - b.score);
    const topK = scoredResults.slice(0, 5)

    return {
        result: topK.length
            ? topK.flatMap((x) => x.text).join('\n')
            : "No relevant information found.",
    };

}, {
    name: "data_search",
    description: "Search for data (texts, faqs, products) to provide customer support.",
    schema: z.object({
        query: z.string().describe('Query string from the user. Use the exact or similar wording since it may match entries in FAQs, texts, or products. Include the company name in context instead of generic keywords if required.'),
        bot_id: z.string().describe('The bot Id.')
    })
});

const contactTool = tool(async ({ bot_id, query }: { bot_id: string, query?: string }) => {
    if (query) {
        const query_embedding = await embeddingsModel.embedQuery(query)
        const res = await matchContacts({ bot_id, embedding: query_embedding })
        return res.data?.flatMap((contact: any) => `Contact (${contact.type}): ${contact.contact}`) ?? 'No Contacts found.'
    } else {

        const res = await getContactsList({ bot_id })
        return res.data?.flatMap((contact) => `Contact (${contact.type}): ${contact.contact}`) ?? 'No Contacts found.'
    }
}, {
    name: "get_contacts",
    description: "Get the contacts related to the company.",
    schema: z.object({
        query: z.string().describe('The type of contact you want. It is optional.').optional(),
        bot_id: z.string().describe('The bot Id.')
    })
})

const productTool = tool(async ({ bot_id, id, query }: { bot_id: string, query?: string, id?: string }) => {
    if (query) {
        const query_embedding = await embeddingsModel.embedQuery(query)
        const res = await matchProducts({ bot_id, embedding: query_embedding })
        const scoredResults: { text: string; score: number }[] = [];

        res.data.forEach((product: any) => {
            const priceStr = product.price !== null ? ` Price: ${product.price} ${product.currency}` : "";
            scoredResults.push({
                text: `Title: ${product.title}, Description: ${product.description}${priceStr} ${product.image_urls.length > 0 && `Images: ${product.image_urls.join(',')}`}`,
                score: product.score
            });
        })
        scoredResults.sort((a, b) => a.score - b.score);
        const topK = scoredResults.slice(0, 5)

        return {
            result: topK.length
                ? topK.flatMap((x) => x.text).join('\n')
                : "No relevant product information found.",
        };
    } else if (id) {
        const res = await getProductById({ id })
        if(res.data){
            const priceStr = res.data.price !== null ? ` Price: ${res.data.price} ${res.data.currency}` : "";
            const result = {
                text: `Title: ${res.data.title}, Description: ${res.data.description}${priceStr} ${res.data.image_urls.length > 0 && `Images: ${res.data.image_urls.join(',')}`}`,
                score: res.data.score
            }
            return { result: result }
        } else {
            return { result: "No relevant product information found." }
        }
    } else {
        const res = await getProductsList({ bot_id })
        return res.data?.flatMap((product) => `Product : ${product.title}, Id: ${product.id}`) ?? 'No Products found.'
    }
}, {
    name: "get_products",
    description: "Get the products offered by the company.",
    schema: z.object({
        query: z.string().describe('The type of product you want. It is optional.').optional(),
        bot_id: z.string().describe('The bot Id.'),
        id: z.string().describe("The id of the product. It is optional.").optional()
    })
})

const tools = [dataTool, contactTool, productTool]
const toolNode = new ToolNode<typeof AgentState.State>(tools)
const boundModel = llm.bindTools(tools)

function shouldContinue(state: typeof AgentState.State): "action" | typeof END {
    const lastMessage = state.messages[state.messages.length - 1]
    if (lastMessage && !(lastMessage as AIMessage).tool_calls?.length) {
        return END;
    }
    return "action"
}

const callModel = async (state: typeof AgentState.State) => {
    const res = await boundModel.invoke(state.messages)
    return { messages: res }
}

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("action", toolNode)
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("action", "agent")
    .addEdge(START, "agent")

const app = workflow.compile({ checkpointer: memory })

export const runAgent = async (messages_req: Message[]) => {
    const config = {
        configurable: {
            thread_id: uuidv4(),
        },
    };
    const messages = messages_req.map((msg) => msg.role === "system" ? new SystemMessage(msg.content) : msg.role === "ai" ? new AIMessage(msg.content) : new HumanMessage(msg.content))

    const result = await app.invoke({ messages }, config);

    const newMessages: Message[] = [...messages_req, { role: "ai", content: result.messages[result.messages.length - 1].content.toString() }]

    return newMessages;
};