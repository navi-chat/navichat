'use client'
import CustomizablePlaygroundBotInterface from '@/components/CustomizablePlaygroundBotInterface'
import { getChatInterface } from '@/lib/actions/chat_interface.actions'
import { ChatInterfaceType, CustomChatInterfaceType } from '@/lib/types'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { HexAlphaColorPicker } from "react-colorful"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
    initial_message: z.string().min(2, {
        message: "Initial Message must be at least 2 characters.",
    }),
    header_color: z.string().min(2),
})

const ChatInterface = () => {
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""

    const [chatInterface, setChatInterface] = useState<ChatInterfaceType>()
    const [headerColorPickerOpen, setHeaderColorPickerOpen] = useState(false)
    const [customChatInterface, setCustomChatInterface] = useState<CustomChatInterfaceType>({
        initial_message: "Hi, How can I help you?",
        header_color: "#ffffff"
    })

    useEffect(() => {
        const initialCall = async () => {
            const res = await getChatInterface({ bot_id })
            setChatInterface(res.data)
        }
        initialCall()
    }, [bot_id])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            initial_message: chatInterface?.initial_message || "Hi, How can I help you?",
            header_color: "#ffffff00"
        },
    })

    async function onSubmit() {

    }

    const watch = form.watch()

    useEffect(() => {
        setCustomChatInterface({
            initial_message: watch.initial_message,
            header_color: watch.header_color
        })
    }, [watch])

    return (
        <div className='w-full h-full flex gap-5'>
            <div className='w-3/5 h-full p-5 border rounded-lg space-y-5'>
                <div className='space-y-1'>
                    <p className='text-xl font-bold'>Chat Interface</p>
                    <p className='text-muted-foreground text-sm'>Customize the Chat Interface for the ChatBot.</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="initial_message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Text</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter your text here..." className='input pt-4' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="header_color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Header Color</FormLabel>
                                        <FormControl>
                                            <div className='flex gap-3'>
                                                <div className='w-20 border h-12 rounded-md' onClick={() => setHeaderColorPickerOpen(!headerColorPickerOpen)} style={{ backgroundColor: field.value }}>
                                                </div>
                                                {headerColorPickerOpen ? (
                                                    <HexAlphaColorPicker color={field.value} onChange={field.onChange} />
                                                ) : (
                                                    <Input {...field} className='input' placeholder='Hex Code' />
                                                )}
                                            </div>
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
                </div>
            </div>
            <div className='w-2/5 h-full flex flex-col gap-5 items-end'>
                <div className='border overflow-hidden rounded-xl shadow-sm h-full w-full'>
                    <CustomizablePlaygroundBotInterface bot_id={bot_id} chatInterface={customChatInterface} />
                </div>
                <div>
                    <div className='w-[60px] h-[60px] border shadow-md flex items-center justify-center rounded-full overflow-hidden bg-primary cursor-pointer'>
                        <Image src={"/icon-filled.png"} alt='chat_bot_icon' height={60} width={60} className='size-10' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInterface
// button.style = \`
//       position: fixed;
//       bottom: 20px;
//       right: 20px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       width: 60px;
//       height: 60px;
//       background: #333;
//       color: white;
//       font-size: 24px;
//       border-radius: 50%;
//       cursor: pointer;
//       z-index: 9999;
//     \`