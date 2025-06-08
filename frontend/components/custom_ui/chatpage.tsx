'use client'; // If this is a Next.js App Router client component

import React, { useState } from 'react';
import Chatbox from './chatbox'; // Adjust path as needed
import ChatHistory from './chathistory'; // Adjust path as needed
import { v4 as uuidv4 } from 'uuid'; // For unique message IDs, npm install uuid

// Mock data for AI response with a table and other markdown
const MOCK_AI_RESPONSE = `
Hello there! I can definitely help with data.
Here's a sample table for your reference:

| Product   | Price ($) | Quantity |
|-----------|-----------|----------|
| Laptop    | 1200      | 50       |
| Mouse     | 25        | 200      |
| Keyboard  | 75        | 120      |
| Monitor   | 300       | 80       |

Let me know if you need any more information!
`;

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
}

const ChatPage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [aiIsResponding, setAiIsResponding] = useState(false);

  const handleSend = () => {
    if (currentMessage.trim() === '' || aiIsResponding) return;

    const newUserMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      text: currentMessage.trim(),
    };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setCurrentMessage('');
    setAiIsResponding(true);

    // Simulate AI response streaming
    const aiMessageId = uuidv4();
    let currentAiResponseText = '';
    let charIndex = 0;

    // Add initial AI message placeholder with streaming status
    setChatMessages((prev) => [
      ...prev,
      { id: aiMessageId, sender: 'ai', text: '', isStreaming: true },
    ]);

    const streamInterval = setInterval(() => {
      if (charIndex < MOCK_AI_RESPONSE.length) {
        currentAiResponseText += MOCK_AI_RESPONSE.charAt(charIndex);
        charIndex++;

        setChatMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: currentAiResponseText } : msg
          )
        );
      } else {
        clearInterval(streamInterval);
        setAiIsResponding(false);
        // Mark AI message as no longer streaming
        setChatMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
          )
        );
      }
    }, 10);
  };

  return (
    <div className="flex flex-col h-full items-center gap-2">
      <div className="flex-1 overflow-hidden flex flex-col justify-end w-full max-w-6xl max-h-[87%]">
        <ChatHistory chatMessages={chatMessages} />
      </div>

        <Chatbox
          currentMessage={currentMessage}
          onCurrentMessageChange={setCurrentMessage}
          handleSend={handleSend}
        />
    </div>
  );
};

export default ChatPage;