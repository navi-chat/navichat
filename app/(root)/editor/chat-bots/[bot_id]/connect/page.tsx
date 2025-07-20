'use client'
import { Button } from '@/components/ui/button'
import { getBot } from '@/lib/actions/bots.actions'
import { Bot } from '@/lib/types'
import { CheckIcon, Clipboard, ClipboardIcon } from 'lucide-react'
import { JetBrains_Mono } from 'next/font/google'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"]
})

const Embed = () => {
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
    <div className='w-full h-full'>
      <div className='w-full border p-5 rounded-lg space-y-3'>
        <div className=' space-y-1'>
          <p className='text-xl font-bold'>Embed</p>
          <p className='text-sm text-muted-foreground'>Embed the ChatBot to your website.</p>
        </div>
        <div>
          <div className='font-bold text-2xl'>Step 1</div>
          <p className='text-muted-foreground'>Copy this script.</p>
          <div>
            <div className='w-full bg-muted border rounded-lg pl-5 pr-2 py-3 flex gap-5 mt-3'>
              <div className={`${jetBrainsMono.className} text-wrap break-all text-sm`}>{`<script src={${process.env.NEXT_PUBLIC_SERVER_URL}/api/bot?bot_id=${bot_id}} type="text/javascript" async />`}</div>
              <Button variant={"ghost"} onClick={handleCopy}>{copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}</Button>
            </div>
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
      </div>
    </div>
  )
}

export default Embed