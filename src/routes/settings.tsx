import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { Volume2, Eye, Bell, Lock, User } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const members = [
  { name: "Aritraa Chakraborty", initials: "AC" },
  { name: "Anish Chowdhury", initials: "AC" },
  { name: "Rajdeep Banerjee", initials: "RB" },
  { name: "Shreyojit Das", initials: "SD" },
];

function Toggle({ checked, onChange, label, desc, icon: Icon }: any) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-cyan-500/10 last:border-0">
      <div className="flex gap-3">
        <div className="h-9 w-9 rounded-md bg-black/40 text-cyan-glow flex items-center justify-center"><Icon className="h-4 w-4" /></div>
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-cyan-400" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-black transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

function SettingsPage() {
  const [via, setVia] = useState(false);
  const [tts, setTts] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [twoFa, setTwoFa] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setVia(localStorage.getItem("vp-high-contrast") === "1");
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("vp-high-contrast", via ? "1" : "0");
    document.body.parentElement?.classList.toggle("high-contrast", via);
  }, [via]);

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-5xl">
        <div>
          <div className="text-xs uppercase tracking-widest text-cyan-glow">Configuration</div>
          <h1 className="text-2xl font-bold mt-1">Team & Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-1">Accessibility</h2>
            <p className="text-xs text-muted-foreground mb-2">Tune the interface for operators with diverse vision needs.</p>
            <Toggle checked={via} onChange={setVia} label="Visual Impairment Assist Mode" desc="Boost contrast and saturation across the command center." icon={Eye} />
            <Toggle checked={tts} onChange={setTts} label="Text-to-Speech Alerts" desc="Read incoming alerts aloud (placeholder)." icon={Volume2} />
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-1">Notifications & Security</h2>
            <p className="text-xs text-muted-foreground mb-2">Govern alert delivery and account hardening.</p>
            <Toggle checked={alerts} onChange={setAlerts} label="Real-time alert push" desc="Stream critical events to your device." icon={Bell} />
            <Toggle checked={twoFa} onChange={setTwoFa} label="Two-factor authentication" desc="Require a second factor on every login." icon={Lock} />
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Team Roster</h2>
              <p className="text-xs text-muted-foreground">Organization · <span className="text-cyan-glow">Team BaddieDaddie</span></p>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{members.length} members</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.map((m) => (
              <div key={m.name} className="rounded-xl border border-cyan-500/20 bg-black/30 p-4 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full btn-cyan flex items-center justify-center font-bold mb-3">{m.initials}</div>
                <div className="text-sm font-semibold">{m.name}</div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1 flex items-center gap-1">
                  <User className="h-3 w-3" /> Team Member
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
