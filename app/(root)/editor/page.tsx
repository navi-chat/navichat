'use client'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { getCompany } from '@/lib/actions/companies.actions'
import { Company } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {Skeleton} from "@/components/ui/skeleton"

const Editor = () => {
  const [company, setCompany] = useState<Company>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialCall = async () => {
      const res = await getCompany()
      if (res.data) {
        setCompany(res.data)
      }
      setLoading(false)
    }
    initialCall()
  }, [])
  return (
    <>
      <script src="https://localhost:3000/api/bot" type="text/javascript" async></script>
      <Header />
      {!company && !loading ? (
        <section className='w-sm mx-auto h-full flex items-center justify-center flex-col gap-5'>
          <p className='text-center flex flex-col'><span className='font-bold text-2xl mb-2'>Hold on!</span> <span>You&apos;ll need to add your company info before creating your chatbot.</span>
          </p>
          <Button className='btn-submit' onClick={() => redirect('/editor/onboarding')}>Add your Company</Button>
        </section>
      ) : (
        <div className='w-full h-full flex items-center justify-center'>
          {loading ? <Skeleton className='h-5 w-64 rounded-full'/> : 'Coming soon...'}
        </div>
      )}
    </>
  )
}

export default Editor
