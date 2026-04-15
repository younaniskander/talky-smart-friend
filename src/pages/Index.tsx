import { useState } from "react";
import { MessageCircle, Mic, Wand2, Sparkles, LogOut, Menu } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import { VoicePanel } from "@/components/VoicePanel";
import { VideoPanel } from "@/components/VideoPanel";
import { AuthPage } from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import novaAvatar from "@/assets/nova-avatar.png";

type Tab = "chat" | "voice" | "studio";

const tabs: { id: Tab; label: string; icon: typeof MessageCircle; desc: string }[] = [
  { id: "chat", label: "Chat", icon: MessageCircle, desc: "Text conversation" },
  { id: "voice", label: "Voice", icon: Mic, desc: "Speak with Nova" },
  { id: "studio", label: "Studio", icon: Wand2, desc: "Image & video" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background bg-gradient-radial">
        <div className="flex flex-col items-center gap-4">
          <img src={novaAvatar} alt="Nova" className="w-16 h-16 rounded-2xl animate-pulse-glow" width={64} height={64} />
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-border/15 bg-card/30">
        <div className="flex items-center gap-3">
          <img src={novaAvatar} alt="Nova" className="w-8 h-8 rounded-xl" width={32} height={32} />
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold font-display text-foreground leading-tight">Nova AI</h1>
            <p className="text-[10px] text-muted-foreground/60">Intelligent Assistant</p>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-center gap-0.5 bg-muted/30 rounded-xl p-0.5 border border-border/10">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.desc}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-card/80 text-foreground border border-border/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : ""}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/20 border border-border/10">
            <div className="w-5 h-5 rounded-md bg-primary/15 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-primary">{user.email?.[0]?.toUpperCase()}</span>
            </div>
            <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">{user.email}</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={signOut}
            className="w-8 h-8 rounded-xl text-muted-foreground/50 hover:text-foreground hover:bg-muted/30"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === "chat" && <ChatPanel />}
        {activeTab === "voice" && <VoicePanel />}
        {activeTab === "studio" && <VideoPanel />}
      </main>
    </div>
  );
}
