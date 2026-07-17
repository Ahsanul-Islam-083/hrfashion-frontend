"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";

export default function AiAssistantPage() {
  const [message, setMessage] = useState("");
  
  // Static placeholder state for UI purposes
  const [chatLog, setChatLog] = useState([
    { role: "assistant", content: "Hello! I'm your HR Fashion styling and support assistant. How can I help you today?" }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to log
    setChatLog(prev => [...prev, { role: "user", content: message }]);
    
    // TODO: Wire up actual AI streaming logic here in a future task.
    // e.g. await fetch('/api/ai/chat') and handle ReadableStream response
    
    // Temporary stub response for UI purposes
    setTimeout(() => {
      setChatLog(prev => [...prev, { role: "assistant", content: "I'm currently operating in offline shell mode. I'll be fully connected to the HR Fashion AI network soon!" }]);
    }, 1000);

    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-serif mb-2">AI Assistant</h1>
        <p className="text-neutral-500">Your personal styling guide and support associate.</p>
      </div>

      <div className="flex-1 bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden shadow-sm">
        {/* Chat Log Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatLog.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-foreground text-background' : 'bg-neutral-100 dark:bg-neutral-900 text-foreground'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-neutral-100 dark:bg-neutral-900 text-foreground' : 'border border-neutral-200 dark:border-neutral-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about sizing, styling, or order status..."
              className="w-full px-6 py-4 pr-16 bg-background border border-neutral-200 dark:border-neutral-800 rounded-full text-sm focus:outline-none focus:border-neutral-400 transition-colors shadow-sm"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="absolute right-2 p-3 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-neutral-500">
            AI can make mistakes. Please verify important product information.
          </div>
        </div>
      </div>
    </div>
  );
}
