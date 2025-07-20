'use client'
import ChatBotsSidebar from '@/components/ChatBotsSidebar'
import { Box, Code, ContactRound, Loader, MessageCircleQuestion, TextIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import { getTextsLength, updateTexts } from '@/lib/actions/texts.actions'
import { Button } from '@/components/ui/button'
import LoadingThreeDotsPulse from '@/components/Dots'
import { getSourceDataList } from '@/lib/retrainBot'
import { createData } from '@/lib/actions/data.actions'
import { getFAQsLength } from '@/lib/actions/faqs.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { getProductsLength } from '@/lib/actions/products.actions'
import { getContactsLength } from '@/lib/actions/contacts.actions'

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
