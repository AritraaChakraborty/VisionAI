import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, Users, Camera, Activity, Radio } from "lucide-react";

type Alert = { id: number; level: "red" | "yellow" | "green"; title: string; zone: string; time: string };

const toneCls: Record<string, string> = {
  cyan: "border-cyan-400 shadow-[0_0_24px_rgba(0,240,255,0.5)] text-cyan-300",
  yellow: "border-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.4)] text-yellow-300",
  red: "border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.45)] text-red-300",
};

const levelCls: Record<Alert["level"], string> = {
  red: "bg-red-500/15 border-red-500/40 text-red-300",
  yellow: "bg-yellow-500/10 border-yellow-500/40 text-yellow-300",
  green: "bg-emerald-500/10 border-emerald-500/40 text-emerald-300",
};

export default function LiveMonitor() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [now, setNow] = useState("");
  
  const [videoFrame, setVideoFrame] = useState<string | null>(null);
  const [liveBoxes, setLiveBoxes] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/stream');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.image) setVideoFrame(data.image);
      if (data.boxes) setLiveBoxes(data.boxes);
      
      // THIS IS THE LISTENER YOU WERE MISSING!
      if (data.new_alerts && data.new_alerts.length > 0) {
        setAlerts((prev) => [...data.new_alerts, ...prev].slice(0, 12));
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-glow flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 pulse-glow" /> Live · Sync OK
            </div>
            <h1 className="text-2xl font-bold mt-1">VisionAI Command Center</h1>
          </div>
          <div className="text-xs text-muted-foreground font-mono">SYSTEM CLOCK · {now}</div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi icon={Camera} label="Active Cameras" value="1" tone="cyan" />
          <Kpi icon={Activity} label="System Status" value="SECURE" tone="green" />
          <Kpi icon={ShieldAlert} label="Active Breaches" value={alerts.length.toString()} tone="red" />
          <Kpi icon={Users} label="Tracked Objects" value={liveBoxes.length.toString()} tone="yellow" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center justify-between px-2 pb-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-glow"><Radio className="h-3.5 w-3.5" /> CAM-07 · ATRIUM</div>
              <div className="text-muted-foreground font-mono">REC ● 1080p · 60fps</div>
            </div>
            
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-cyan-500/30">
              {videoFrame ? (
                <img src={`data:image/jpeg;base64,${videoFrame}`} alt="Live Feed" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-cyan-400 animate-pulse font-mono text-sm">
                  [ ESTABLISHING SECURE LINK... ]
                </div>
              )}

              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(15,42,55,0.2) 0%, rgba(5,15,22,0.4) 60%), repeating-linear-gradient(0deg, rgba(0,240,255,0.04) 0 2px, transparent 2px 4px)" }} />
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(to right, rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              
              {liveBoxes.map((b, i) => (
                <div key={i} className={`absolute border-2 rounded-md ${toneCls[b.tone] || toneCls.cyan} text-[10px] font-mono transition-all duration-75`} style={{ left: b.x, top: b.y, width: b.w, height: b.h }}>
                  <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-black/80 rounded whitespace-nowrap">{b.label}</span>
                  <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-current rounded-full pulse-glow" />
                </div>
              ))}
            </div>
          </div>

          <aside className="glass rounded-2xl p-4 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold tracking-wide flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-cyan-glow" /> Real-Time Alerts
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">{alerts.length} ACTIVE</span>
            </div>
            
            <div className="overflow-y-auto pr-1 space-y-2 flex-1">
              {alerts.length === 0 ? (
                <div className="text-xs text-emerald-400/70 text-center mt-10 font-mono">
                  [ SCANNING ENVIRONMENT. NO THREATS DETECTED. ]
                </div>
              ) : (
                alerts.map((a) => (
                  <div key={a.id} className={`rounded-lg border p-3 text-xs ${levelCls[a.level]} animate-in slide-in-from-right-4`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wide">{a.title}</span>
                      <span className="font-mono opacity-70">{a.time}</span>
                    </div>
                    <div className="mt-1 opacity-80">{a.zone}</div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: "cyan" | "red" | "yellow" | "green" }) {
  const toneText = tone === "red" ? "text-red-300" : tone === "yellow" ? "text-yellow-300" : tone === "green" ? "text-emerald-300" : "text-cyan-glow";
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg bg-black/40 flex items-center justify-center ${toneText}`}><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className={`text-xl font-bold ${toneText}`}>{value}</div>
      </div>
    </div>
  );
}
