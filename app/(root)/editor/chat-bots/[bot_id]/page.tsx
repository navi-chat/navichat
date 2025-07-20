'use client'
import PlaygroundBotInterface from '@/components/PlaygroundBotInterface'
import { useParams } from 'next/navigation'
import React from 'react'

const Playground = () => {
  const params = useParams()
  const bot_id = params.bot_id?.toString() || ""
  return (
    <>
      <section className='p-5 space-y-5 h-5/6'>
        <h1 className='text-2xl font-bold'>Playground</h1>
        <div className='bg-accent border w-full h-full p-5 rounded-lg flex items-center justify-center'>
          <div className='w-sm h-full rounded-xl overflow-hidden shadow-sm'>
            <PlaygroundBotInterface bot_id={bot_id} />
          </div>
        </div>
      </section>
    </>
  )
}

export default Playground
