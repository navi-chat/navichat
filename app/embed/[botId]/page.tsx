'use client'
import PlaygroundBotInterface from '@/components/PlaygroundBotInterface'
import { useParams } from 'next/navigation'
import React from 'react'

const Embed = () => {
  const params = useParams()
  const bot_id = params.botId?.toString() || ""
  return (
    <div className='w-full h-full fixed'>
      <PlaygroundBotInterface bot_id={bot_id} />
    </div>
  )
}

export default Embed
