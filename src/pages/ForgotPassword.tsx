import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthShell, FormField } from "@/components/AuthShell";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link transmitted");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Recover Access" subtitle="We'll send a secure reset link to your inbox">
      <form onSubmit={onSubmit}>
        <FormField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" disabled={loading} className="btn-cyan w-full rounded-md py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Send Reset Link
        </button>
      </form>
      <p className="mt-4 text-xs text-muted-foreground text-center">
        <Link to="/login" className="text-cyan-glow">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
