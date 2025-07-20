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

import { ChevronRight, Loader, Loader2, X } from "lucide-react"
import { createCompany } from "@/lib/actions/companies.actions"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { useState } from "react"

const niches = [
    "Education",
    "Healthcare",
    "Business Services",
    "Retail & E-commerce",
    "Real Estate",
    "Wellness & Beauty",
    "Food & Hospitality",
    "Professional Services",
    "Travel & Tourism",
    "Other",
]

const formSchema = z.object({
    name: z.string().min(1, { message: "Business name is required." }),
    niche: z.array(z.string()).min(1, { message: "Select at least one category." })
})

const OnboardingForm = () => {
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            niche: [],
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)

        const res = await createCompany({ formData: values })
        if (res.error) {
            toast.error(res.error)
        } else {
            redirect('/editor/chat-bots/')
        }
        setLoading(false)
    }

    const handleAdd = (item: string) => {
        if (!form.watch("niche").includes(item)) {
            form.setValue("niche", [...form.watch("niche"), item])
        }
        setInput("")
    }

    const handleRemove = (item: string) => {
        form.setValue("niche", form.watch("niche").filter((i) => i !== item))
    }

    const suggestions = niches.filter(n =>
        n.toLowerCase().includes(input.toLowerCase()) &&
        !form.watch("niche").includes(n)
    )

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Business Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                                <Input className="input" placeholder="XYZ Company" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}

                />

                {/* Categories (Tags + Input) */}
                <FormField
                    control={form.control}
                    name="niche"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Categories</FormLabel>
                            {/* Input field for adding more */}
                            <Input
                                className="input w-full"
                                placeholder="Type or select a category and press Enter"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && input.trim()) {
                                        e.preventDefault()
                                        handleAdd(input.trim())
                                    }
                                }}
                            />

                            {/* Suggestions drop-down */}
                            {input && suggestions.length > 0 && (
                                <ul className="border p-2 mt-2 rounded-md">
                                    {suggestions.map((s) => (
                                        <li
                                            key={s}
                                            onClick={() => handleAdd(s)}
                                            className="p-1 hover:bg-gray-100 cursor-pointer">
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="flex flex-wrap gap-2 mb-2">
                                {field.value?.map((item, idx) => (
                                    <span key={idx} className="flex items-center px-4 border border-foreground/10 py-1 bg-gray-200 rounded-full">
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(item)}
                                            aria-label="Remove"
                                            className="ml-1 text-gray-500 hover:text-gray-900">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>

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

export default OnboardingForm
