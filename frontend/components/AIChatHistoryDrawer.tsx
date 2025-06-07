"use client";

import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"; // Assuming Button is available
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea is available
import { Send } from "lucide-react"; // Assuming Send icon is available

// Assuming your message type is defined elsewhere or inline
interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

interface AIChatHistoryDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chatMessages: ChatMessage[];
  // NEW PROPS:
  onSendMessage: (message: string) => void;
  currentMessage: string;
  onCurrentMessageChange: (message: string) => void;
}

export function AIChatHistoryDrawer({
  children,
  isOpen,
  onOpenChange,
  chatMessages,
  onSendMessage,
  currentMessage,
  onCurrentMessageChange,
}: AIChatHistoryDrawerProps) {

  const handleSend = () => {
    if (currentMessage.trim()) {
      onSendMessage(currentMessage);
      onCurrentMessageChange(""); // Clear input after sending
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="top" className="h-[90%] flex flex-col">
        <SheetHeader>
          <SheetTitle>AI Chat History</SheetTitle>
          <SheetDescription>
            Your previous conversations with the AI.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 border rounded-md space-y-2 mb-4"> {/* Added mb-4 for spacing */}
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-800 mr-auto"
                  }
                `}
              >
                {msg.text}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No chat history available yet.</p>
          )}
        </div>
        {/* NEW: Integrated chat input directly into the drawer */}
        <div className="flex items-center space-x-2 p-2 border-t"> {/* Added border-t for visual separation */}
          <Textarea
            placeholder="Type your question here."
            className="flex-grow resize-none" // Added resize-none to prevent manual resizing
            value={currentMessage}
            onChange={(e) => onCurrentMessageChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button type="submit" size="icon" onClick={handleSend} className="h-10 w-10">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}