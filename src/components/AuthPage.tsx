import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import authBg from "@/assets/auth-bg.jpg";
import novaAvatar from "@/assets/nova-avatar.png";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else if (!isLogin) {
      toast({ title: "Welcome aboard!", description: "Your account has been created." });
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={authBg} alt="" className="w-full h-full object-cover opacity-40" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/60" />
      </div>

      {/* Left branding - hidden on mobile */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10">
        <div className="max-w-md space-y-8 px-12">
          <div className="flex items-center gap-4">
            <img src={novaAvatar} alt="Nova" className="w-14 h-14 rounded-2xl" width={512} height={512} />
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">Nova AI</h1>
              <p className="text-muted-foreground text-sm">Your intelligent companion</p>
            </div>
          </div>
          <div className="space-y-5">
            {[
              { title: "Chat", desc: "Natural conversations with AI that understands context" },
              { title: "Voice", desc: "Speak naturally and hear responses read back to you" },
              { title: "Create", desc: "Generate images and plan video content with AI" },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth form */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="glass-panel p-8 w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
            <img src={novaAvatar} alt="Nova" className="w-10 h-10 rounded-xl" width={512} height={512} />
            <h1 className="text-2xl font-bold font-display text-foreground">Nova AI</h1>
          </div>
          
          <div className="text-center lg:text-left">
            <h2 className="text-xl font-semibold font-display text-foreground">
              {isLogin ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? "Sign in to continue to Nova" : "Create your free account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-muted/50 border-border/50 h-11 rounded-xl focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="bg-muted/50 border-border/50 h-11 rounded-xl focus:border-primary/50 transition-colors" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium mt-2 transition-all">
              {loading ? (
                <span className="animate-shimmer">Processing...</span>
              ) : isLogin ? (
                <><LogIn className="w-4 h-4 mr-2" /> Sign In</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> Create Account</>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/30" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card/50 px-3 text-muted-foreground">or</span></div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:text-primary/80 font-medium transition-colors">
              {isLogin ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
