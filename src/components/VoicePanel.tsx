import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";

export function VoicePanel() {
  const { messages, isLoading, send } = useChat("chat");
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, stopSpeaking, isSupported } = useVoice();
  const [lastResponse, setLastResponse] = useState("");
  const prevMsgCount = useRef(0);

  // Auto-speak new assistant messages
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

  // Auto-send when listening stops and there's a transcript
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      send(transcript);
    }
  }, [isListening]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
      {/* Orb */}
      <div className="relative">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
          isListening ? "bg-primary/20 glow-primary animate-pulse-glow" : isSpeaking ? "bg-accent/20 glow-accent" : "bg-secondary/40"
        }`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening ? "bg-primary/30 scale-110" : isSpeaking ? "bg-accent/30 scale-105" : "bg-secondary/60"
          }`}>
            <Bot className={`w-10 h-10 transition-colors ${isListening ? "text-primary" : isSpeaking ? "text-accent" : "text-muted-foreground"}`} />
          </div>
        </div>
        {(isListening || isSpeaking) && (
          <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isListening ? "bg-primary" : "bg-accent"}`} />
        )}
      </div>

      {/* Status */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">
          {isListening ? "Listening..." : isSpeaking ? "Speaking..." : isLoading ? "Thinking..." : "Tap to speak"}
        </p>
        {transcript && isListening && (
          <p className="text-sm text-muted-foreground max-w-md">{transcript}</p>
        )}
        {lastResponse && !isListening && (
          <p className="text-sm text-muted-foreground max-w-md line-clamp-3">{lastResponse.replace(/[#*_`~>\-\[\]()]/g, "")}</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {isSupported ? (
          <Button
            size="lg"
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className={`rounded-full w-16 h-16 ${isListening ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80 text-foreground"}`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
        ) : (
          <p className="text-sm text-destructive">Voice not supported in this browser</p>
        )}
        {isSpeaking && (
          <Button size="lg" variant="outline" onClick={stopSpeaking} className="rounded-full w-16 h-16">
            <VolumeX className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
