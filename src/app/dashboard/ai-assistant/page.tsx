"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchChatHistory, sendChatMessage, type ChatMessage } from "@/lib/api";
import { getToken } from "@/lib/auth-client";

const SUGGESTED_PROMPTS = [
  "Show me summer collection pieces",
  "Any open jobs in Sales?",
  "What manufacturing services do you offer?",
];

export default function AiAssistantPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["ai-chat-history"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchChatHistory(token);
    },
  });

  const chatLog = data?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const sendMutation = useMutation({
    mutationFn: async (msg: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return sendChatMessage(msg, token);
    },
    onMutate: async (newMsg) => {
      await queryClient.cancelQueries({ queryKey: ["ai-chat-history"] });
      const previousData = queryClient.getQueryData<{ messages: ChatMessage[] }>(["ai-chat-history"]);
      
      const optimisticUserMsg: ChatMessage = {
        _id: `temp-${Date.now()}`,
        userId: "temp",
        role: "user",
        content: newMsg,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<{ messages: ChatMessage[] }>(["ai-chat-history"], (old) => {
        return { messages: [...(old?.messages || []), optimisticUserMsg] };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-chat-history"] });
    },
    onError: (err, newMsg, context) => {
      toast.error("Failed to send message");
      if (context?.previousData) {
        queryClient.setQueryData(["ai-chat-history"], context.previousData);
      }
    },
  });

  const handleSend = (msg: string) => {
    if (!msg.trim() || sendMutation.isPending) return;
    setMessage("");
    sendMutation.mutate(msg);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(message);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-serif mb-2">AI Assistant</h1>
        <p className="text-muted">Your personal styling guide and support associate.</p>
      </div>

      <div className="flex-1 bg-background rounded-sm border border-card-border flex flex-col overflow-hidden shadow-sm">
        {/* Chat Log Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted" />
            </div>
          ) : chatLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 bg-card border border-card-border rounded-full flex items-center justify-center mb-2">
                <Bot className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-medium">Welcome to HR Fashion Assistant</h3>
              <p className="text-sm text-muted">
                I can help you explore our product collections, learn about our manufacturing services, or browse open career opportunities. What would you like to know?
              </p>
            </div>
          ) : (
            chatLog.map((msg) => (
              <div key={msg._id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-foreground text-background' : 'bg-card border border-card-border text-foreground'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-card text-foreground' : 'bg-card border border-card-border'} whitespace-pre-wrap`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          
          {sendMutation.isPending && (
             <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-card border border-card-border text-foreground">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-sm text-sm leading-relaxed bg-card border border-card-border flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-muted/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-muted/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-muted/30 rounded-full animate-bounce"></span>
                </div>
              </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-card-border bg-card">
          
          {!isLoading && chatLog.length === 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4 max-w-4xl mx-auto">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={sendMutation.isPending}
                  className="px-3 py-1.5 text-xs bg-background border border-card-border rounded-full hover:bg-foreground/5 transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="relative flex items-center max-w-4xl mx-auto">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about sizing, styling, or order status..."
              disabled={sendMutation.isPending}
              className="w-full px-6 py-4 pr-16 bg-background border border-card-border rounded-full text-sm focus:outline-none focus:border-muted transition-colors shadow-sm disabled:opacity-70 disabled:bg-card"
            />
            <button 
              type="submit"
              disabled={!message.trim() || sendMutation.isPending}
              className="absolute right-2 p-3 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[40px]"
            >
              {sendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-muted">
            AI can make mistakes. Please verify important product information.
          </div>
        </div>
      </div>
    </div>
  );
}
