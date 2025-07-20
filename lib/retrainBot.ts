import { z } from "zod";
import { model } from "./llmService";


const source_data = z.object({
    title: z.string().describe("Proper title for the given information."),
    data_list: z.array(z.string().describe("Short useful sentences (unique) that holds useful information."))
})

export const getSourceDataList = async (data: string) => {
    return await (model.withStructuredOutput(source_data)).invoke(`Use this data and break it into small independent sentences - ${data}`)
}
