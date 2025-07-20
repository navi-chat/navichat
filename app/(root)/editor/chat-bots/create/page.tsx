'use client'
import Header from '@/components/Header'
import React from 'react'
import CreateBotForm from '@/components/CreateBotForm'

const CreateChatBot = () => {
  return (
    <>
      <Header />
      <section className='w-md h-full mx-auto mt-5'>
        <div className='border rounded-xl p-5 space-y-5'>
          <div>
            <p className='text-2xl font-bold'>Create ChatBot</p>
            <p className="text-muted-foreground">Fill the details to create a ChatBot.</p>
          </div>
          <CreateBotForm />
        </div>
      </section>
    </>
  )
}

export default CreateChatBot
