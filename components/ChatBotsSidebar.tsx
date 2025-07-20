'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

const ChatBotsSidebar = ({ sidebarItems, initialURL }: { sidebarItems: {title: string, url: string, icon: ReactNode}[], initialURL: string }) => {
  const pathname = usePathname()
  return (
    <div className='w-52 flex flex-col gap-1'>
      {sidebarItems.map((item) => {
        const isActive = item.url === initialURL ? pathname === item.url
        : pathname.startsWith(item.url)

        return (
            <Link href={item.url} key={item.title} className={`w-full flex gap-3 p-2 hover:text-foreground hover:font-medium hover:bg-accent rounded-sm items-center text-sm px-3 ${isActive ? 'font-medium text-foreground bg-accent' : 'text-muted-foreground'}`}>
                {item.icon}
                {item.title}
            </Link>
        )
      })}
    </div>
  )
}

export default ChatBotsSidebar
