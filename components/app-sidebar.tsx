'use client'
import { getCompany } from '@/lib/actions/companies.actions'
import Link from 'next/link'
import { redirect, useParams, usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
const sidebarItems = [
    { title: "Dashboard", url: "/editor", icon: "dashboard" },
    { title: "Chat Bots", url: "/editor/chat-bots", icon: "bot" },
    { title: "Subscription", url: "/editor/subscription", icon: "bot" },
]

const AppSidebar = () => {
    const pathname = usePathname()
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""
    const sidebarChatBotsItems = [
        { title: "Dashboard", url: `/editor` },
        { title: "Playground", url: `/editor/chat-bots/${bot_id}` },
        { title: "Sources", url: `/editor/chat-bots/${bot_id}/sources` },
        { title: "Connect", url: `/editor/chat-bots/${bot_id}/connect` },
        // { title: "Settings", url: `/editor/chat-bots/${bot_id}/settings` },
    ]
    useEffect(() => {
        const initialCall = async () => {
            const res = await getCompany()
            const allowedRoutes = ['/editor', '/editor/onboarding']
            const isAllowed = allowedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
            if (res.error && !isAllowed) {
                redirect('/editor')
            }

        }
        initialCall()
    }, [])

    return (
        <section className='h-9 border-b w-full flex justify-center top-11 left-0 fixed bg-background px-5'>
            <div className='h-9 flex gap-5' style={{ height: 'calc(100% - 4rem)' }}>
                {!pathname.includes(`editor/chat-bots/${bot_id}`) ? sidebarItems.map((item) => {
                    const isActive = item.url === "/editor"
                        ? pathname === item.url
                        : pathname.startsWith(item.url)

                    return (
                        <Link key={item.title}
                            aria-label={item.title}
                            className={`hover:text-black flex h-9 px-1 font-medium items-center transition-colors justify-center text-sm ${isActive ? 'border-b-2 border-black' : 'text-muted-foreground'
                                }`}
                            href={item.url}>
                            {item.title}
                        </Link>
                    )
                }) : (
                    sidebarChatBotsItems.map((item) => {
                        const isActive = item.url === `/editor/chat-bots/${bot_id}`
                            ? pathname === item.url
                            : pathname.startsWith(item.url)

                        return (
                            <Link key={item.title}
                                aria-label={item.title}
                                className={`hover:text-black flex h-9 px-1 font-medium items-center transition-colors justify-center text-sm ${isActive && item.url !== "/editor" ? 'border-b-2 border-black' : 'text-muted-foreground'
                                    }`}
                                href={item.url}>
                                {item.title}
                            </Link>
                        )
                    })
                )}
            </div>
        </section>
    )
}

export default AppSidebar
