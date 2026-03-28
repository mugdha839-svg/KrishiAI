"use client";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { crisisData, marketPrices, weatherData, kpiData, recentActivities } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/userAuth";
import { formatCurrency } from "@/lib/utils";
import { StatCard, AlertCard, ActionCard, ChartCard } from "@/components/ui/Cards";
import {
  TrendingUp, Sprout, Landmark, FileText, MessageCircle,
  Droplets, Wind, Sun, AlertTriangle, ArrowRight,
  Zap, ArrowUpRight
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const up = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 }} };

export default function Dashboard() {
  const user = getCurrentUser();
  const kpi = user?.kpi ?? kpiData;
  const activities = user?.recentActivities ?? recentActivities;
  return (
    <AppShell>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* ── KPI STRIP ── */}
        <motion.div variants={up} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Net Profit Forecast"
            value={formatCurrency(kpi.netProfitForecast)}
            change={kpi.netProfitChange}
            icon={<TrendingUp className="w-5 h-5" />}
            iconBg="rgba(34,197,94,0.12)" iconColor="var(--green-600)"
          />
          <StatCard
            title="Land Coverage"
            value={`${kpi.landCoverage} Acres`}
            subtitle={`${kpi.landUtilization}% utilized`}
            icon={<Sprout className="w-5 h-5" />}
            iconBg="rgba(59,130,246,0.12)" iconColor="#2563EB"
          />
          <StatCard
            title="Active Loans"
            value={String(kpi.activeLoans)}
            subtitle={formatCurrency(kpi.totalLoanAmount)}
            icon={<Landmark className="w-5 h-5" />}
            iconBg="rgba(245,158,11,0.12)" iconColor="#D97706"
          />
          <StatCard
            title="Scheme Benefits"
            value={formatCurrency(kpi.schemeBenefits)}
            subtitle={`${kpi.schemesApplied} active`}
            icon={<FileText className="w-5 h-5" />}
            iconBg="rgba(139,92,246,0.12)" iconColor="#7C3AED"
          />
        </motion.div>

        {/* ── CRISIS ALERT ── */}
        {crisisData.active && (
          <motion.div variants={up}>
            <AlertCard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Crisis Alert — Live"
              title="Strait of Hormuz Fertilizer Crisis"
              variant="danger"
            >
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Urea <strong style={{ color: "#DC2626" }}>+{crisisData.ureaSpikePct}%</strong> ·
                DAP <strong style={{ color: "#DC2626" }}>+{crisisData.dapSpikePct}%</strong> ·
                MOP <strong style={{ color: "#D97706" }}>+{crisisData.mopSpikePct}%</strong>
              </p>
              <div className="flex flex-wrap gap-5 mt-3">
                {[
                  { label: "Urea", value: `₹${crisisData.currentUreaPrice}`, color: "#DC2626" },
                  { label: "DAP",  value: `₹${crisisData.currentDAPPrice}`,  color: "#DC2626" },
                  { label: "Relief", value: "₹12,000 Cr", color: "#2563EB" },
                ].map(d => (
                  <div key={d.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{d.label}</p>
                    <p className="text-xl font-bold" style={{ color: d.color }}>{d.value}</p>
                  </div>
                ))}
              </div>
              <Link href="/crisis" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold transition hover:opacity-70" style={{ color: "#DC2626" }}>
                View Full Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </AlertCard>
          </motion.div>
        )}

        {/* ── QUICK ACTIONS ── */}
        <motion.div variants={up} className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <ActionCard href="/crops/predict" icon={<Sprout className="w-6 h-6" />} label="Predict Profit" iconBg="rgba(34,197,94,0.12)" iconColor="var(--green-600)" />
          <ActionCard href="/loans"         icon={<Landmark className="w-6 h-6" />} label="Check Loans"   iconBg="rgba(59,130,246,0.12)" iconColor="#2563EB" />
          <ActionCard href="/schemes"       icon={<FileText className="w-6 h-6" />} label="Find Schemes"  iconBg="rgba(139,92,246,0.12)" iconColor="#7C3AED" />
          <ActionCard href="/chat"          icon={<MessageCircle className="w-6 h-6" />} label="Ask AI"   iconBg="rgba(245,158,11,0.12)" iconColor="#D97706" />
        </motion.div>

        {/* ── MARKET + WEATHER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Market Chart — 8 cols */}
          <motion.div variants={up} className="lg:col-span-8">
            <ChartCard
              title="Market Pulse"
              subtitle="Wheat price trend — last 6 months"
              action={
                <Link href="/market" className="text-sm font-semibold flex items-center gap-1 transition hover:opacity-70" style={{ color: "var(--green-600)" }}>
                  View All <ArrowUpRight className="w-4 h-4" />
                </Link>
              }
            >
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={marketPrices.wheat.chartData}>
                  <defs>
                    <linearGradient id="gWheat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month" axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    domain={["dataMin - 50", "dataMax + 50"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      fontSize: "13px",
                      boxShadow: "var(--shadow-lg)",
                      color: "var(--text-primary)",
                    }}
                    formatter={(v) => [`₹${v}`, "Wheat"]}
                  />
                  <Area type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={2.5} fill="url(#gWheat)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                {Object.values(marketPrices).map((crop) => (
                  <div key={crop.name} className="flex items-center gap-2 text-sm">
                    <span>{crop.emoji}</span>
                    <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{crop.name}</span>
                    <span className="font-bold" style={{ color: crop.weeklyChange >= 0 ? "var(--green-600)" : "#DC2626" }}>
                      {crop.weeklyChange >= 0 ? "+" : ""}{crop.weeklyChange}%
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </motion.div>

          {/* Weather — 4 cols */}
          <motion.div variants={up} className="lg:col-span-4">
            <div className="card p-6 h-full flex flex-col gap-4">
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Weather</h3>
              <div className="text-center">
                <span className="text-5xl">{weatherData.current.icon}</span>
                <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
                  {weatherData.current.temp}°C
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{weatherData.current.condition}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{weatherData.location}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: <Droplets className="w-4 h-4" style={{ color: "#3B82F6"}} />, label: "Humidity", val: `${weatherData.current.humidity}%` },
                  { icon: <Wind className="w-4 h-4" style={{ color: "var(--text-muted)"}} />, label: "Wind", val: `${weatherData.current.windSpeed}km/h` },
                  { icon: <Sun className="w-4 h-4" style={{ color: "#F59E0B"}} />, label: "UV", val: String(weatherData.current.uv) },
                ].map(w => (
                  <div
                    key={w.label}
                    className="text-center p-2.5 rounded-xl"
                    style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex justify-center mb-1">{w.icon}</div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{w.label}</p>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{w.val}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 overflow-x-auto">
                {weatherData.forecast.slice(0, 5).map(d => (
                  <div
                    key={d.day}
                    className="flex-shrink-0 text-center p-2 rounded-xl min-w-[50px]"
                    style={{ background: "var(--bg-muted)" }}
                  >
                    <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{d.day}</p>
                    <p className="text-lg my-0.5">{d.icon}</p>
                    <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{d.high}°</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{d.low}°</p>
                  </div>
                ))}
              </div>
              <div
                className="p-3 rounded-xl text-xs leading-relaxed"
                style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#2563EB" }}
              >
                <Zap className="w-3 h-3 inline mr-1" />{weatherData.advisory}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RECENT ACTIVITY ── */}
        <motion.div variants={up}>
          <div className="card p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>Recent Activity</h3>
            <div className="space-y-1">
              {activities.map((a: { id: string; icon: string; text: string; time: string }) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-150"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg-muted)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <span className="text-xl flex-shrink-0">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.text}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.time}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </AppShell>
  );
}
