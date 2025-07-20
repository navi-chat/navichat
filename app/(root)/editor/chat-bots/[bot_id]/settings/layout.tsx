'use client'
import ChatBotsSidebar from '@/components/ChatBotsSidebar'
import { PencilRuler, Settings } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { ReactNode } from 'react'

const SettingsLayout = ({ children }: { children: ReactNode }) => {
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""

    const sidebarItems = [
        {
          title: "General",
          url: `/editor/chat-bots/${bot_id}/settings`,
          icon: <Settings className='size-5' />
        },
        {
          title: "Chat Interface",
          url: `/editor/chat-bots/${bot_id}/settings/chat-interface`,
          icon: <PencilRuler className='size-5' />
        },
      ]
  return (
    <section className='p-5 w-full h-full space-y-5 overflow-visible'>
        <div>
          <h1 className='text-2xl font-bold'>Settings</h1>
        </div>
        <div className='flex gap-5 w-full h-full pb-20'>
          <div className='flex'>
            <ChatBotsSidebar initialURL={`/editor/chat-bots/${bot_id}/settings`} sidebarItems={sidebarItems} />
          </div>
          <div className='w-full h-full'>
            {children}
          </div>
        </div>
      </section>
  )
}

export default SettingsLayout
