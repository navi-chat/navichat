import Header from '@/components/Header'
import { Dot } from 'lucide-react'
import { Roboto } from 'next/font/google'
import React from 'react'

const roboto = Roboto({
    weight: ["500", "600", "700"],
    subsets: ["latin"]
})

const DataPolicy = () => {
    return (
        <>
            <Header />
            <div className='h-5/6 w-full min-lg:px-60 mb-32 pt-20 p-5'>
                <div className={`${roboto.className} space-y-5 text-lg`}>
                    <h1 className='text-3xl font-bold'>NaviChat Chat Data Policy</h1>
                    <div>
                        <p>Effective Date: 07/07/2025</p>
                        <p>Last Updated: 07/07/2025</p>
                    </div>
                    <p className='text-accent-foreground/80'>This policy applies to users who interact with chatbots powered by NaviChat.
                        By sending messages through this chat, you agree to the collection and use of your data as described below.
                    </p>
                    <div className='space-y-2'>
                        <h2 className='text-2xl font-bold'>What We Collect</h2>
                        <p>
                            When you use this chatbot, we may collect the following:
                        </p>
                        <ul>
                            <li className='flex'><Dot />The messages you type in the chat</li>
                            <li className='flex'><Dot />Time and date of your interaction</li>
                            <li className='flex'><Dot />Device/browser information (e.g., IP address, user agent)</li>
                        </ul>
                        <p>
                            We do not intentionally collect sensitive personal information (like passwords, payment info, or government IDs).
                        </p>
                    </div>
                    <div className='space-y-2'>
                        <h2 className='text-2xl font-bold'>How Your Data is Used</h2>
                        <p>
                            Your chat data is used for:
                        </p>
                        <ul>
                            <li className='flex'><Dot />Generating responses using AI models</li>
                            <li className='flex'><Dot />Improving chatbot accuracy and experience</li>
                            <li className='flex'><Dot />Debugging errors and analyzing usage patterns</li>
                            <li className='flex'><Dot />Helping the business you're interacting with assist you better</li>
                        </ul>
                    </div>
                    <div className='space-y-2'>
                        <h2 className='text-2xl font-bold'>Data Sharing</h2>
                        <p>
                            To provide this service, your data may be shared with:
                        </p>
                        <ul>
                            <li className='flex'><Dot />AI service providers (e.g., OpenAI, Google) to generate responses</li>
                            <li className='flex'><Dot />Cloud infrastructure providers (e.g., Vercel, Supabase)</li>
                            <li className='flex'><Dot />Analytics and logging tools for service improvement</li>
                        </ul>
                        <p>
                            All third parties we use are bound by strict data privacy terms.

                            We do not sell your data.
                        </p>
                    </div>
                    <div className='space-y-2'>
                        <h2 className='text-2xl font-bold'>Data Security</h2>
                        <p>
                            We use industry-standard security practices to protect your data. However, no system is 100% secure, so please avoid sharing sensitive information in the chat.
                        </p>
                    </div>
                    <div className='space-y-2'>
                        <h2 className='text-2xl font-bold'>Data Retention</h2>
                        <p>
                            Your chat data is stored for as long as necessary to operate and improve the service or as required by the business you're chatting with.
                        </p>
                    </div>
                    <div className='space-y-2'>
                        <h2 className='text-2xl font-bold'>Questions or Concerns?</h2>
                        <p>
                            If you have questions about this policy, you can reach us at:
                        </p>
                        <p>app.navichat@gmail.com</p>
                    </div>
                    <br /><br />
                </div>
            </div>
        </>
    )
}

export default DataPolicy
