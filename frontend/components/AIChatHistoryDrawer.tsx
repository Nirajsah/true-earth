'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import EnhancedAiChat from './EnhancedAiChat'

interface AIChatHistoryDrawerProps {
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialMessage?: string
}

export function AIChatHistoryDrawer({
  children,
  isOpen,
  onOpenChange,
  initialMessage = '',
}: AIChatHistoryDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="top" className="h-[95%] flex flex-col p-2">
        <SheetHeader>
          <SheetTitle>Leafy</SheetTitle>
        </SheetHeader>
        <EnhancedAiChat initialMessage={initialMessage} />
      </SheetContent>
    </Sheet>
  )
}
