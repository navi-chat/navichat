'use client'
import ChatBotsSidebar from '@/components/ChatBotsSidebar'
import { Code } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { ReactNode } from 'react'

const ConnectLayout = ({ children }: { children: ReactNode }) => {
  const params = useParams()
  const bot_id = params.bot_id?.toString() || ""

  const sidebarItems = [
    {
      title: "Embed",
      url: `/editor/chat-bots/${bot_id}/connect`,
      icon: <Code className='size-5' />
    },
  ]

  return (
      <section className='p-5 w-full h-full space-y-5 overflow-visible'>
        <div>
          <h1 className='text-2xl font-bold'>Sources</h1>
        </div>
        <div className='flex gap-5 w-full h-full pb-20'>
          <div className='flex'>
            <ChatBotsSidebar initialURL={`/editor/chat-bots/${bot_id}/connect`} sidebarItems={sidebarItems} />
          </div>
          <div className='w-full h-full'>
            {children}
          </div>
        </div>
      </section>
  )
}

export default ConnectLayout
