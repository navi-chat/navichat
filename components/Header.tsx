import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const Header = () => {
  return (
    <nav className='w-full h-14 fixed  top-0 left-0 flex items-center gap-5 px-5 justify-between bg-background'>
        <div className='flex items-center'>
            <Image src={"/icon.png"} height={34} width={34} alt='logo' />
            <p className='text-xl font-bold text-primary pl-1'>NaviChat</p>
        </div>
        <div className='flex items-center gap-4'>
            <SignedOut>
                <SignInButton>
                    <Button variant={"outline"}>Login</Button>
                </SignInButton>
                <Button>Get Your ChatBot</Button>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    </nav>
  )
}

export default Header
