import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
      toast({ title: "Account created!", description: "You're now signed in." });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="glass-panel p-8 w-full max-w-sm space-y-6 glow-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Nova AI</h1>
          <p className="text-sm text-muted-foreground">{isLogin ? "Sign in to continue" : "Create your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-secondary/40 border-border/50" />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="bg-secondary/40 border-border/50" />
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "..." : isLogin ? <><LogIn className="w-4 h-4 mr-2" /> Sign In</> : <><UserPlus className="w-4 h-4 mr-2" /> Sign Up</>}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "No account?" : "Already have one?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
