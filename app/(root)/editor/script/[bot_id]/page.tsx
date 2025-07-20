'use client'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getBot } from '@/lib/actions/bots.actions'
import { Bot } from '@/lib/types'
import { CheckIcon, ClipboardIcon } from 'lucide-react'
import { JetBrains_Mono } from 'next/font/google'
import { redirect, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"]
})

const GetUrl = () => {
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""
    const [bot, setBot] = useState<Bot>()
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const initialCall = async () => {
            const res = await getBot({ bot_id: bot_id })
            if (res.data) {
                setBot(res.data)
            }
        }
        initialCall()
    }, [bot_id])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`<script src="https://navichat.vercel.app/api/bot?bot_id=${bot && bot?.id}" type="text/javascript" async />`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy: ", err)
        }
    }
    return (
        <>
            <Header />
            <Dialog open>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Get Your ChatBot</DialogTitle>
                        <DialogDescription>
                            Follow the instructions to use the ChatBot in your website.
                        </DialogDescription>
                        <div className='space-y-5'>
                            <div>
                                <h2 className='text-xl font-bold'>Step 1</h2>
                                <p className='text-muted-foreground'>Copy this line of code</p>
                                <div className='w-full bg-muted border rounded-lg pl-5 pr-2 py-3 flex gap-5 mt-3'>
                                    <div className={`${jetBrainsMono.className} text-wrap break-all text-sm`}>{`<script src="https://navichat.vercel.app/api/bot?bot_id=${bot && bot?.id}" type="text/javascript" async />`}</div>
                                    <Button variant={"ghost"} onClick={handleCopy}>{copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}</Button>
                                </div>
                            </div>
                            <div>
                                <h2 className='text-xl font-bold'>Step 2</h2>
                                <p className='text-muted-foreground'>{`Paste it inside the <head> tag of your HTML file or website template — like this:`}</p>
                                <div className='w-full bg-muted border rounded-lg px-5 py-3 flex gap-5 mt-3'>
                                    <div className={`${jetBrainsMono.className} text-wrap text-sm whitespace-pre-line`}>
                                        <p>{`<head>`}</p>
                                        <p>{`<title>Your Website</title>`}</p>
                                        <p className='text-blue-700'>{`<!-- 👇 Paste this to show the chatbot -->`}</p>
                                        <p className='break-all'>{`<script src="https://navichat.vercel.app/api/bot?bot_id=${bot && bot?.id}" type="text/javascript" async />`}</p>
                                        <p>{`</head>`}</p>
                                    </div>
                                </div>
                            </div>
                            <Button className='btn-submit' onClick={() => redirect("/editor/chat-bots")}>Done</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default GetUrl
