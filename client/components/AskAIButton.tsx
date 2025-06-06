import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export function AskAIButton() {
  return (
    <div className="fixed bottom-4 left-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Ask AI</Button>
        </DrawerTrigger>
        <DrawerContent className="h-3/4 fixed bottom-0 left-0 right-0 mt-24 rounded-t-[10px] border-0">
          <div className="mx-auto w-full max-w-sm flex flex-col h-full">
            <DrawerHeader>
              <DrawerTitle>Ask AI</DrawerTitle>
              <DrawerDescription>Get answers from the AI.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-grow overflow-y-auto p-4">
              {/* Chat messages will go here */}
              <p>Chat content will be here...</p>
            </div>
            <DrawerFooter className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Textarea placeholder="Type your message here." className="flex-grow resize-none" />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
} 