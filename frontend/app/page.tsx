'use client'

import ChatProvider from '@/components/ChatProvider'
import { getOrCreateSessionId } from '@/lib/utils'
import dynamic from 'next/dynamic'
import React from 'react'
import { GlobeChatProvider } from '@/contexts/GlobeChatContext'

// Dynamically import WorldGlobe to avoid SSR issues
const DynamicWorldGlobe = dynamic(() => import('@/components/WorldGlobe'), {
  ssr: false,
})

export default function Home() {
  React.useEffect(() => {
    const id = getOrCreateSessionId()
  }, [])
  return (
    <GlobeChatProvider>
      <main className="flex min-h-full flex-col items-center">
        <DynamicWorldGlobe />
        <ChatProvider />
      </main>
    </GlobeChatProvider>
  )
}
