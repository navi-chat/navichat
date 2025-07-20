import Header from '@/components/Header'
import React, { ReactNode } from 'react'

const ChatBotsLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default ChatBotsLayout
