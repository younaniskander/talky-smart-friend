import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Video, Image as ImageIcon, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Conversation {
  id: string;
  title: string;
  mode: string;
  updated_at: string;
}

interface ConversationListProps {
  activeId: string | null;
  onSelect: (id: string | null) => void;
  mode: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const modeIcons: Record<string, typeof MessageCircle> = {
  chat: MessageCircle,
  video: Video,
  image: ImageIcon,
};

export function ConversationList({ activeId, onSelect, mode }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { user } = useAuth();

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select("id, title, mode, updated_at")
      .eq("user_id", user.id)
      .eq("mode", mode)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (data) setConversations(data);
  };

  useEffect(() => { load(); }, [user, mode]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from("conversations").delete().eq("id", id);
    if (activeId === id) onSelect(null);
    load();
  };

  const Icon = modeIcons[mode] || MessageCircle;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 h-10 rounded-xl bg-primary/8 border border-primary/15 text-primary hover:bg-primary/12 hover:text-primary font-medium transition-all"
          onClick={() => { onSelect(null); load(); }}
        >
          <Plus className="w-4 h-4" />
          New conversation
        </Button>
      </div>

      <div className="px-3 mb-2">
        <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/60 px-1">Recent</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 space-y-0.5">
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-all group ${
              activeId === c.id 
                ? "bg-primary/8 border border-primary/15 text-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${activeId === c.id ? "text-primary" : ""}`} />
            <div className="flex-1 min-w-0">
              <span className="block truncate text-xs font-medium">{c.title}</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
                {timeAgo(c.updated_at)}
              </span>
            </div>
            <button
              onClick={(e) => handleDelete(c.id, e)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all mt-0.5"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </button>
        ))}
        {conversations.length === 0 && (
          <div className="flex flex-col items-center py-8 text-center">
            <Icon className="w-8 h-8 text-muted-foreground/20 mb-2" />
            <p className="text-xs text-muted-foreground/40">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
