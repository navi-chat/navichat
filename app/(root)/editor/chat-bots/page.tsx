'use client'
import BotViewItem from '@/components/BotViewItem'
import Header from '@/components/Header'
import { getBots } from '@/lib/actions/bots.actions'
import { Bot } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const ChatBots = () => {
  const [bots, setbots] = useState<Bot[]>()

  useEffect(() => {
    const initialCall = async () => {
      const res = await getBots()
      if (res.error) {
        toast.error(res.error)
      } else {
        setbots(res.data)
      }
    }
    initialCall()
  }, [])
  return (
    <>
      <Header />
      <section className='p-5 w-full space-y-5'>
        <h1 className='text-2xl text-foreground font-bold'>Chat Bots</h1>
        <div className='flex gap-5 w-full flex-wrap'>
          {bots?.map((bot) => (
            <BotViewItem key={bot.id} bot={bot} />
          ))}
          <Link href={'/editor/chat-bots/create'} className="border-2 border-dashed hover:border-solid flex items-center justify-center rounded-lg cursor-pointer text-muted-foreground flex-col"
          >
            <div className='aspect-square bg-accent w-44 flex items-center justify-center overflow-hidden'>
              <Image src={"/icons/bot.svg"} className=' opacity-40' height={58} width={58} alt='bot' />
            </div>
            <div className='text-sm text-foreground py-5 font-medium'>Add New Bot</div>
          </Link>
        </div>
      </section>
    </>
  )
}

export default ChatBots
