import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Video, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoPanel() {
  const { messages, isLoading, send, stop, clear } = useChat("video");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-foreground">Nova Video</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center glow-accent animate-float">
              <Clapperboard className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Video AI Assistant</h2>
              <p className="text-sm text-muted-foreground max-w-sm">Describe a video concept and I'll help you plan scenes, scripts, transitions, and creative direction.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {["Product demo video", "Social media reel", "Explainer animation", "Cinematic intro"].map(s => (
                <Button key={s} variant="outline" size="sm" className="text-xs border-border/50 text-muted-foreground hover:text-foreground hover:border-accent/50" onClick={() => send(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 pt-0">
        <ChatInput onSend={send} isLoading={isLoading} onStop={stop} />
      </div>
    </div>
  );
}
