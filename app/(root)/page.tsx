'use client'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { ChevronRight } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const Root = () => {
  const { user } = useUser();
  if (user) {
    redirect('/editor')
  }
  return (
    <>
      <script src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bot?bot_id=f0f789db-7893-49a9-9320-f33a4e458b2b`} type="text/javascript" async />
      <Header />
      <section className='w-full flex flex-col items-center pt-24 md:pt-52 gap-5 min-h-screen'>
        <div className='w-full h-full p-4 md:p-5 flex flex-col gap-5'>
          <div className='space-y-3 flex items-center flex-col'>
            <h1 className='text-3xl md:text-5xl font-bold text-center leading-tight md:leading-14 px-4 md:px-0'>
              Your AI ChatBot in <span className='text-primary'>minutes</span>.
              <br className='hidden md:block' />
              Ready <span className='text-primary'>24/7</span>.
            </h1>
            <p className='text-muted-foreground w-full md:w-1/3 text-center px-4 md:px-0'>
              Add a smart, customizable chatbot to your website in 2 minutes. No coding required.
            </p>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-3 md:gap-5 mt-6 md:mt-0 w-full justify-center'>
            <Button className='h-12 px-8 w-full md:w-48' onClick={() => redirect('/editor')}><p>Get Your ChatBot</p> <ChevronRight /></Button>
            {/* <Button className='h-12 px-8 w-full md:w-48' variant={"outline"}><p>Watch Demo</p> <Play className='size-3.5' /></Button> */}
          </div>
        </div>
        <footer className='w-full flex flex-col sm:flex-row justify-between items-center gap-5 bg-foreground/50 p-4 md:p-5 mt-auto bottom-0'>
          <div className='flex flex-col sm:flex-row items-center gap-3 md:gap-5 justify-between w-full text-sm md:text-base'>
            <p>Copyright © 2025 NaviChat. All rights reserved.</p>
            <p>Contact: <a href='mailto:app.navichat@gmail.com' className='font-semibold hover:underline'>app.navichat@gmail.com</a></p>
          </div>
        </footer>
      </section>
    </>
  )
}

export default Root
