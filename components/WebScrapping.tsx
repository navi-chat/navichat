'use client'
import { getBot } from '@/lib/actions/bots.actions'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import WebScrappingPage from './WebScrappingPage'

const WebScrapping = () => {
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""
    const [links, setLinks] = useState<string[]>(["fsdfdds", "fdsdf", "fsfds"])

    useEffect(() => {
        const initialCall = async () => {
            const bot = await getBot({ bot_id })
            if (bot.data) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/all-links`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        website: bot.data.website,
                    }),
                })
                const data = await res.json()
                setLinks(data.links)
            }
        }
        initialCall()
    }, [bot_id])
    return (
        <div className='w-full p-4 border rounded-xl flex flex-col gap-4'>
            {links?.map((link) => (
                <WebScrappingPage url={link} key={link} />
            ))}
        </div>
    )
}

export default WebScrapping
