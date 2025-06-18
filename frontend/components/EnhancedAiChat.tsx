'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowUpIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { readStreamableValue } from 'ai/rsc'
import { cn, getOrCreateSessionId } from '@/lib/utils'
import MarkdownRenderer from './MarkdownRenderer'
import { chat, getChatHistory } from '@/action/chat'

export type Message = {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export default function EnhancedAiChat({
  initialMessage = '',
}: {
  initialMessage?: string
}) {
  return (
    <main className="w-full h-full max-h-[85%]">
      <ChatBot initialMessage={initialMessage} />
    </main>
  )
}

const ChatBot = ({ initialMessage = '' }: { initialMessage?: string }) => {
  const messageEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState<string>(initialMessage)
  const [conversation, setConversation] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasStartedChat, setHasStartedChat] = useState<boolean>(false)
  const sessionId =
    sessionStorage.getItem('sessionId') || getOrCreateSessionId()

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ✅ New effect to load chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const messages = await getChatHistory(sessionId)

        // convert to your local format: { role, content }
        const formatted: Message[] = []
        for (const m of messages) {
          formatted.push({ role: 'user', content: m.query, isStreaming: false })
          formatted.push({
            role: 'assistant',
            content: m.response,
            isStreaming: false,
          })
        }

        if (formatted.length > 0) {
          setConversation(formatted)
          setHasStartedChat(true)
        }
      } catch (err) {
        console.error('Error fetching history:', err)
      }
    }

    fetchHistory()
  }, [sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [input, conversation])

  // Effect to handle initial message
  useEffect(() => {
    if (initialMessage && inputRef.current) {
      inputRef.current.textContent = initialMessage
      setInput(initialMessage)
    }
  }, [initialMessage])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      isStreaming: false,
    }

    const inputText = input.trim()
    setInput('')
    if (inputRef.current) {
      inputRef.current.textContent = ''
    }

    setIsLoading(true)
    setConversation((prev) => [...prev, userMessage])
    setHasStartedChat(true)

    try {
      const { newMessage } = await chat(inputText, sessionId)

      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        isStreaming: true,
      }

      setConversation((prev) => [...prev, assistantMessage])

      for await (const fullText of readStreamableValue(newMessage)) {
        setConversation((prev) => {
          const newConv = [...prev]
          const lastMessage = newConv[newConv.length - 1]
          newConv[newConv.length - 1] = {
            ...lastMessage,
            content: fullText || '',
            isStreaming: true,
          }
          return newConv
        })
      }

      // Mark streaming as complete
      setConversation((prev) => {
        const newConv = [...prev]
        const lastMessage = newConv[newConv.length - 1]
        newConv[newConv.length - 1] = {
          ...lastMessage,
          isStreaming: false,
        }
        return newConv
      })
    } catch (error) {
      console.error('Error: ', error)
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error. Please try again',
          isStreaming: false,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative h-full flex flex-col items-center">
      {/* Message Container */}
      <div className="flex-1 w-full max-w-5xl px-4 h-full max-h-[90%] overflow-y-scroll p-2">
        {!hasStartedChat ? (
          <div className="flex flex-col justify-end h-full space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-semibold">Hi there 👋</h1>
              <h2 className="text-xl text-muted-foreground">
                What can I help you with?
              </h2>
            </div>
          </div>
        ) : (
          <motion.div
            animate={{
              paddingBottom: input
                ? input.split('\n').length > 3
                  ? '206px'
                  : '110px'
                : '80px',
            }}
            transition={{ duration: 0.2 }}
            className="h-full space-y-4"
          >
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex', {
                  'justify-end': message.role === 'user',
                  'justify-start': message.role === 'assistant',
                })}
              >
                <div
                  className={cn('max-w-[80%] rounded-xl px-4 py-2', {
                    'bg-foreground text-background': message.role === 'user',
                    'bg-muted': message.role === 'assistant',
                  })}
                >
                  {message.role === 'assistant' ? (
                    <MarkdownRenderer
                      content={message.content}
                      isStreaming={message.isStreaming || false}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messageEndRef} />
          </motion.div>
        )}
      </div>

      {/* Input Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          position: hasStartedChat ? 'fixed' : 'relative',
        }}
        className="w-full bg-gradient-to-t from-white via-white to-transparent pb-3 bottom-0 mt-auto"
      >
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            animate={{ height: 'auto' }}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center border rounded-2xl lg:rounded-e-3xl p-1 md:p-2.5 gap-2 bg-background"
          >
            <div
              contentEditable
              role="textbox"
              onInput={(e) => {
                setInput(e.currentTarget.textContent || '')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              data-placeholder="Message..."
              className="flex-1 min-h-[36px] overflow-y-auto px-3 py-2 focus:outline-none text-md bg-background rounded-md empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] whitespace-pre-wrap break-words"
              ref={(element) => {
                inputRef.current = element
                if (element && !input) {
                  element.textContent = ''
                }
              }}
            />

            <Button
              size="icon"
              className="rounded-full shrink-0 mb-0.5"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <ArrowUpIcon strokeWidth={2.5} className="size-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
