import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import type { Message } from "@/hooks/useChat";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isUser ? "bg-primary/20" : "bg-accent/20"}`}>
        {isUser ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-accent" />}
      </div>
      <div className={`max-w-[80%] rounded-xl px-4 py-3 ${isUser ? "bg-primary/10 border border-primary/20" : "bg-secondary/60 border border-border/30"}`}>
        {isUser ? (
          <p className="text-sm text-foreground">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none text-foreground/90 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
