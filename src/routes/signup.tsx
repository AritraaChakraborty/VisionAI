import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthShell, FormField } from "@/components/AuthShell";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account provisioned");
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Request Access" subtitle="Provision a new operator account">
      <form onSubmit={onSubmit}>
        <FormField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField label="Password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="btn-cyan w-full rounded-md py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create Account
        </button>
      </form>
      <p className="mt-4 text-xs text-muted-foreground text-center">
        Already cleared? <Link to="/login" className="text-cyan-glow">Sign in</Link>
      </p>
    </AuthShell>
  );
}
