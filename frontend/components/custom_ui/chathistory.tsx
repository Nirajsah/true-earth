import React from 'react';
import MessageBubble from './message-bubble'; // Import the new MessageBubble component

interface ChatMessage {
  id: string; // Ensure this is unique
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
}

interface ChatHistoryProps {
  chatMessages: ChatMessage[];
}

const ChatHistory = ({ chatMessages }: ChatHistoryProps) => {
  // Use a ref to scroll to the bottom when new messages arrive
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]); // Scroll whenever chatMessages array changes

  return (
    <>
      <div className="flex-1 overflow-y-auto px-2 md:px-4 space-y-4"> {/* Increased space-y for better separation */}
        {chatMessages.length > 0 ? (
          chatMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No chat history available yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default ChatHistory;