import { useState, useRef, useEffect } from "react";
import { Send, Square, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (msg: string) => void;
  isLoading: boolean;
  onStop: () => void;
  isListening?: boolean;
  onToggleVoice?: () => void;
  voiceSupported?: boolean;
  voiceTranscript?: string;
}

export function ChatInput({ onSend, isLoading, onStop, isListening, onToggleVoice, voiceSupported, voiceTranscript }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (voiceTranscript) setInput(voiceTranscript);
  }, [voiceTranscript]);

  const handleSubmit = () => {
    const msg = input.trim();
    if (!msg || isLoading) return;
    onSend(msg);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 160) + "px"; }
  };

  return (
    <div className="glass-panel p-3 flex items-end gap-2">
      {voiceSupported && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleVoice}
          className={`flex-shrink-0 ${isListening ? "text-primary animate-pulse-glow rounded-full" : "text-muted-foreground hover:text-foreground"}`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
      )}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Ask Nova anything..."
        rows={1}
        className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground scrollbar-thin"
      />
      {isLoading ? (
        <Button size="icon" variant="ghost" onClick={onStop} className="flex-shrink-0 text-destructive hover:text-destructive">
          <Square className="w-4 h-4" />
        </Button>
      ) : (
        <Button size="icon" variant="ghost" onClick={handleSubmit} disabled={!input.trim()} className="flex-shrink-0 text-primary hover:text-primary disabled:text-muted-foreground">
          <Send className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
