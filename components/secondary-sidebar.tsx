import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react'

const SecondarySidebar = ({ title, items }: { title: ReactNode, items: { title: string; url: string; icon: ReactNode }[] }) => {
    const pathname = usePathname()
    return (
        <div className='w-80 fixed left-16 top-16 border-r h-full'>
            <div className='flex flex-col p-4 w-full'>
                <div className='px-2 py-3'>
                    <h2 className=' font-semibold text-xl'>{title}</h2>
                </div>
                <div className='w-full flex flex-col gap-0.5'>
                    {items.map((item) => {
                        const isActive = item.url === items[0].url
                        ? pathname === item.url
                        : pathname.startsWith(item.url)

                        return (
                            <Link href={item.url} key={item.title} className={`hover:bg-accent w-full text-sm px-3.5 transition-all rounded-md flex items-center gap-2 py-2 ${isActive ? 'bg-accent font-medium' : 'text-muted-foreground'}`}>
                                {item.icon}
                                {item.title}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SecondarySidebar
