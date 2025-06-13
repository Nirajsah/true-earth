'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import ChatPage from './custom_ui/chatpage'

interface AIChatHistoryDrawerProps {
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AIChatHistoryDrawer({
  children,
  isOpen,
  onOpenChange,
}: AIChatHistoryDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="top" className="h-[95%] flex flex-col p-2">
        <SheetHeader>
          <SheetTitle>AI Chat</SheetTitle>
        </SheetHeader>
        <ChatPage />
      </SheetContent>
    </Sheet>
  )
}
