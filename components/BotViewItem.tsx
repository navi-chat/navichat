import { Bot } from '@/lib/types'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BotViewItem = ({ bot }: { bot: Bot }) => {
    return (
        <Link href={`/editor/chat-bots/${bot.id}`} className='border rounded-xl overflow-hidden cursor-pointer hover:scale-[1.01] transition-all hover:border-foreground/20'>
            <div className='aspect-square bg-accent w-44 flex items-center justify-center'>
                <MessageCircle className='w-14 h-14 text-muted-foreground' />
            </div>
            <div className='flex flex-col gap-1 items-center justify-center py-2 px-4 w-44'>
                <h2 className="text-sm font-medium">{bot.name || "Unnamed Assistant"}</h2>
                <p className="text-blue-600 text-sm truncate w-36">{bot.website}</p>
            </div>
        </Link>
    )
}

export default BotViewItem
