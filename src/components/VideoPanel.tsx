import { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useImageGen } from "@/hooks/useImageGen";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ConversationList } from "@/components/ConversationList";
import { Clapperboard, Wand2, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/hooks/useChat";
import novaAvatar from "@/assets/nova-avatar.png";

export function VideoPanel() {
  const { messages, isLoading, send, stop, conversationId, setActiveConversation } = useChat("video");
  const { generateImage, isGenerating } = useImageGen();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleGenerateImage = async (prompt: string) => {
    const userMsg: Message = { role: "user", content: `🎨 ${prompt}` };
    setLocalMessages(prev => [...prev, userMsg]);
    
    const imageUrl = await generateImage(prompt);
    if (imageUrl) {
      const assistantMsg: Message = { role: "assistant", content: `![Generated Image](${imageUrl})\n\nHere's your generated image based on: "${prompt}"` };
      setLocalMessages(prev => [...prev, assistantMsg]);
    } else {
      const errMsg: Message = { role: "assistant", content: "Sorry, I couldn't generate that image. Please try again with a different prompt." };
      setLocalMessages(prev => [...prev, errMsg]);
    }
  };

  const allMessages = localMessages.length > messages.length ? localMessages : messages;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-60 border-r border-border/20 hidden lg:flex flex-col bg-card/20">
        <ConversationList activeId={conversationId} onSelect={setActiveConversation} mode="video" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-gradient-radial">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/15">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center">
              <Wand2 className="w-3.5 h-3.5 text-accent" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">Nova Studio</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] text-muted-foreground">Image & Video AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
          {allMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent/15 to-primary/10 border border-accent/15 flex items-center justify-center glow-accent animate-float">
                  <Wand2 className="w-9 h-9 text-accent" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-foreground">Create something amazing</h2>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">Generate images with AI or plan video content. Click the image button to create visuals, or type to get creative direction.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-2 max-w-md w-full">
                {[
                  { icon: ImageIcon, label: "Generate image", prompt: "A futuristic city at sunset", color: "primary" },
                  { icon: Video, label: "Plan a video", prompt: "Help me plan a product launch video", color: "accent" },
                  { icon: Wand2, label: "Creative concept", prompt: "Create a mood board concept for a tech brand", color: "accent" },
                  { icon: Clapperboard, label: "Script writing", prompt: "Write a 30-second script for a mobile app ad", color: "primary" },
                ].map(s => (
                  <button
                    key={s.label}
                    onClick={() => s.label.includes("image") ? handleGenerateImage(s.prompt) : send(s.prompt)}
                    className="flex items-center gap-3 p-3.5 rounded-xl text-left bg-secondary/20 border border-border/15 hover:bg-secondary/40 hover:border-border/30 transition-all group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-${s.color}/10 border border-${s.color}/15 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <s.icon className={`w-4 h-4 text-${s.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-1">{s.prompt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {allMessages.map((m, i) => <ChatMessage key={i} message={m} />)}
          {(isLoading || isGenerating) && allMessages[allMessages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <img src={novaAvatar} alt="Nova" className="w-8 h-8 rounded-xl flex-shrink-0" width={32} height={32} />
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-medium text-accent/60">Nova</span>
                <div className="bg-secondary/40 border border-border/20 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-muted-foreground animate-shimmer">
                      {isGenerating ? "Generating image..." : "Creating..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 pt-2">
          <ChatInput
            onSend={send}
            isLoading={isLoading || isGenerating}
            onStop={stop}
            showImageButton
            onGenerateImage={handleGenerateImage}
          />
        </div>
      </div>
    </div>
  );
}
