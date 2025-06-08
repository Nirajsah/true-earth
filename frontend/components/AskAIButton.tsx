"use client"
import React from "react"; // No longer need useState, useEffect for this component
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Simplified props, we only care about opening/closing the drawer now
interface AskAIButtonProps {
  onToggleChatHistoryDrawer: (open: boolean) => void;
  isChatHistoryDrawerOpen: boolean; // Still useful to know if drawer is open
}

export function AskAIButton({
  onToggleChatHistoryDrawer,
  isChatHistoryDrawerOpen, // We use this to decide if the button should be visible/active
}: AskAIButtonProps) {

  // The button's position will remain fixed
  const buttonRightOffset = 16; // Equivalent to right-4 in px
  const buttonBottomOffset = 16; // Equivalent to bottom-4 in px

  // If the drawer is open, we can hide this button or change its appearance
  if (isChatHistoryDrawerOpen) {
    return null; // Or render a smaller "minimize" button if you want
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }} // Initial state for animation
      animate={{ opacity: 1, scale: 1 }} // Animate in
      exit={{ opacity: 0, scale: 0 }} // Animate out when drawer is open
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed z-[100] cursor-pointer" // Adjust z-index as needed
      style={{ right: buttonRightOffset, bottom: buttonBottomOffset }}
    >
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer w-full h-full text-lg flex items-center justify-center gap-2 rounded-full px-4 py-2" // Added bg-card for consistent styling
        onClick={() => onToggleChatHistoryDrawer(true)} // This button's only job is to open the drawer
      >
        Ask AI<Send className="h-6 w-6" />
      </Button>
    </motion.div>
  );
}