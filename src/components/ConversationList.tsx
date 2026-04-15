import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Video, Plus, Trash2 } from "lucide-react";
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

  const Icon = mode === "video" ? Video : MessageCircle;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/30">
        <Button variant="outline" size="sm" className="w-full border-border/50 text-muted-foreground hover:text-foreground" onClick={() => { onSelect(null); load(); }}>
          <Plus className="w-4 h-4 mr-2" /> New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all group ${
              activeId === c.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate flex-1">{c.title}</span>
            <button onClick={(e) => handleDelete(c.id, e)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
              <Trash2 className="w-3 h-3" />
            </button>
          </button>
        ))}
        {conversations.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
        )}
      </div>
    </div>
  );
}
