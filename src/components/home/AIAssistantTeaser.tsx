"use client";

import Link from "next/link";
import { Sparkles, MessageSquare } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function AIAssistantTeaser() {
  const { data: session } = useSession();
  
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-background rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm border border-card-border">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card text-xs font-medium uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              <span>AI Style Assistant</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-6 leading-tight">
              Not sure what to wear? <br /> Let our AI curate your look.
            </h2>
            
            <p className="text-muted mb-8 max-w-lg leading-relaxed">
              Experience personalized styling. Chat with our intelligent assistant to discover pieces that perfectly match your taste, occasion, and body type.
            </p>
            
            <Link 
              href={session ? "/dashboard/ai-assistant" : "/login?callbackUrl=/dashboard/ai-assistant"} 
              className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-4 h-4" />
              Start Styling Session
            </Link>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-square max-w-sm mx-auto bg-card rounded-xl relative overflow-hidden border border-card-border p-6 flex flex-col">
              <div className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center text-background">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-none px-4 py-3 text-sm">
                  Hello! I&apos;m your personal HR Fashion style assistant. What occasion are we dressing for today?
                </div>
              </div>
              <div className="flex gap-4 self-end flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-card flex-shrink-0"></div>
                <div className="bg-foreground text-background rounded-2xl rounded-tr-none px-4 py-3 text-sm">
                  I need a smart casual outfit for a creative agency interview.
                </div>
              </div>
              <div className="flex gap-4 mb-6 mt-6">
                <div className="w-8 h-8 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center text-background">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-none px-4 py-3 text-sm">
                  Perfect. I recommend pairing our Linen Blend Blazer with the Pleated Wide Trousers. Let me show you some options...
                </div>
              </div>
            </div>
            
            {/* Decorative blurs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-card rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-card rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
