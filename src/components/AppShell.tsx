import { Link, useRouterState, useNavigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState, type ReactNode } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Activity, BarChart3, Settings, LogOut, Eye, Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Live Monitor", icon: Activity },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Team & Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHighContrast(localStorage.getItem("vp-high-contrast") === "1");
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${highContrast ? "high-contrast" : ""}`}>
      {/* Sidebar */}
      <aside className={`fixed md:static z-40 inset-y-0 left-0 w-64 glass border-r border-cyan-500/10 transform transition-transform ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-5 flex items-center gap-2 border-b border-cyan-500/10">
          <div className="h-9 w-9 rounded-lg btn-cyan flex items-center justify-center"><Eye className="h-5 w-5" /></div>
          <div>
            <div className="font-semibold tracking-wide">VisionPro</div>
            <div className="text-[10px] uppercase text-muted-foreground">Command Center</div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${active ? "bg-cyan-500/10 text-cyan-glow glow-cyan" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              >
                <Icon className="h-4 w-4" />{label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-500/10">
          <div className="text-xs text-muted-foreground truncate mb-2">{user.email}</div>
          <button
            onClick={async () => { await signOut(auth); navigate({ to: "/login" }); }}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-glow"
          ><LogOut className="h-3.5 w-3.5" /> Sign out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-4 border-b border-cyan-500/10 glass md:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-semibold">VisionPro</span>
          <span />
        </header>
        <main className="flex-1 overflow-auto">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
