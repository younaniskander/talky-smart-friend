import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";
import novaAvatar from "@/assets/nova-avatar.png";

export function VoicePanel() {
  const { messages, isLoading, send } = useChat("chat");
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, stopSpeaking, isSupported } = useVoice();
  const [lastResponse, setLastResponse] = useState("");
  const prevMsgCount = useRef(0);

  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant" && !isLoading) {
        setLastResponse(last.content);
        speak(last.content);
      }
    }
    prevMsgCount.current = messages.length;
  }, [messages, isLoading, speak]);

  useEffect(() => {
    if (!isListening && transcript.trim()) {
      send(transcript);
    }
  }, [isListening]);

  const stateColor = isListening ? "primary" : isSpeaking ? "accent" : "muted-foreground";

  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 p-8 bg-gradient-radial">
      {/* Orb visualization */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`w-52 h-52 rounded-full flex items-center justify-center transition-all duration-700 ${
          isListening 
            ? "bg-primary/5 border-2 border-primary/20" 
            : isSpeaking 
              ? "bg-accent/5 border-2 border-accent/20" 
              : "bg-muted/5 border border-border/10"
        }`}>
          {/* Middle ring */}
          <div className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
            isListening 
              ? "bg-primary/8 glow-strong" 
              : isSpeaking 
                ? "bg-accent/8 glow-accent" 
                : "bg-muted/10"
          }`}>
            {/* Core */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening ? "bg-primary/15 scale-105" : isSpeaking ? "bg-accent/15 scale-102" : "bg-secondary/30"
            }`}>
              <img src={novaAvatar} alt="Nova" className={`w-14 h-14 rounded-xl transition-all ${isListening || isSpeaking ? "scale-110" : ""}`} width={56} height={56} />
            </div>
          </div>
        </div>

        {/* Pulse rings */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-primary" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-4 rounded-full animate-ping opacity-10 bg-primary" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
          </>
        )}
        {isSpeaking && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-accent" style={{ animationDuration: "2s" }} />
        )}
      </div>

      {/* Status */}
      <div className="text-center space-y-3 max-w-md">
        <h2 className={`text-xl font-display font-semibold transition-colors ${
          isListening ? "text-primary" : isSpeaking ? "text-accent" : "text-foreground"
        }`}>
          {isListening ? "Listening..." : isSpeaking ? "Speaking..." : isLoading ? "Thinking..." : "Ready to listen"}
        </h2>
        {transcript && isListening && (
          <p className="text-sm text-foreground/70 bg-primary/5 border border-primary/10 rounded-xl px-4 py-2">{transcript}</p>
        )}
        {lastResponse && !isListening && !isLoading && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {lastResponse.replace(/[#*_`~>\-\[\]()]/g, "").slice(0, 200)}
          </p>
        )}
        {!transcript && !lastResponse && !isListening && !isLoading && (
          <p className="text-sm text-muted-foreground/60">Tap the microphone to start a voice conversation with Nova</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5">
        {isSupported ? (
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-40 ${
              isListening 
                ? "bg-primary text-primary-foreground glow-strong scale-110 hover:bg-primary/90" 
                : "bg-secondary/60 border border-border/30 text-foreground hover:bg-secondary hover:scale-105"
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        ) : (
          <div className="glass-panel px-6 py-3">
            <p className="text-sm text-destructive">Voice input requires a supported browser</p>
          </div>
        )}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="w-12 h-12 rounded-full bg-secondary/40 border border-border/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
          >
            <VolumeX className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
