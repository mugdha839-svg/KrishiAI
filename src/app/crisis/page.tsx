"use client";
import AppShell from "@/components/layout/AppShell";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { crisisData } from "@/lib/mockData";
import { Card, SectionHeader, AlertCard } from "@/components/ui/Cards";
import { AlertTriangle, Globe, TrendingUp, Clock, MapPin, Zap, ArrowRight, ShieldAlert, Package } from "lucide-react";
import Link from "next/link";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const fertPriceHistory = [
  { month: "Oct", urea: 2100, dap: 2500, mop: 1650 },
  { month: "Nov", urea: 2120, dap: 2520, mop: 1660 },
  { month: "Dec", urea: 2200, dap: 2600, mop: 1700 },
  { month: "Jan", urea: 2450, dap: 2800, mop: 1780 },
  { month: "Feb", urea: 2650, dap: 3000, mop: 1880 },
  { month: "Mar", urea: 2850, dap: 3200, mop: 1980 },
];

export default function CrisisPage() {
  return (
    <AppShell>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* Header Banner */}
        <motion.div variants={fadeUp} className="bg-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--bg-card)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-widest">Crisis Intelligence Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Strait of Hormuz Fertilizer Crisis</h1>
            <p className="text-white/80 text-sm max-w-2xl">{crisisData.subtitle}. India imports {crisisData.ureaImportPct}% of urea and {crisisData.gasImportPct}% of feedstock gas from the affected region.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              {[
                { label: "Urea", price: crisisData.currentUreaPrice, prev: crisisData.previousUreaPrice, spike: crisisData.ureaSpikePct },
                { label: "DAP", price: crisisData.currentDAPPrice, prev: crisisData.previousDAPPrice, spike: crisisData.dapSpikePct },
                { label: "MOP", price: crisisData.currentMOPPrice, prev: crisisData.previousMOPPrice, spike: crisisData.mopSpikePct },
              ].map((d) => (
                <div key={d.label} className="bg-[var(--bg-card)]/10 rounded-xl px-4 py-3">
                  <p className="text-xs text-white/70">{d.label}</p>
                  <p className="text-2xl font-bold">₹{d.price}</p>
                  <p className="text-xs text-red-200">↑{d.spike}% from ₹{d.prev}</p>
                </div>
              ))}
              <div className="bg-[var(--bg-card)]/10 rounded-xl px-4 py-3">
                <p className="text-xs text-white/70">Hormuz Status</p>
                <p className="text-lg font-bold uppercase">{crisisData.hormuzStatus}</p>
                <p className="text-xs text-red-200">Shipping disrupted</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Alerts */}
        <motion.div variants={fadeUp}>
          <Card padding="lg">
            <h3 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Key Alerts
            </h3>
            <div className="space-y-2">
              {crisisData.keyAlerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${i < 2 ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"}`}>
                  <span className="text-sm mt-0.5">{i < 2 ? "🔴" : i < 4 ? "🟡" : "🟢"}</span>
                  <p className={`text-sm font-medium ${i < 2 ? "text-red-700" : "text-amber-700"}`}>{alert}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Price Trend */}
        <motion.div variants={fadeUp}>
          <Card padding="lg">
            <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" /> Fertilizer Price Trend (6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={fertPriceHistory}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #fca5a5", fontSize: "13px", background: "#fff" }} formatter={(v) => [`₹${v}`, ""]} />
                <Line type="monotone" dataKey="urea" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: "#EF4444", r: 4 }} name="Urea" />
                <Line type="monotone" dataKey="dap" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 4 }} name="DAP" />
                <Line type="monotone" dataKey="mop" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: "#8B5CF6", r: 4 }} name="MOP" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 justify-center">
              <span className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]"><span className="w-3 h-1.5 rounded bg-red-500" />Urea</span>
              <span className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]"><span className="w-3 h-1.5 rounded bg-amber-500" />DAP</span>
              <span className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]"><span className="w-3 h-1.5 rounded bg-purple-500" />MOP</span>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Timeline */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-[var(--text-secondary)]" /> Crisis Timeline</h3>
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-red-400 via-amber-400 to-gray-200" />
                <div className="space-y-4">
                  {crisisData.timeline.map((t, i) => {
                    const isPast = !t.date.includes("Est") && !t.date.includes("Risk");
                    return (
                      <div key={i} className="flex items-start gap-4 pl-1">
                        <div className={`w-[10px] h-[10px] mt-1.5 rounded-full flex-shrink-0 ring-2 ring-white ${isPast ? "bg-red-500" : t.date.includes("Risk") ? "bg-amber-400" : "bg-gray-300"}`} />
                        <div className={`flex-1 p-3 rounded-xl ${isPast ? "bg-red-50" : "bg-[var(--bg-muted)]"}`}>
                          <p className={`text-xs font-bold ${isPast ? "text-red-600" : "text-[var(--text-secondary)]"}`}>{t.date}</p>
                          <p className="text-sm text-[var(--text-primary)] mt-0.5">{t.event}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* State Stock */}
          <motion.div variants={fadeUp}>
            <Card padding="lg">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-amber-600" /> State-wise Fertilizer Stock</h3>
              <div className="space-y-3">
                {crisisData.stateWiseStock.map((s) => {
                  const pct = Math.round((s.stock / s.required) * 100);
                  const statusColor = s.status === "danger" ? "#EF4444" : s.status === "warning" ? "#F59E0B" : "#22C55E";
                  return (
                    <div key={s.state} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[var(--text-muted)]" />{s.state}</span>
                        <span className="text-xs font-bold" style={{ color: statusColor }}>{s.stock}M / {s.required}M ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: statusColor }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Govt Response */}
        <motion.div variants={fadeUp}>
          <AlertCard icon={<Globe className="w-5 h-5" />} label="Government Response" title="Subsidy Update" variant="info">
            <p className="text-sm text-blue-700 mt-1 leading-relaxed">{crisisData.govtSubsidyStatus}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <Link href="/schemes" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">Check Emergency Schemes <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/crops/predict" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">Recalculate with Crisis Costs <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </AlertCard>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={fadeUp}>
          <AlertCard icon={<Zap className="w-5 h-5" />} label="AI Recommendations" title="Smart Actions" variant="success">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { emoji: "🛒", title: "Buy Fertilizer Now", desc: `Prices expected to rise further before June monsoon. Buy and stock urea at current ₹${crisisData.currentUreaPrice}.` },
                { emoji: "📋", title: "Apply for Emergency Subsidy", desc: "₹5,000/acre relief package. Your 12 acres = ₹60,000 potential benefit. Deadline: April 30." },
                { emoji: "🌾", title: "Sell Wheat This Week", desc: "Jalandhar Mandi offering ₹2,310/qtl. Get cash flow before monsoon input costs peak." },
                { emoji: "🧪", title: "Consider Organic Alternatives", desc: "Neem-coated urea and bio-fertilizers can reduce dependency on imported urea by 15-20%." },
              ].map((tip) => (
                <div key={tip.title} className="bg-[var(--bg-card)] rounded-xl p-3 border border-green-100">
                  <p className="text-xs font-bold text-green-700">{tip.emoji} {tip.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{tip.desc}</p>
                </div>
              ))}
            </div>
          </AlertCard>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
