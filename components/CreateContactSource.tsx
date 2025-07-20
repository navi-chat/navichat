'use client'
import React, { HTMLInputTypeAttribute } from 'react'

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
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { createContact } from '@/lib/actions/contacts.actions'
import { embeddingsModel } from '@/lib/embeddingModel'
import { useContactSource, useSources } from '@/hooks/useSource'

export const contact_types = [
    {
        name: "Email",
        type: "email",
    },
    {
        name: "Phone Number",
        type: "phone_no",
    },
    {
        name: "X (Twitter)",
        type: "x.com",
    },
    {
        name: "YouTube Channel",
        type: "youtube_channel",
    },
    {
        name: "Whatsapp Number",
        type: "whatsapp_no",
    },
    {
        name: "Whatsapp Channel",
        type: "whatsapp_channel",
    },
    {
        name: "Facebook",
        type: "facebook",
    },
    {
        name: "Instagram",
        type: "instagram",
    },
    {
        name: "Telegram Number",
        type: "telegram_no",
    },
    {
        name: "Telegram Channel",
        type: "telegram_channel",
    },
]

const formSchema = z.object({
    type: z.string().min(2, {
        message: "Contact Type must be at least 2 characters.",
    }),
    contact: z.string().min(2, {
        message: "Contact must be at least 2 characters.",
    }),
})

const CreateContactSource = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "",
            contact: ""
        },
    })

    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""
    const { refetch } = useContactSource()
    const { sourcesRefetch } = useSources()

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const embedding = await embeddingsModel.embedQuery(`Contact (${values.type}): ${values.contact}`)
        const res = await createContact({
            formData: {...values, bot_id: bot_id, embedding: embedding}
        })

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Contact added successfully.")
            form.reset()
            refetch()
            sourcesRefetch()
        }
    }


    const ContactInputType = (): HTMLInputTypeAttribute => {
        switch (form.watch("type")) {
            case "email":
                return "email"
            case "phone_no":
            case "whatsapp_no":
            case "telegram_no":
                return "tel"
            case "x.com":
            case "youtube_channel":
            case "whatsapp_channel":
            case "facebook":
            case "instagram":
            case "telegram_channel":
                return "url"
            default:
                return "text"
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Type</FormLabel>
                            <FormControl className='w-full'>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Contact Type" className='w-full' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contact_types.map((contact_type) => (
                                            <SelectItem key={contact_type.type} value={contact_type.type}>{contact_type.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact</FormLabel>
                            <FormControl>
                                <Input placeholder='Contact' type={ContactInputType()} className='input' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid} className='btn'>
                        Add Contact {form.formState.isSubmitting && <Loader className="animate-spin size-5" />}
                    </Button>
                </div>
            </form>
        </Form >
    )
}

export default CreateContactSource
