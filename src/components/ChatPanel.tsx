import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Bot, Trash2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatPanel() {
  const { messages, isLoading, send, stop, clear } = useChat("chat");
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, stopSpeaking, isSupported } = useVoice();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-speak last assistant message
  const lastMsg = messages[messages.length - 1];

  const handleSend = (msg: string) => {
    if (isListening) stopListening();
    send(msg);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">Nova Chat</span>
        </div>
        <div className="flex items-center gap-1">
          {lastMsg?.role === "assistant" && (
            <Button size="icon" variant="ghost" className="w-8 h-8 text-muted-foreground hover:text-foreground" onClick={() => isSpeaking ? stopSpeaking() : speak(lastMsg.content)}>
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          )}
          <Button size="icon" variant="ghost" className="w-8 h-8 text-muted-foreground hover:text-foreground" onClick={clear}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-primary animate-float">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Hi, I'm Nova</h2>
              <p className="text-sm text-muted-foreground max-w-sm">Your AI assistant for chat, voice, and video. Ask me anything or try voice input.</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent" />
            </div>
            <div className="bg-secondary/60 border border-border/30 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 pt-0">
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          onStop={stop}
          isListening={isListening}
          onToggleVoice={isListening ? stopListening : startListening}
          voiceSupported={isSupported}
          voiceTranscript={transcript}
        />
      </div>
    </div>
  );
}
