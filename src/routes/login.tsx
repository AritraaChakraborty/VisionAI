import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthShell, FormField } from "@/components/AuthShell";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Authentication successful");
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Secure Sign In" subtitle="Access your visual intelligence command center">
      <form onSubmit={onSubmit}>
        <FormField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@visionpro.ai" />
        <FormField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <button type="submit" disabled={loading} className="btn-cyan w-full rounded-md py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Authenticate
        </button>
      </form>
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <Link to="/forgot-password" className="hover:text-cyan-glow">Forgot password?</Link>
        <Link to="/signup" className="hover:text-cyan-glow">Create account</Link>
      </div>
    </AuthShell>
  );
}
