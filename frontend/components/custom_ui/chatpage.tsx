'use client' // If this is a Next.js App Router client component

import React, { useState } from 'react'
import Chatbox from './chatbox' // Adjust path as needed
import ChatHistory from './chathistory' // Adjust path as needed
import { v4 as uuidv4 } from 'uuid' // For unique message IDs, npm install uuid

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  isStreaming?: boolean // Optional, to indicate if AI is still typing
}

const ChatPage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [aiIsResponding, setAiIsResponding] = useState(false)

  // Ref to store the AbortController for stream cancellation
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Function to handle sending a message and initiating the stream
  async function handleSend() {
    if (!currentMessage.trim()) return // Don't send empty messages

    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      text: currentMessage.trim(),
    }

    // Add user message to state immediately
    setChatMessages((prevMessages) => [...prevMessages, userMessage])

    // Create a placeholder for the AI's streaming response
    const aiMessageId = uuidv4()
    const aiPlaceholder: ChatMessage = {
      id: aiMessageId,
      sender: 'ai',
      text: '', // Start with an empty text
      isStreaming: true,
    }
    setChatMessages((prevMessages) => [...prevMessages, aiPlaceholder])

    setCurrentMessage('') // Clear input box
    setAiIsResponding(true) // Set loading state for the chatbox

    // Create a new AbortController for this fetch request
    const controller = new AbortController()
    abortControllerRef.current = controller // Store it in ref for potential cancellation

    try {
      const response = await fetch('http://localhost:4000/api/chat', {
        // Use your Axum endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMessage.text }), // Send the user's actual message
        signal: controller.signal, // Link controller to the fetch request
      })

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        )
      }

      // Ensure response.body exists and is readable
      if (!response.body) {
        throw new Error('Response body is null.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let accumulatedText = '' // Accumulate text for the current AI message

      while (true) {
        const { done, value } = await reader.read()
        if (done) break // Stream finished

        const chunk = decoder.decode(value, { stream: true })

        // SSE chunks can sometimes contain multiple 'data:' lines or incomplete lines.
        // We'll split by newline and process each line that starts with 'data: '.
        // `\n\n` marks the end of an SSE event, but individual 'data:' lines can be sent per chunk.
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6).trim() // Remove "data: " prefix
            if (payload) {
              // Only process if payload is not empty
              accumulatedText += payload

              // Update the state with the new chunk appended
              setChatMessages((prevMessages) => {
                const messagesCopy = [...prevMessages]
                const aiMessageIndex = messagesCopy.findIndex(
                  (msg) => msg.id === aiMessageId
                )

                if (aiMessageIndex !== -1) {
                  // Update the text of the existing AI message
                  messagesCopy[aiMessageIndex] = {
                    ...messagesCopy[aiMessageIndex],
                    text: accumulatedText,
                    isStreaming: true, // Keep it true while streaming
                  }
                }
                return messagesCopy
              })
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted by user or component unmount.')
      } else {
        console.error('Stream error:', err)
        // Update the AI message to show an error state
        setChatMessages((prevMessages) => {
          const messagesCopy = [...prevMessages]
          const aiMessageIndex = messagesCopy.findIndex(
            (msg) => msg.id === aiMessageId
          )
          if (aiMessageIndex !== -1) {
            messagesCopy[aiMessageIndex] = {
              ...messagesCopy[aiMessageIndex],
              text:
                messagesCopy[aiMessageIndex].text +
                '\n\n(Error: Failed to get response. Please try again.)',
              isStreaming: false, // Stop streaming on error
            }
          }
          return messagesCopy
        })
      }
    } finally {
      setAiIsResponding(false) // Reset loading state
      abortControllerRef.current = null // Clear the ref

      // Ensure the AI message is marked as not streaming once done (if no error occurred)
      setChatMessages((prevMessages) => {
        const messagesCopy = [...prevMessages]
        const aiMessageIndex = messagesCopy.findIndex(
          (msg) => msg.id === aiMessageId
        )
        if (aiMessageIndex !== -1) {
          messagesCopy[aiMessageIndex] = {
            ...messagesCopy[aiMessageIndex],
            isStreaming: false,
          }
        }
        return messagesCopy
      })
    }
  }

  // Effect to clean up (abort) any ongoing fetch request if the component unmounts
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        console.log('Component unmounted, aborting ongoing fetch.')
      }
    }
  }, []) // Run only once on mount

  return (
    <div className="flex flex-col h-full items-center gap-2">
      <div className="flex-1 overflow-hidden flex flex-col justify-end w-full max-w-6xl max-h-[87%]">
        <ChatHistory chatMessages={chatMessages} />
      </div>

      <Chatbox
        currentMessage={currentMessage}
        onCurrentMessageChange={setCurrentMessage}
        handleSend={() => handleSend()}
        isDisabled={aiIsResponding}
      />
    </div>
  )
}

export default ChatPage

// interface ChatMessage {
//   id: string
//   sender: 'user' | 'ai'
//   text: string
//   isStreaming?: boolean
// }

// const ChatPage = () => {
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
//   const [currentMessage, setCurrentMessage] = useState('')
//   const [aiIsResponding, setAiIsResponding] = useState(false)

//   async function handleSend() {
//     const controller = new AbortController()

//     const fetchStream = async () => {
//       try {
//         const response = await fetch('http://localhost:4000/api/chat', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: 'Tell me a short adventure story.' }),
//           signal: controller.signal,
//         })

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const reader = response.body!.getReader()
//         const decoder = new TextDecoder('utf-8')
//         let fullText = ''

//         while (true) {
//           const { done, value } = await reader.read()
//           if (done) break

//           // Raw chunk bytes to string
//           const chunk = decoder.decode(value, { stream: true })

//           // Parse SSE: `data: ...\n\n`
//           const lines = chunk.split('\n')
//           for (const line of lines) {
//             if (line.startsWith('data: ')) {
//               const payload = line.slice(6).trim()
//               fullText = payload // because your Rust accumulates!
//               chatMessages.push({
//                 id: uuidv4(),
//                 sender: 'ai',
//                 text: fullText,
//               })
//             }
//           }
//         }
//       } catch (err: any) {
//         if (err.name !== 'AbortError') {
//           console.error('Stream error:', err)
//         }
//       }
//     }

//     fetchStream()

//     return () => {
//       controller.abort()
//     }
//   }

//   return (
//     <div className="flex flex-col h-full items-center gap-2">
//       <div className="flex-1 overflow-hidden flex flex-col justify-end w-full max-w-6xl max-h-[87%]">
//         <ChatHistory chatMessages={chatMessages} />
//       </div>

//       <Chatbox
//         currentMessage={currentMessage}
//         onCurrentMessageChange={setCurrentMessage}
//         handleSend={() => handleSend()}
//       />
//     </div>
//   )
// }

// export default ChatPage
