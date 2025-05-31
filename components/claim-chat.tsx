"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import axios from "axios";
import {
  ToastErrorMessage,
  ToastSuccessMessage,
} from "@/components/ui/toast-messages";
import { useSocketContext } from "./providers/SocketProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
  receiver: {
    id: string;
    name: string;
    image: string;
  };
}

interface Claim {
  id: string;
  status: string;
  messages: Message[];
}

interface ClaimChatProps {
  claimId: string;
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  session: any;
}

export function ClaimChat({
  claimId,
  itemId,
  isOpen,
  onClose,
  receiverId,
  session,
}: ClaimChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { refreshMessage } = useSocketContext();

  const fetchMessages = async () => {
    try {
      const response = await axios.post("/api/claims/getclaim", {
        claimId,
        itemId,
      });

      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      ToastErrorMessage("Failed to load messages");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, claimId, itemId, refreshMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsLoading(true);
      await axios.post("/api/claims/message", {
        claimId,
        content: newMessage,
        receiverId: receiverId,
      });
      setNewMessage("");
      await fetchMessages();
      ToastSuccessMessage("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      ToastErrorMessage("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Claim Chat</DialogTitle>
        </DialogHeader>

        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.sender.id === session?.user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end space-x-2 max-w-[80%] ${
                      isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.sender.image} />
                      <AvatarFallback>
                        {message.sender.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-2xl p-3 ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
                      } shadow-sm`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim()}
              className="self-end bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
