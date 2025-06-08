import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, task lists, etc.)
import { Button } from '../ui/button'; // Assuming you have a reusable Button component
import { Copy } from 'lucide-react'; // Lucide icon for copy

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [typingEffectFinished, setTypingEffectFinished] = useState(false);

  // Effect for typing animation (only for AI messages that are streaming)
  useEffect(() => {
    if (message.sender === 'ai' && message.isStreaming && !typingEffectFinished) {
      let i = 0;
      setDisplayedText(''); // Reset text when a new streaming message starts
      const typingInterval = setInterval(() => {
        if (i < message.text.length) {
          setDisplayedText((prev) => prev + message.text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setTypingEffectFinished(true); // Mark typing effect as finished
        }
      }, 20); // Adjust typing speed (milliseconds per character)

      return () => {
        clearInterval(typingInterval);
      };
    } else {
      // If not streaming, or sender is user, display full text immediately
      setDisplayedText(message.text);
      setTypingEffectFinished(true); // No typing effect needed
    }
  }, [message.text, message.isStreaming, message.sender]); // Re-run if text or streaming status changes

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const isUser = message.sender === "user";

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          flex flex-col px-3 py-1.5 rounded-xl max-w-[90%]
          ${isUser
            ? "bg-blue-50 text-blue-900" // Light blue for user (subtle)
            : "bg-gray-50 md:min-w-2xl text-gray-800" // Light gray for AI (subtle)
          }
          dark:${isUser
            ? "bg-blue-900 text-blue-100" // Darker blue for user in dark mode
            : "bg-gray-700 text-gray-100" // Darker gray for AI in dark mode
          }
        `}
      >
        {/* Markdown rendering for the message text */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown (for tables, etc.)
        >
          {displayedText + (message.isStreaming && !typingEffectFinished ? '█' : '')} 
        </ReactMarkdown>

        {/* Copy button for AI messages */}
        {!isUser && (
          <div className="flex justify-end mt-2">
            <Button
              variant="ghost" // Use a ghost variant for a subtle button
              size="sm"
              onClick={handleCopy}
              className="text-xs text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {copied ? 'Copied!' : <Copy className="h-3 w-3 mr-1" />}
              {copied ? '' : 'Copy'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;