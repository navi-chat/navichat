'use client'
import ChatBotsSidebar from '@/components/ChatBotsSidebar'
import { Box, ContactRound, MessageCircleQuestion, TextIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'
import { getTextsLength } from '@/lib/actions/texts.actions'
import { getFAQsLength } from '@/lib/actions/faqs.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { getProductsLength } from '@/lib/actions/products.actions'
import { getContactsLength } from '@/lib/actions/contacts.actions'
import { sourcesContext } from '@/hooks/useSource'

const SourcesLayout = ({ children }: { children: ReactNode }) => {
  const params = useParams()
  const bot_id = params.bot_id?.toString() || ""

  const [sources, setSources] = useState<{ text: string; type: string; }[]>()

  const sidebarItems = [
    {
      title: "Text",
      url: `/editor/chat-bots/${bot_id}/sources`,
      icon: <TextIcon className='size-5' />
    },
    {
      title: "FAQs",
      url: `/editor/chat-bots/${bot_id}/sources/faqs`,
      icon: <MessageCircleQuestion className='size-5' />
    },
    {
      title: "Products",
      url: `/editor/chat-bots/${bot_id}/sources/products`,
      icon: <Box className='size-5' />
    },
    {
      title: "Contacts",
      url: `/editor/chat-bots/${bot_id}/sources/contacts`,
      icon: <ContactRound className='size-5' />
    },
  ]

  const sourcesRefetch = async () => {
    setSources(undefined)
    const textRes = await getTextsLength({ bot_id })
    const faqsRes = await getFAQsLength({ bot_id })
    const productsRes = await getProductsLength({ bot_id })
    const contactsRes = await getContactsLength({ bot_id })
    if (textRes.data && textRes.data.length > 0) {
      setSources(prev => [...(prev ?? []), { text: `${textRes.data.length} Text File${textRes.data.length > 1 ? 's' : ''}`, type: "text" }]);
    }
    if(faqsRes.data && faqsRes.data.length > 0){
      setSources(prev => [...(prev ?? []), { text: `${faqsRes.data.length} FAQ${faqsRes.data.length > 1 ? 's' : ''}`, type: "faq" }])
    }
    if(productsRes.data && productsRes.data.length > 0){
      setSources(prev => [...(prev ?? []), { text: `${productsRes.data.length} Product${productsRes.data.length > 1 ? 's' : ''}`, type: "product" }])
    }
    if(contactsRes.data && contactsRes.data.length > 0){
      setSources(prev => [...(prev ?? []), { text: `${contactsRes.data.length} Contact${contactsRes.data.length > 1 ? 's' : ''}`, type: "contact" }])
    }
    if(!faqsRes.data && !textRes.data && !productsRes.data && !contactsRes.data){
      setSources([])
    }
  }

  useEffect(() => {
    sourcesRefetch()
  }, [bot_id])

  return (
    <sourcesContext.Provider value={{ sourcesRefetch }}>
      <section className='p-5 w-full h-full space-y-5 overflow-visible'>
        <div>
          <h1 className='text-2xl font-bold'>Sources</h1>
        </div>
        <div className='flex gap-5 w-full h-full pb-20'>
          <div className='flex'>
            <ChatBotsSidebar initialURL={`/editor/chat-bots/${bot_id}/sources`} sidebarItems={sidebarItems} />
          </div>
          <div className='w-2/3 h-full'>
            {children}
          </div>
          <div className='w-1/3'>
            <div className='border rounded-lg p-5 w-full space-y-5'>
              <h2 className='text-sm font-semibold text-muted-foreground'>SOURCES</h2>
              <div className=' space-y-2'>
                {sources?.map((source, index) => {
                  const icon = () => {
                    switch (source.type) {
                      case "text":
                        return <TextIcon className='size-4' />
                      case "faq":
                        return <MessageCircleQuestion className='size-4' />
                      case "product":
                        return <Box className='size-4' />
                      case "contact":
                        return <ContactRound className='size-4' />
                      default:
                        return <TextIcon className='size-4' />
                    }
                  }
                  return (
                    <div key={`source.type ${index}`} className='flex gap-2 items-center'>
                      <span>{icon()}</span>
                      <p className='text-sm text-secondary-foreground'>{source.text}</p>
                    </div>
                  )
                }) ?? (sources?.length === 0 ? <p className="text-accent-foreground font-medium">No Source Added</p> : <Skeleton className='w-2/3 h-5' />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </sourcesContext.Provider>
  )
}

export default SourcesLayout
