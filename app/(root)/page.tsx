'use client'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@clerk/nextjs'
import { BadgeIndianRupee, ChevronRight, Code, MessageCircleQuestion, Search, Wallet } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is NaviChat?",
    answer: "NaviChat is a plug-and-play AI chatbot for your website that can instantly answer customer queries using your product info, FAQs, and documents."
  },
  {
    question: "How do I add NaviChat to my website?",
    answer: "Just paste a single <script> tag into your site&apos;s HTML. That&apos;s it — no coding or setup needed."
  },
  {
    question: "What can NaviChat talk about?",
    answer: "It can answer questions based on your FAQs, product details, documents, and even contact information."
  },
  {
    question: "Is it safe to use NaviChat on my store?",
    answer: "Yes! NaviChat is secure and only uses the data you provide. We don&apos;t access customer data or interfere with your website."
  },
  {
    question: "Can I train the chatbot with my own content?",
    answer: "Yes! You can upload documents or input FAQs, product lists, and contact info to guide the chatbot&apos;s responses."
  },
  {
    question: "Will it work on mobile devices too?",
    answer: "Absolutely. NaviChat works seamlessly on both desktop and mobile devices."
  },
  {
    question: "What happens when I run out of message credits?",
    answer: "Your chatbot will stop responding until you top up or upgrade your plan. You can add 10,000 messages for ₹100."
  },
  {
    question: "Is there a free plan to try before paying?",
    answer: "Yes! You get 100 free message credits to test NaviChat before upgrading to a paid plan."
  },
  {
    question: "Can I customize how the chatbot looks?",
    answer: "Currently, it has a clean, universal look — but customizable themes are coming soon."
  },
  {
    question: "Who should use NaviChat?",
    answer: "It&apos;s perfect for small e-commerce websites, creators, service providers, or anyone who wants a smart chatbot without any technical hassle."
  }
];

const features = [
  {
    title: "Smart Content Search",
    icon: <Search />
  },
  {
    title: "One-Line Script Setup",
    icon: <Code />
  },
  {
    title: "Affordable AI Messaging",
    icon: <Wallet />
  },
]

const monthlyPlans = [
  {
    name: "Starter",
    price: "Free",
    messages: "100 message credits",
    chatbots: "1 Chatbot",
    isPopular: false,
  },
  {
    name: "Basic",
    price: "₹529/mo",
    messages: "20,000 messages",
    chatbots: "1 Chatbot",
    isPopular: true,
  },
  {
    name: "Pro",
    price: "₹1449/mo",
    messages: "80,000 messages",
    chatbots: "Unlimited Chatbots",
    isPopular: false,
  },
];

const yearlyPlans = [
  {
    name: "Starter",
    price: "Free",
    messages: "100 message credits",
    chatbots: "1 Chatbot",
    isPopular: false,
  },
  {
    name: "Basic",
    price: "₹499/mo (billed yearly)",
    messages: "20,000 messages",
    chatbots: "1 Chatbot",
    isPopular: true,
  },
  {
    name: "Pro",
    price: "₹1399/mo (billed yearly)",
    messages: "80,000 messages",
    chatbots: "Unlimited Chatbots",
    isPopular: false,
  },
];


const Root = () => {
  const { user } = useUser();
  if (user) {
    redirect('/editor')
  }

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const plans = billing === "monthly" ? monthlyPlans : yearlyPlans;

  return (
    <>
      <script src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bot?bot_id=f0f789db-7893-49a9-9320-f33a4e458b2b`} type="text/javascript" async />
      {/* <Header /> */}
      <div className='w-1/2 justify-between h-16 bg-foreground/80 backdrop-blur-3xl border fixed rounded-full top-5 ml-[50%] translate-x-[-50%] flex px-2 items-center'>
        <div className='flex items-center gap-1 bg-background h-12 rounded-full px-4'>
          <Image src={"/icon.png"} alt='logo' height={128} width={128} className='size-9' />
          <h3 className='font-bold text-primary text-xl'>NaviChat</h3>
        </div>
        <div>
          <Button onClick={() => redirect('/editor')} className='bg-background rounded-full h-12 hover:bg-background/90 text-foreground font-bold text-base px-7'>Get Your Chatbot</Button>
        </div>
      </div>
      <section className='w-full flex flex-col items-center pt-24 md:pt-52 gap-5 min-h-screen bg-gradient-to-r from-slate-200 via-white to-slate-200'>
        <div className='w-full h-full p-4 flex flex-col gap-5 md:gap-8 px-20'>
          <div className='space-y-4 flex items-center flex-col'>
            <h1 className='text-3xl md:text-5xl font-bold text-center leading-tight md:leading-14 px-4 md:px-0'>
              Your AI ChatBot in <span className='text-primary'>minutes</span>.
              <br className='hidden md:block' />
              Ready <span className='text-primary'>24/7</span>.
            </h1>
            <p className='text-muted-foreground w-full md:w-1/3 text-center px-4 md:px-0'>
              Add a smart, customizable chatbot to your website powered by AI. No coding required.
            </p>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-3 md:gap-5 mt-6 md:mt-0 w-full justify-center'>
            <Button className='h-12 px-8 w-full bg-gradient-to-b to-primary  from-orange-500 md:w-56 rounded-full font-semibold shadow-lg shadow-orange-500/20 text-base' onClick={() => redirect('/editor')}><p>Get Your ChatBot</p></Button>
            {/* <Button className='h-12 px-8 w-full md:w-48' variant={"outline"}><p>Watch Demo</p> <Play className='size-3.5' /></Button> */}
          </div>
          <div className="flex items-center gap-5">
            <div className='w-full h-px bg-foreground/20' />
            <Image src={"/icon.png"} alt='logo' height={128} width={128} className='size-9' />
            <div className='w-full h-px bg-foreground/20' />
          </div>

          <div className=' flex items-center justify-center gap-8'>
            {features.map((feature, index) => (
              <>
                <div key={`feature-${index}`} className='space-y-5 flex flex-col items-center w-[180px]'>
                  <div className='size-14 flex items-center justify-center border rounded-full border-foreground/10'>
                    <p className='size-11 rounded-full flex items-center justify-center text-white bg-gradient-to-b to-primary from-orange-500 '>{feature.icon}</p>
                  </div>
                  <p className=' font-bold text-lg text-center'>{feature.title}</p>
                </div>
                {index < features.length - 1 && (
                  <div className="w-px h-24 bg-foreground/20" />
                )}
              </>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <div className='w-full h-px bg-foreground/20' />
            <Image src={"/icon.png"} alt='logo' height={128} width={128} className='size-9' />
            <div className='w-full h-px bg-foreground/20' />
          </div>

          <div className='flex flex-col items-center gap-6'>
            <div className='flex gap-2 bg-foreground/80 w-min text-background px-4 py-2 rounded-full'>
              <BadgeIndianRupee />
              <p>Pricing</p>
            </div>
            <h2 className='text-4xl font-bold'>Affordable Pricing</h2>
            <div className="flex justify-center mb-6">
              <div className='p-1 flex items-center gap-1 bg-accent border rounded-lg *:px-5 *:py-2 *:rounded-md *:cursor-pointer transition-all *:transition-all'>
                <div className={`${billing === "monthly" ? 'bg-white border' : 'bg-accent'}`} onClick={() => setBilling("monthly")}>Monthly</div>
                <div className={`${billing === "yearly" ? 'bg-white border' : 'bg-accent'}`} onClick={() => setBilling("yearly")}>Yearly</div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`p-6 border rounded-2xl shadow-sm flex flex-col space-y-4 ${plan.isPopular ? "border-primary bg-primary/5" : "bg-background"
                      }`}
                  >
                    <div className='flex items-center justify-between w-full'>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {plan.isPopular && (
                        <p className='bg-foreground/80 rounded-full text-background px-4 py-1'>Popular</p>
                      )}
                    </div>
                    <p className="text-2xl font-semibold">{plan.price}</p>
                    <p className="text-muted-foreground">{plan.messages}</p>
                    <p className="text-muted-foreground">{plan.chatbots}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className='flex flex-col items-center gap-6'>
            <div className='flex gap-2 bg-foreground/80 w-min text-background px-4 py-2 rounded-full'>
              <MessageCircleQuestion />
              <p>Faq&apos;s</p>
            </div>
            <h2 className='text-4xl font-bold'>Frequently Asked Questions</h2>
            <div className='w-md'>
              <Accordion type="multiple">
                <Accordion type="single" collapsible className='space-y-2'>
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className='bg-slate-200 border-2 border-foreground/5 rounded-lg px-5'>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Accordion>
            </div>
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
