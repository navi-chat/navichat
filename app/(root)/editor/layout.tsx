import AppSidebar from '@/components/app-sidebar'
import { Toaster } from '@/components/ui/sonner'
import React, { ReactNode } from 'react'

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <AppSidebar key={"app-sidebar"} />
            <main className='w-screen mt-20 overflow-y-auto h-full' style={{ width: "100%" }}>
                <div className='w-7xl mx-auto pt-5 h-full'>
                    {children}
                </div>
                <Toaster className='z-[999]' position="top-center" />
            </main>
        </>
    )
}

export default RootLayout
