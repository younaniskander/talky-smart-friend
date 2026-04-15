import { useState } from "react";
import { MessageCircle, Mic, Video, Sparkles, LogOut } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import { VoicePanel } from "@/components/VoicePanel";
import { VideoPanel } from "@/components/VideoPanel";
import { AuthPage } from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type Tab = "chat" | "voice" | "video";

const tabs: { id: Tab; label: string; icon: typeof MessageCircle }[] = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "video", label: "Video", icon: Video },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center animate-pulse-glow">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
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

        <div className="flex items-center gap-3">
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

          <Button size="icon" variant="ghost" onClick={signOut} className="text-muted-foreground hover:text-foreground" title="Sign out">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeTab === "chat" && <ChatPanel />}
        {activeTab === "voice" && <VoicePanel />}
        {activeTab === "video" && <VideoPanel />}
      </main>
    </div>
  );
}
