'use client'
import Header from '@/components/Header'
import OnboardingForm from '@/components/OnboardingForm'
import React from 'react'
const Onboarding = () => {
  return (
    <>
      <Header />
      <section className='w-md mx-auto my-auto mt-5'>
        <div className='border p-5 rounded-xl space-y-5'>
          <div>
            <p className='font-bold text-2xl'>Add Your Company</p>
            <p className='text-muted-foreground'>Fill the details to add your company.</p>
          </div>
          <OnboardingForm />
        </div>
      </section>
    </>
  )
}

export default Onboarding
