import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";
import { useImageGen } from "@/hooks/useImageGen";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ConversationList } from "@/components/ConversationList";
import { Volume2, VolumeX, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import novaAvatar from "@/assets/nova-avatar.png";

export function ChatPanel() {
  const { messages, isLoading, send, stop, conversationId, setActiveConversation } = useChat("chat");
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, stopSpeaking, isSupported } = useVoice();
  const { generateImage, isGenerating } = useImageGen();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastMsg = messages[messages.length - 1];

  const handleSend = (msg: string) => {
    if (isListening) stopListening();
    send(msg);
  };

  const handleGenerateImage = async (prompt: string) => {
    // Add user message
    send(`🎨 Generate image: ${prompt}`);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-60 border-r border-border/20 hidden lg:flex flex-col bg-card/20">
        <ConversationList activeId={conversationId} onSelect={setActiveConversation} mode="chat" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-gradient-radial">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/15">
          <div className="flex items-center gap-3">
            <img src={novaAvatar} alt="Nova" className="w-7 h-7 rounded-lg" width={28} height={28} />
            <div>
              <span className="text-sm font-medium text-foreground">Nova Chat</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {lastMsg?.role === "assistant" && (
              <Button size="icon" variant="ghost" className="w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30" onClick={() => isSpeaking ? stopSpeaking() : speak(lastMsg.content)}>
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/15 flex items-center justify-center glow-primary animate-float">
                  <Sparkles className="w-9 h-9 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-foreground">What can I help with?</h2>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">I can answer questions, write content, generate images, and much more.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {[
                  "Explain quantum computing",
                  "Write a haiku about coding",
                  "Help me brainstorm ideas",
                  "🎨 Create a sunset painting",
                ].map(s => (
                  <button key={s} onClick={() => handleSend(s)} className="px-4 py-2 rounded-xl text-xs font-medium bg-secondary/30 border border-border/20 text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:border-border/40 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
          {(isLoading || isGenerating) && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <img src={novaAvatar} alt="Nova" className="w-8 h-8 rounded-xl flex-shrink-0" width={32} height={32} />
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-medium text-accent/60">Nova</span>
                <div className="bg-secondary/40 border border-border/20 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-muted-foreground animate-shimmer">
                      {isGenerating ? "Creating image..." : "Thinking..."}
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
            onSend={handleSend}
            isLoading={isLoading || isGenerating}
            onStop={stop}
            isListening={isListening}
            onToggleVoice={isListening ? stopListening : startListening}
            voiceSupported={isSupported}
            voiceTranscript={transcript}
            showImageButton
            onGenerateImage={handleGenerateImage}
          />
          <p className="text-[10px] text-muted-foreground/40 text-center mt-2">Nova can make mistakes. Consider checking important information.</p>
        </div>
      </div>
    </div>
  );
}
