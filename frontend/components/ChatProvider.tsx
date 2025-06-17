'use client'

import React from 'react'
import { AskAIButton } from '@/components/AskAIButton'
import { AIChatHistoryDrawer } from '@/components/AIChatHistoryDrawer'
import { useGlobeChat } from '@/contexts/GlobeChatContext'

export default function ChatProvider() {
  // Or your main component name
  const { isChatDrawerOpen, setIsChatDrawerOpen, chatMessage } = useGlobeChat()

  return (
    <div className="relative">
      {/* The floating Ask AI button */}
      <AskAIButton
        onToggleChatHistoryDrawer={setIsChatDrawerOpen}
        isChatHistoryDrawerOpen={isChatDrawerOpen}
      />

      <AIChatHistoryDrawer
        isOpen={isChatDrawerOpen}
        onOpenChange={setIsChatDrawerOpen}
        initialMessage={chatMessage}
      >
        {/* This children prop is what SheetTrigger wraps. In this case, it's not strictly
            necessary for visual trigger if AskAIButton handles it, but keeps the structure */}
        {/* You could optionally place a hidden trigger button here if SheetTrigger requires a child */}
        <div style={{ display: 'none' }} />
      </AIChatHistoryDrawer>
    </div>
  )
}
