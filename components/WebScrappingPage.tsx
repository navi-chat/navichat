'use client'
import { Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const WebScrappingPage = ({ url }: { url: string }) => {
    const [processStatus, setProcessStatus] = useState("Scrapping the webpage...")
    const [dataObject, setDataObject] = useState<JSON>()
    useEffect(() => {
        const initialCall = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/get-page`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: url,
                }),
            })
            const data = await res.json()
            setDataObject(data)
        }
        initialCall()
    }, [])
    return (
        <div>
            <div className='w-full py-3 rounded-lg border flex items-center px-4 gap-4'>
                <Loader className='text-muted-foreground animate-spin' />
                <div>
                    <div className='text-blue-700'>{url}</div>
                    <div className=' animate-pulse'>{processStatus}</div>
                    <p className='text-xs'>{JSON.stringify(dataObject)}</p>
                </div>
            </div>
        </div>
    )
}

export default WebScrappingPage
