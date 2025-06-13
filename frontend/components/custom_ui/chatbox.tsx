import React from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

interface ChatboxProps {
  currentMessage: string
  onCurrentMessageChange: (message: string) => void
  handleSend: () => void
  isDisabled: boolean
}

const Chatbox = ({
  currentMessage,
  onCurrentMessageChange,
  handleSend,
  isDisabled,
}: ChatboxProps) => {
  return (
    <div className="relative flex items-end gap-2 p-3 w-full max-w-3xl mx-auto bg-white dark:bg-[#303030] rounded-[24px] border border-[#e0e0e0] focus-within:shadow-lg transition-shadow duration-200 overflow-hidden h-full min-h-[10px] max-h-[100px] md:max-h-[120px]">
      <Textarea
        id="chatbox-textarea"
        placeholder="Ask anything"
        className="flex-grow resize-none border-none focus-visible:ring-0 focus-visible:outline-none bg-transparent min-h-[56px] h-full max-h-[100px] md:max-h-[200px] text-base p-1 text-token-text-primary placeholder:text-token-text-tertiary [scrollbar-width:thin] default-browser vertical-scroll-fade-mask"
        value={currentMessage}
        onChange={(e) => onCurrentMessageChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
      />

      <Button
        type="submit"
        size="icon"
        onClick={handleSend}
        className="h-10 w-10 shrink-0 rounded-full bg-black text-white flex items-center justify-center dark:bg-white dark:text-black hover:opacity-80 transition-opacity duration-200"
        disabled={isDisabled}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default Chatbox
