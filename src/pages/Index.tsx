import { useState } from "react";
import { MessageCircle, Mic, Video, Sparkles } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import { VoicePanel } from "@/components/VoicePanel";
import { VideoPanel } from "@/components/VideoPanel";

type Tab = "chat" | "voice" | "video";

const tabs: { id: Tab; label: string; icon: typeof MessageCircle }[] = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "video", label: "Video", icon: Video },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center glow-primary">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Nova AI</h1>
            <p className="text-xs text-muted-foreground">Chat · Voice · Video</p>
          </div>
        </div>

        {/* Tab Bar */}
        <nav className="flex items-center gap-1 bg-secondary/40 rounded-xl p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/25 glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === "chat" && <ChatPanel />}
        {activeTab === "voice" && <VoicePanel />}
        {activeTab === "video" && <VideoPanel />}
      </main>
    </div>
  );
}
