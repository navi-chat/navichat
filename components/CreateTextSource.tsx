'use client'
import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { useParams } from 'next/navigation'
import { createText } from '@/lib/actions/texts.actions'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { embeddingsModel } from '@/lib/embeddingModel'
import { useSources, useTextSource } from '@/hooks/useSource'


const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    text: z.string().min(2, {
        message: "Text must be at least 2 characters.",
    }),
})

const CreateTextSource = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            text: "",
        },
    })

    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""
    const { refetch } = useTextSource()
    const { sourcesRefetch } = useSources()

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const embedding = await embeddingsModel.embedQuery(`Text Title: ${values.title}, Text: ${values.text}`)
        const res = await createText({ formData: { ...values, bot_id: bot_id, embedding: embedding } })
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Text added successfully.")
            form.reset()
            refetch()
            sourcesRefetch()
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: About Us" className='input' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter your text here..." className='input min-h-72 pt-4' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid} className='btn'>
                        Add Text {form.formState.isSubmitting && <Loader className="animate-spin size-5" />}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateTextSource
