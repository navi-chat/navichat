'use client'
import LoadingThreeDotsPulse from '@/components/Dots'
import { Button } from '@/components/ui/button'
import { getBot } from '@/lib/actions/bots.actions'
import { getNewMessage } from '@/lib/chatModel'
// import { getMessage } from '@/lib/llmService'
import { Bot, ChatInterfaceType } from '@/lib/types'
import { SendIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

export type Message = {
  sender: 'user' | 'bot',
  text: string
}

const EmbedPage = ({ chatInterface, bot_id }: { chatInterface?: ChatInterfaceType, bot_id: string }) => {
  const BotId = chatInterface?.bot_id || bot_id
  const [bot, setBot] = useState<Bot>()
  const [currentMessage, setCurrentMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [messageLoading, setMessageLoading] = useState(false)

  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard detection for iframe
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)

  // 👇 Scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const initialCall = async () => {
      const res = await getBot({ bot_id: BotId })
      if (res.data) {
        setBot(res.data)
        setMessages((prev) => [...prev, { sender: 'bot', text: `${chatInterface.initial_message}` }])
      }
    }
    initialCall()
  }, [BotId])

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return
    setMessageLoading(true)

    const userMessage: Message = { sender: 'user', text: currentMessage }
    const newMessages = [...messages, userMessage]

    setMessages(newMessages)
    setCurrentMessage("")

    if (bot) {
      // await getMessage()
      // const res = await getNewMessage({ bot: bot, messages: newMessages })
      // setMessages((prev) => [...prev, { sender: "bot", text: res.text }])
      setMessageLoading(false)
    }
  }
  // Enhanced keyboard detection specifically for iframe environments
  useEffect(() => {
    let initialHeight = window.innerHeight;
    let initialDocumentHeight = document.documentElement.clientHeight;

    // Set initial viewport height
    setViewportHeight(initialHeight);

    const detectKeyboard = () => {
      const currentHeight = window.innerHeight;
      const currentDocumentHeight = document.documentElement.clientHeight;

      // Use multiple methods to detect keyboard
      const windowHeightDiff = initialHeight - currentHeight;
      const documentHeightDiff = initialDocumentHeight - currentDocumentHeight;

      // For iframe, we need to be more aggressive in detection
      const threshold = 50; // Lower threshold for iframe
      const heightDiff = Math.max(windowHeightDiff, documentHeightDiff);

      if (heightDiff > threshold) {
        setIsKeyboardOpen(true);
        setViewportHeight(currentHeight);
      } else {
        setIsKeyboardOpen(false);
        setViewportHeight(currentHeight);
      }
    };

    // Multiple event listeners for better detection in iframe
    const handleResize = () => {
      // Small delay to ensure measurements are accurate
      setTimeout(detectKeyboard, 100);
    };

    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const keyboardHeight = initialHeight - window.visualViewport.height;
        if (keyboardHeight > 50) {
          setIsKeyboardOpen(true);
          setViewportHeight(window.visualViewport.height);
        } else {
          setIsKeyboardOpen(false);
          setViewportHeight(window.visualViewport.height);
        }
      }
    };

    const handleFocus = () => {
      // Force detection on focus with multiple attempts
      setTimeout(detectKeyboard, 150);
      setTimeout(detectKeyboard, 300);
      setTimeout(detectKeyboard, 500);
    };

    const handleBlur = () => {
      setTimeout(detectKeyboard, 150);
      setTimeout(detectKeyboard, 300);
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        initialHeight = window.innerHeight;
        initialDocumentHeight = document.documentElement.clientHeight;
        setViewportHeight(initialHeight);
        detectKeyboard();
      }, 500);
    };

    // Add all event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    // Add focus/blur listeners to textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('focus', handleFocus);
      textarea.addEventListener('blur', handleBlur);

      // Also listen for input events
      textarea.addEventListener('input', detectKeyboard);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }

      if (textarea) {
        textarea.removeEventListener('focus', handleFocus);
        textarea.removeEventListener('blur', handleBlur);
        textarea.removeEventListener('input', detectKeyboard);
      }
    };
  }, []);

  // Dynamic height calculation for iframe
  const getContainerHeight = () => {
    if (isKeyboardOpen) {
      return `${viewportHeight - 56}px`; // 56px for header
    }
    return '100vh';
  };

  const getMessagesHeight = () => {
    if (isKeyboardOpen) {
      return `${viewportHeight - 56 - 64}px`; // 56px header + 64px input
    }
    return 'calc(100vh - 120px)';
  };

  return (
    <div
      ref={containerRef}
      className='flex flex-col w-full bg-background h-full'
    >
      <>
        <div className='h-14 w-full bg-background flex items-center px-4 gap-1 border-b flex-shrink-0'>
          <Image src={"/icon.png"} height={38} width={38} alt='logo' />
          <h2 className='text-primary font-semibold text-lg'>{bot?.name}</h2>
          <Button className='ml-auto size-8' variant={'outline'} onClick={() => {
            const existingFrame = window.parent.document.getElementById('bot-frame');
            if (existingFrame) {
              window.parent.document.body.removeChild(existingFrame);
              return;
            }
          }}>
            <XIcon className='size-4' />
          </Button>
        </div>

        {/* Messages container with dynamic height */}
        <div
          className='flex flex-col gap-4 w-full p-5 overflow-y-auto flex-1'
          style={{
            height: getMessagesHeight(),
            maxHeight: getMessagesHeight(),
            paddingBottom: '20px'
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 px-4 rounded-3xl max-w-[75%] ${msg.sender === 'user' ? 'bg-primary text-background rounded-br-sm' : 'bg-foreground/10 text-foreground rounded-tl-sm'}`}>
                <p className='text-wrap break-words'>{msg.text}</p>
              </div>
            </div>
          ))}
          {messageLoading && (
            <div className='p-4 px-4 rounded-3xl w-min bg-foreground/10 text-foreground rounded-tl-sm'>
              <div className='text-wrap break-words'><LoadingThreeDotsPulse /></div>
            </div>
          )}

          {/* 👇 Scroll target */}
          <div ref={endOfMessagesRef} />
        </div>

        <div className='flex items-center justify-center py-2'>
          <p className='text-xs text-muted-foreground'>By Chatting, you agree to our Terms of Service.</p>
        </div>
        {/* Input area - always at bottom */}
        <div
          className='bg-background w-full h-16 flex items-center gap-2 p-2 flex-shrink-0'
          style={{
            position: 'relative',
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <div className='flex items-center w-full rounded-2xl border border-foreground/15 focus-within:border-foreground transition-all pr-2'>
            <div className='flex-1 h-full relative'>
              <textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className='w-full outline-none pl-4 h-11 max-h-12 min-h-6 resize-none bg-transparent border-none leading-4.5 py-3'
                placeholder='Type your message...'
                style={{
                  fontSize: '16px', // Prevents zoom on iOS
                }}
              />
            </div>
            <div
              onClick={handleSendMessage}
              className='w-12 h-9 hover:bg-accent flex items-center justify-center cursor-pointer rounded-sm transition-all'
            >
              <SendIcon className='size-5' />
            </div>
          </div>
        </div>
      </>
    </div>
  )
}

export default EmbedPage