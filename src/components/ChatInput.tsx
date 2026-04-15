import { useState, useRef, useEffect } from "react";
import { Send, Square, Mic, MicOff, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (msg: string) => void;
  isLoading: boolean;
  onStop: () => void;
  isListening?: boolean;
  onToggleVoice?: () => void;
  voiceSupported?: boolean;
  voiceTranscript?: string;
  onGenerateImage?: (prompt: string) => void;
  showImageButton?: boolean;
}

export function ChatInput({ onSend, isLoading, onStop, isListening, onToggleVoice, voiceSupported, voiceTranscript, onGenerateImage, showImageButton }: ChatInputProps) {
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

  const handleImageGen = () => {
    const msg = input.trim();
    if (!msg || isLoading) return;
    onGenerateImage?.(msg);
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
    <div className="glass-panel p-2 flex items-end gap-1.5">
      {/* Voice */}
      {voiceSupported && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleVoice}
          className={`flex-shrink-0 w-9 h-9 rounded-xl transition-all ${
            isListening 
              ? "text-primary bg-primary/10 animate-pulse-glow" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
      )}

      {/* Input */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={showImageButton ? "Describe what to create..." : "Message Nova..."}
        rows={1}
        className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 scrollbar-thin py-2.5 px-2 leading-relaxed"
      />

      {/* Image gen button */}
      {showImageButton && onGenerateImage && (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleImageGen}
          disabled={!input.trim() || isLoading}
          title="Generate image"
          className="flex-shrink-0 w-9 h-9 rounded-xl text-accent hover:text-accent hover:bg-accent/10 disabled:text-muted-foreground/30 transition-all"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      )}

      {/* Send / Stop */}
      {isLoading ? (
        <Button size="icon" variant="ghost" onClick={onStop} className="flex-shrink-0 w-9 h-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all">
          <Square className="w-3.5 h-3.5" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="flex-shrink-0 w-9 h-9 rounded-xl text-primary hover:text-primary hover:bg-primary/10 disabled:text-muted-foreground/30 transition-all"
        >
          <Send className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
