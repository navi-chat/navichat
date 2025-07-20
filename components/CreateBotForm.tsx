"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import { ChevronRight, Loader } from "lucide-react"
import { createBot } from "@/lib/actions/bots.actions"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { getCompany } from "@/lib/actions/companies.actions"

import { Company } from "@/lib/types"
import { createChatInterface } from "@/lib/actions/chat_interface.actions"

const formSchema = z.object({
    name: z.string().min(1, { message: "Bot name is required." }),
    website: z.string().url({ message: "Website URL is required." }),
})

const CreateBotForm = () => {
    const [loading, setLoading] = useState(false)
    const [company, setCompany] = useState<Company>()

    useEffect(() => {
        const initialCall = async () => {
            const res = await getCompany()
            if (res?.data) {
                setCompany(res.data)
            }
        }
        initialCall()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            website: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const res = await createBot({ formData: values })
        if (res.error) {
            toast.error(res.error)
        } else {
            await createChatInterface({ bot_id: res.data.id })
            redirect(`/editor/chat-bots/${res.data.id}/sources`)
        }
        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Bot Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bot Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={`${company?.name || "NaviChat"} Assistant`}
                                    className="input"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}

                />

                {/* Website */}
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://example.com"
                                    className="input"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}

                />

                <Button type="submit" className="btn-submit space-x-2" disabled={loading}>
                    Next {loading ? <Loader className="animate-spin size-5" /> : <> <ChevronRight /></>}
                </Button>
            </form>
        </Form>
    )
}

export default CreateBotForm
