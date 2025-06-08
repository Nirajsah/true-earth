"use client";

import React, { useState } from "react";
import { AskAIButton } from "@/components/AskAIButton";
import { AIChatHistoryDrawer } from "@/components/AIChatHistoryDrawer";

// Define your message type (or import it from a types file)
interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function ChatProvider() { // Or your main component name
  const [isChatHistoryDrawerOpen, setIsChatHistoryDrawerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState(""); // State for the input field

  const handleSendMessage = (message: string) => {
    // Add user message
    setChatMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", text: message }]);
    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "ai", text: `AI: You said "${message}"` }]);
    }, 1000);
  };

  return (
    <div className="relative">
      {/* The floating Ask AI button */}
      <AskAIButton
        onToggleChatHistoryDrawer={setIsChatHistoryDrawerOpen}
        isChatHistoryDrawerOpen={isChatHistoryDrawerOpen}
      />

      {/* The AI Chat History Drawer */}
      <AIChatHistoryDrawer
        isOpen={isChatHistoryDrawerOpen}
        onOpenChange={setIsChatHistoryDrawerOpen}
      >
        {/* This children prop is what SheetTrigger wraps. In this case, it's not strictly
            necessary for visual trigger if AskAIButton handles it, but keeps the structure */}
        {/* You could optionally place a hidden trigger button here if SheetTrigger requires a child */}
        <div style={{ display: 'none' }} />
      </AIChatHistoryDrawer>
    </div>
  );
}