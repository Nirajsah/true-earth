'use server'

import { createStreamableValue } from 'ai/rsc'

export const chat = async (prompt: string, sessionId: string) => {
  const stream = createStreamableValue()
  const backendUrl = process.env.BACKEND_URL

  ;(async () => {
    let fullText = '' // This will accumulate the full response including markdown
    let buffer = '' // Buffer for partial SSE lines

    try {
      const endpoint = `${backendUrl}/api/chat` // Replace with your actual endpoint

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          text: prompt,
        }),
      })

      if (!response.ok) {
        // Attempt to read error details from the response body
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }))
        console.error('LLM API Error Response:', errorData)
        throw new Error(
          `API error: ${response.status} - ${
            errorData.message || JSON.stringify(errorData)
          }`
        )
      }

      if (!response.body) {
        throw new Error(
          'Response body is null. Endpoint did not return a stream.'
        )
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8') // Ensure UTF-8 decoding

      let done = false
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          // Accumulate raw chunks into a buffer to handle partial lines
          buffer += decoder.decode(value, { stream: true })

          let newlineIndex
          // Process lines one by one as long as a newline is found
          while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const line = buffer.substring(0, newlineIndex).trim()
            buffer = buffer.substring(newlineIndex + 1) // Remove processed line from buffer

            // SSE lines start with 'data: ', 'event: ', 'id: ', or 'retry: '
            // We are primarily interested in 'data: '
            if (line.startsWith('data: ')) {
              const streamedData = line.substring(6).trim() // Extract the content after 'data: '
              if (streamedData === '[DONE]' || streamedData === '') {
                // Some APIs send [DONE] or empty string to signify end
                // Continue processing, don't break here
                continue
              } else {
                // Try to parse as JSON if it looks like JSON
                try {
                  const parsed = JSON.parse(streamedData)
                  // Handle different response formats
                  if (
                    parsed.choices &&
                    parsed.choices[0] &&
                    parsed.choices[0].delta &&
                    parsed.choices[0].delta.content
                  ) {
                    // OpenAI format
                    fullText += parsed.choices[0].delta.content
                  } else if (parsed.content) {
                    // Simple format
                    fullText += parsed.content
                  } else if (typeof parsed === 'string') {
                    // String format
                    fullText += parsed
                  } else {
                    // Fallback - just add the raw data
                    fullText += streamedData
                  }
                } catch (parseError) {
                  // If not JSON, treat as plain text
                  fullText += streamedData
                }

                stream.update(fullText) // Send the accumulated text to the UI
              }
            }
            // Handle other SSE line types if needed
            else if (line.startsWith('event: ')) {
            }
          }
        }
      }

      // After the loop, if there's any remaining content in the buffer
      if (buffer.trim().length > 0) {
        const remainingLine = buffer.trim()
        if (remainingLine.startsWith('data: ')) {
          const streamedData = remainingLine.substring(6).trim()
          if (streamedData !== '[DONE]' && streamedData !== '') {
            try {
              const parsed = JSON.parse(streamedData)
              if (
                parsed.choices &&
                parsed.choices[0] &&
                parsed.choices[0].delta &&
                parsed.choices[0].delta.content
              ) {
                fullText += parsed.choices[0].delta.content
              } else if (parsed.content) {
                fullText += parsed.content
              } else if (typeof parsed === 'string') {
                fullText += parsed
              } else {
                fullText += streamedData
              }
            } catch (parseError) {
              fullText += streamedData
            }
            stream.update(fullText)
          }
        }
      }

      // Signal that the stream has completed successfully
      stream.done()
    } catch (error) {
      console.error('Error during LLM chat:', error)
      stream.error(String(error))
    }
  })()

  return {
    newMessage: stream.value,
  }
}

export async function getChatHistory(sessionId: string) {
  // Do your DB or API call here, securely server-side
  const res = await fetch(`${process.env.BACKEND_URL}/api/get_chat`, {
    headers: {
      'x-session-id': sessionId,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch history')
  return await res.json()
}
