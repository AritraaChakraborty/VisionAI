import { type ReactNode } from "react";
import { Eye } from "lucide-react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <div className="glass rounded-2xl p-8 w-full max-w-md relative">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-lg btn-cyan flex items-center justify-center">
            <Eye className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-wide">VisionPro</span>
        </div>
        <h1 className="text-2xl font-bold text-cyan-glow">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

export function FormField({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block mb-4">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="mt-1 w-full bg-black/30 border border-cyan-500/20 rounded-md px-3 py-2 text-sm ring-cyan placeholder:text-muted-foreground/60"
      />
    </label>
  );
}
