import ReactMarkdown from "react-markdown";
import { Bot, User, Download } from "lucide-react";
import type { Message } from "@/hooks/useChat";
import novaAvatar from "@/assets/nova-avatar.png";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // Check if message contains an image (base64 data URL)
  const imageMatch = message.content.match(/!\[.*?\]\((data:image\/[^)]+)\)/);
  const hasImage = imageMatch || message.content.startsWith("data:image/");
  const imageUrl = imageMatch ? imageMatch[1] : (message.content.startsWith("data:image/") ? message.content : null);
  const textContent = imageMatch ? message.content.replace(/!\[.*?\]\([^)]+\)/, "").trim() : (hasImage ? "" : message.content);

  return (
    <div className={`flex gap-3 group ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        ) : (
          <img src={novaAvatar} alt="Nova" className="w-8 h-8 rounded-xl" width={32} height={32} />
        )}
      </div>

      {/* Content */}
      <div className={`max-w-[75%] space-y-2 ${isUser ? "items-end" : ""}`}>
        <span className={`text-[10px] uppercase tracking-wider font-medium ${isUser ? "text-primary/60 text-right block" : "text-accent/60"}`}>
          {isUser ? "You" : "Nova"}
        </span>
        
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? "bg-primary/8 border border-primary/15 rounded-tr-sm" 
            : "bg-secondary/40 border border-border/20 rounded-tl-sm"
        }`}>
          {imageUrl && (
            <div className="mb-3 relative group/img">
              <img src={imageUrl} alt="Generated" className="rounded-xl max-w-full max-h-80 object-contain" loading="lazy" />
              <a href={imageUrl} download="nova-image.png" className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-background/80 border border-border/30 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                <Download className="w-4 h-4 text-foreground" />
              </a>
            </div>
          )}
          
          {textContent && (
            isUser ? (
              <p className="text-sm text-foreground leading-relaxed">{textContent}</p>
            ) : (
              <div className="prose prose-sm prose-invert max-w-none text-foreground/90 leading-relaxed
                [&_p]:mb-2 [&_p:last-child]:mb-0 
                [&_code]:bg-muted/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-primary [&_code]:text-xs
                [&_pre]:bg-muted/60 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border/20
                [&_ul]:space-y-1 [&_ol]:space-y-1
                [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display
                [&_strong]:text-foreground [&_strong]:font-semibold
                [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
                [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
                <ReactMarkdown>{textContent}</ReactMarkdown>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
