import { AppShell } from "@/components/AppShell";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend,
} from "recharts";
import { Search } from "lucide-react";

const anomalies = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  anomalies: Math.round(20 + Math.sin(h / 3) * 15 + Math.random() * 12),
  baseline: Math.round(18 + Math.cos(h / 4) * 6),
}));

const categories = [
  { name: "Unauthorized", count: 42 },
  { name: "Loitering", count: 31 },
  { name: "Crowd", count: 27 },
  { name: "Object Left", count: 19 },
  { name: "Vehicle", count: 24 },
  { name: "Face Match", count: 36 },
];

type Incident = { id: string; ts: string; type: string; confidence: number; status: "Open" | "Resolved" | "Investigating" };

const incidents: Incident[] = Array.from({ length: 22 }, (_, i) => ({
  id: `INC-${1000 + i}`,
  ts: new Date(Date.now() - i * 1000 * 60 * 17).toISOString().replace("T", " ").slice(0, 19),
  type: ["Unauthorized Access", "Crowd Gathering", "Object Left", "Loitering", "Vehicle Anomaly", "Face Match"][i % 6],
  confidence: Math.round(70 + Math.random() * 29),
  status: (["Open", "Resolved", "Investigating"] as const)[i % 3],
}));

const statusCls: Record<Incident["status"], string> = {
  Open: "bg-red-500/15 text-red-300 border-red-500/30",
  Investigating: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  Resolved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
};

export default function Analytics() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => incidents.filter((i) => `${i.id} ${i.type} ${i.status}`.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-cyan-glow">Visual Intelligence</div>
          <h1 className="text-2xl font-bold mt-1">Analytics</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-3">Anomalies Over Time · 24h</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={anomalies}>
                  <CartesianGrid stroke="rgba(0,240,255,0.1)" />
                  <XAxis dataKey="hour" stroke="#7a8aa0" fontSize={11} />
                  <YAxis stroke="#7a8aa0" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#0B0F19", border: "1px solid rgba(0,240,255,0.3)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="anomalies" stroke="#00F0FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="baseline" stroke="#7a8aa0" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-3">Threat Categories</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={categories}>
                  <CartesianGrid stroke="rgba(0,240,255,0.1)" />
                  <XAxis dataKey="name" stroke="#7a8aa0" fontSize={11} />
                  <YAxis stroke="#7a8aa0" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#0B0F19", border: "1px solid rgba(0,240,255,0.3)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" fill="#00F0FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
            <h2 className="text-sm font-semibold">Incident Log</h2>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search incidents…"
                className="bg-black/30 border border-cyan-500/20 rounded-md pl-8 pr-3 py-2 text-sm w-64 ring-cyan"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-cyan-500/10">
                <tr>
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Timestamp</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Confidence</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                    <td className="py-2.5 pr-4 font-mono text-cyan-glow">{i.id}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{i.ts}</td>
                    <td className="py-2.5 pr-4">{i.type}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-black/40 rounded">
                          <div className="h-full bg-cyan-400 rounded" style={{ width: `${i.confidence}%` }} />
                        </div>
                        <span className="text-xs font-mono">{i.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${statusCls[i.status]}`}>{i.status}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No incidents match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
