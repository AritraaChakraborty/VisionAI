import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, Users, Camera, Activity, Radio } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LiveMonitor,
});

type Alert = { id: number; level: "red" | "yellow" | "green"; title: string; zone: string; time: string };

const seedAlerts: Alert[] = [
  { id: 1, level: "red", title: "Unauthorized Access", zone: "Sector B-04", time: "12:41:08" },
  { id: 2, level: "yellow", title: "Crowd Gathering", zone: "Lobby Atrium", time: "12:39:55" },
  { id: 3, level: "green", title: "Patrol Confirmed", zone: "Perimeter West", time: "12:38:20" },
  { id: 4, level: "red", title: "Object Left Behind", zone: "Terminal 3", time: "12:36:11" },
  { id: 5, level: "yellow", title: "Loitering Detected", zone: "Parking C", time: "12:34:02" },
];

const boxes = [
  { x: "18%", y: "32%", w: "22%", h: "38%", label: "Person · 0.96", tone: "cyan" },
  { x: "55%", y: "48%", w: "16%", h: "26%", label: "Bag · 0.88", tone: "yellow" },
  { x: "74%", y: "22%", w: "18%", h: "30%", label: "Vehicle · 0.93", tone: "red" },
];

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

function LiveMonitor() {
  const [alerts, setAlerts] = useState(seedAlerts);
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString());
    tick();
    const t = setInterval(tick, 1000);
    const a = setInterval(() => {
      const titles = ["Motion Spike", "Face Match", "Unauthorized Access", "Crowd Gathering", "Anomaly Trace"];
      const zones = ["Sector A-12", "East Gate", "Server Room", "Roof Cam 7"];
      const levels: Alert["level"][] = ["red", "yellow", "green"];
      setAlerts((prev) => [{
        id: Date.now(),
        level: levels[Math.floor(Math.random() * 3)],
        title: titles[Math.floor(Math.random() * titles.length)],
        zone: zones[Math.floor(Math.random() * zones.length)],
        time: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 12));
    }, 4000);
    return () => { clearInterval(t); clearInterval(a); };
  }, []);

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-glow flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 pulse-glow" /> Live · Sync OK
            </div>
            <h1 className="text-2xl font-bold mt-1">Live Monitor Dashboard</h1>
          </div>
          <div className="text-xs text-muted-foreground font-mono">SYSTEM CLOCK · {now}</div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi icon={Camera} label="Active Cameras" value="128" tone="cyan" />
          <Kpi icon={Activity} label="Events / min" value="42" tone="cyan" />
          <Kpi icon={ShieldAlert} label="Open Threats" value="7" tone="red" />
          <Kpi icon={Users} label="Tracked Subjects" value="316" tone="yellow" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          {/* Video feed */}
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center justify-between px-2 pb-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-glow"><Radio className="h-3.5 w-3.5" /> CAM-07 · ATRIUM</div>
              <div className="text-muted-foreground font-mono">REC ● 1080p · 60fps</div>
            </div>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-cyan-500/20">
              {/* simulated feed */}
              <div className="absolute inset-0" style={{
                background:
                  "radial-gradient(ellipse at 30% 40%, rgba(15,42,55,1) 0%, rgba(5,15,22,1) 60%), repeating-linear-gradient(0deg, rgba(0,240,255,0.04) 0 2px, transparent 2px 4px)",
              }} />
              {/* grid overlay */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.15) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />
              {/* scanline */}
              <div className="absolute left-0 right-0 h-16 scan-line anim-scan" />
              {/* bounding boxes */}
              {boxes.map((b, i) => (
                <div
                  key={i}
                  className={`absolute border-2 rounded-md ${toneCls[b.tone]} text-[10px] font-mono`}
                  style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
                >
                  <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-black/70 rounded">{b.label}</span>
                  <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-current rounded-full pulse-glow" />
                </div>
              ))}
              {/* corner HUD */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-300/80">LAT 40.7128 · LON -74.0060</div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-cyan-300/80">YOLO-v9 · DEPTH-EST · 24ms</div>
            </div>
            {/* thumbnails */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[1,2,3,4].map((n) => (
                <div key={n} className="aspect-video rounded-md border border-cyan-500/20 bg-black relative overflow-hidden">
                  <div className="absolute inset-0 opacity-50" style={{
                    background: "radial-gradient(ellipse at center, rgba(0,240,255,0.15), transparent 70%)",
                  }} />
                  <span className="absolute top-1 left-1.5 text-[9px] font-mono text-cyan-300/80">CAM-0{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert ticker */}
          <aside className="glass rounded-2xl p-4 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold tracking-wide flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-cyan-glow" /> Real-Time Alerts
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">{alerts.length} ACTIVE</span>
            </div>
            <div className="overflow-y-auto pr-1 space-y-2 flex-1">
              {alerts.map((a) => (
                <div key={a.id} className={`rounded-lg border p-3 text-xs ${levelCls[a.level]}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold uppercase tracking-wide">{a.title}</span>
                    <span className="font-mono opacity-70">{a.time}</span>
                  </div>
                  <div className="mt-1 opacity-80">{a.zone}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: "cyan" | "red" | "yellow" }) {
  const toneText = tone === "red" ? "text-red-300" : tone === "yellow" ? "text-yellow-300" : "text-cyan-glow";
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
