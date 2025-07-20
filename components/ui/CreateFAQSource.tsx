"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import { Loader, MinusCircle, PlusCircleIcon } from "lucide-react"
import { useParams, } from "next/navigation"
import { createFaq } from "@/lib/actions/faqs.actions"
import { Textarea } from "./textarea"
import { useSources } from "@/app/(root)/editor/chat-bots/[bot_id]/sources/layout"
import { embeddingsModel } from "@/lib/embeddingModel"
import { useFAQSource } from "@/hooks/useSource"

const formSchema = z.object({
    faqs: z.array(z.object({
        question: z.string().min(1),
        answer: z.string().min(1)
    }))
})

const CreateFAQSource = () => {
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""

    const { sourcesRefetch } = useSources()
    const { refetch } = useFAQSource()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { faqs: [{ question: "", answer: "" }] }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await Promise.all(
            values.faqs.map(async (faq) => {
                const embedding = await embeddingsModel.embedQuery(`Question: ${faq.question}, Answer: ${faq.answer}`)
                const res = await createFaq({ formData: { question: faq.question, answer: faq.answer, bot_id, embedding } })
                if (res.error) {
                    console.error(res.error)
                }
            })
        )

        form.reset()
        refetch()
        sourcesRefetch()
    }

    const { control } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "faqs" })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">

                {fields.map((faq, index) => (
                    <div className="flex items-start gap-4" key={faq.id}>
                        {/* Business Name */}
                        <div className="w-full gap-2 flex flex-col">
                            <FormField
                                control={control}
                                name={`faqs.${index}.question`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input className="input" placeholder="Question" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}

                            />
                            <FormField
                                control={control}
                                name={`faqs.${index}.answer`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Textarea className="input min-h-28" placeholder="Answer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}

                            />
                        </div>
                        <Button variant={"outline"} disabled={index === 0} className="size-12" onClick={() => remove(index)} aria-label="Remove FAQ"><MinusCircle /></Button>
                    </div>
                ))}
                <div className="w-full flex justify-between items-center">
                    <Button type="button" variant={"outline"} onClick={() => append({ question: "", answer: "" })} ><PlusCircleIcon /> Add Another</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid} className='btn'>
                        Add FAQs {form.formState.isSubmitting && <Loader className="animate-spin size-5" />}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateFAQSource
