'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the event interface that matches the EnhancedWorldGlobe events
interface GlobeEvent {
  id: string
  type: 'fire' | 'earthquake'
  lat: number
  lng: number
  country: string | null
  timestamp: string
  size: number
  brightness?: number
  intensity?: number
  magnitude?: number
  magnitude_scale?: string
  depth_km?: number
}

// Define the context state interface
interface GlobeChatContextState {
  // Chat drawer state
  isChatDrawerOpen: boolean
  setIsChatDrawerOpen: (open: boolean) => void
  
  // Selected event data
  selectedEvent: GlobeEvent | null
  setSelectedEvent: (event: GlobeEvent | null) => void
  
  // Pre-filled message for the chat
  chatMessage: string
  setChatMessage: (message: string) => void
  
  // Function to open chat with event data
  openChatWithEvent: (event: GlobeEvent) => void
  
  // Function to clear selected event
  clearSelectedEvent: () => void
}

// Create the context
const GlobeChatContext = createContext<GlobeChatContextState | undefined>(undefined)

// Provider component
interface GlobeChatProviderProps {
  children: ReactNode
}

export function GlobeChatProvider({ children }: GlobeChatProviderProps) {
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<GlobeEvent | null>(null)
  const [chatMessage, setChatMessage] = useState('')

  // Function to open chat with event data
  const openChatWithEvent = (event: GlobeEvent) => {
    setSelectedEvent(event)
    
    // Generate a contextual message based on the event type
    let message = ''
    if (event.type === 'fire') {
      message = `Tell me about the fire event in ${event.country || 'this location'} (${event.lat.toFixed(2)}, ${event.lng.toFixed(2)}) on ${new Date(event.timestamp).toLocaleDateString()}. What are the potential causes and environmental impacts?`
    } else if (event.type === 'earthquake') {
      message = `Tell me about the earthquake in ${event.country || 'this location'} (${event.lat.toFixed(2)}, ${event.lng.toFixed(2)}) on ${new Date(event.timestamp).toLocaleDateString()}. What was the magnitude and what are the potential impacts?`
    }
    
    setChatMessage(message)
    setIsChatDrawerOpen(true)
  }

  // Function to clear selected event
  const clearSelectedEvent = () => {
    setSelectedEvent(null)
    setChatMessage('')
  }

  const value: GlobeChatContextState = {
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    selectedEvent,
    setSelectedEvent,
    chatMessage,
    setChatMessage,
    openChatWithEvent,
    clearSelectedEvent,
  }

  return (
    <GlobeChatContext.Provider value={value}>
      {children}
    </GlobeChatContext.Provider>
  )
}

// Custom hook to use the context
export function useGlobeChat() {
  const context = useContext(GlobeChatContext)
  if (context === undefined) {
    throw new Error('useGlobeChat must be used within a GlobeChatProvider')
  }
  return context
} 