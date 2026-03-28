"use client";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { kpiData, crisisData, marketPrices, weatherData, recentActivities } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Sprout, Landmark, FileText, MessageCircle,
  Droplets, Wind, Sun, AlertTriangle, ArrowRight, Zap, ArrowUpRight
} from "lucide-react";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Dashboard() {
  return (
    <AppShell>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* ═══ KPI METRICS — 4 equal cards ═══ */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Net Profit Forecast" value={formatCurrency(kpiData.netProfitForecast)}
            change={kpiData.netProfitChange} icon={<TrendingUp className="w-5 h-5" />}
            iconBg="bg-green-50" iconColor="text-green-600" />
          <KPICard
            title="Land Coverage" value={`${kpiData.landCoverage} Acres`}
            subtitle={`${kpiData.landUtilization}% utilized`}
            icon={<Sprout className="w-5 h-5" />} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <KPICard
            title="Active Loans" value={String(kpiData.activeLoans)}
            subtitle={formatCurrency(kpiData.totalLoanAmount)}
            icon={<Landmark className="w-5 h-5" />} iconBg="bg-amber-50" iconColor="text-amber-600" />
          <KPICard
            title="Scheme Benefits" value={formatCurrency(kpiData.schemeBenefits)}
            subtitle={`${kpiData.schemesApplied} schemes active`}
            icon={<FileText className="w-5 h-5" />} iconBg="bg-purple-50" iconColor="text-purple-600" />
        </motion.div>

        {/* ═══ CRISIS ALERT — Highlighted card ═══ */}
        {crisisData.active && (
          <motion.div variants={fadeUp} className="bg-red-50 border border-red-200 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">Crisis Alert</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Strait of Hormuz Fertilizer Crisis</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Urea <span className="font-bold text-red-600">+{crisisData.ureaSpikePct}%</span> · DAP <span className="font-bold text-red-600">+{crisisData.dapSpikePct}%</span> · MOP <span className="font-bold text-amber-600">+{crisisData.mopSpikePct}%</span>
                </p>
                <div className="flex flex-wrap gap-4 mt-3">
                  {[
                    { label: "Urea", value: `₹${crisisData.currentUreaPrice}`, color: "text-red-700" },
                    { label: "DAP", value: `₹${crisisData.currentDAPPrice}`, color: "text-red-700" },
                    { label: "Subsidy", value: "₹12,000 Cr", color: "text-blue-700" },
                  ].map((d) => (
                    <div key={d.label}>
                      <p className="text-[11px] font-medium text-gray-400 uppercase">{d.label}</p>
                      <p className={`text-lg font-bold ${d.color}`}>{d.value}</p>
                    </div>
                  ))}
                </div>
                <Link href="/crisis" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-red-600 hover:text-red-700 transition">
                  View Full Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ QUICK ACTIONS — 4 cards ═══ */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAction href="/crops/predict" icon={<Sprout className="w-6 h-6" />} label="Predict Profit" color="green" />
          <QuickAction href="/loans" icon={<Landmark className="w-6 h-6" />} label="Check Loans" color="blue" />
          <QuickAction href="/schemes" icon={<FileText className="w-6 h-6" />} label="Find Schemes" color="purple" />
          <QuickAction href="/chat" icon={<MessageCircle className="w-6 h-6" />} label="Ask AI" color="amber" />
        </motion.div>

        {/* ═══ MARKET + WEATHER — 8/4 grid ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Market Pulse — 8 cols */}
          <motion.div variants={fadeUp} className="lg:col-span-8 card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Market Pulse</h3>
                <p className="text-sm text-gray-400 mt-0.5">Crop prices — last 6 months</p>
              </div>
              <Link href="/market" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition">
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={marketPrices.wheat.chartData}>
                <defs>
                  <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} domain={["dataMin-50", "dataMax+50"]} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", background: "#fff", border: "1px solid #E2E8F0", fontSize: "13px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(v) => [`₹${v}`, "Wheat"]}
                />
                <Area type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={2.5} fill="url(#colorWheat)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-4">
              {Object.values(marketPrices).map((crop) => (
                <div key={crop.name} className="flex items-center gap-2 text-sm">
                  <span>{crop.emoji}</span>
                  <span className="text-gray-500 font-medium">{crop.name}</span>
                  <span className={`font-bold ${crop.weeklyChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {crop.weeklyChange >= 0 ? "+" : ""}{crop.weeklyChange}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weather — 4 cols */}
          <motion.div variants={fadeUp} className="lg:col-span-4 card p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Weather</h3>
            <div className="text-center mb-5">
              <span className="text-5xl">{weatherData.current.icon}</span>
              <p className="text-3xl font-bold text-gray-900 mt-2">{weatherData.current.temp}°C</p>
              <p className="text-sm text-gray-500 font-medium">{weatherData.current.condition}</p>
              <p className="text-xs text-gray-400">{weatherData.location}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: <Droplets className="w-4 h-4 text-blue-500" />, label: "Humidity", val: `${weatherData.current.humidity}%` },
                { icon: <Wind className="w-4 h-4 text-gray-400" />, label: "Wind", val: `${weatherData.current.windSpeed}km/h` },
                { icon: <Sun className="w-4 h-4 text-amber-500" />, label: "UV", val: String(weatherData.current.uv) },
              ].map((w) => (
                <div key={w.label} className="text-center p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-center">{w.icon}</div>
                  <p className="text-[10px] font-semibold text-gray-400 mt-1">{w.label}</p>
                  <p className="text-sm font-bold text-gray-800">{w.val}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {weatherData.forecast.slice(0, 5).map((d) => (
                <div key={d.day} className="flex-shrink-0 text-center p-2 rounded-xl bg-gray-50 min-w-[52px]">
                  <p className="text-[10px] font-semibold text-gray-400">{d.day}</p>
                  <p className="text-lg my-0.5">{d.icon}</p>
                  <p className="text-xs font-bold text-gray-800">{d.high}°</p>
                  <p className="text-[10px] text-gray-400">{d.low}°</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700 leading-relaxed">
                <Zap className="w-3 h-3 inline mr-1 text-blue-500" />{weatherData.advisory}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ═══ RECENT ACTIVITY ═══ */}
        <motion.div variants={fadeUp} className="card p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                <span className="text-xl flex-shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.text}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}

/* ── KPI Card Component ── */
function KPICard({ title, value, change, subtitle, icon, iconBg, iconColor }: {
  title: string; value: string; change?: number; subtitle?: string;
  icon: React.ReactNode; iconBg: string; iconColor: string;
}) {
  return (
    <div className="card p-5 group">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

/* ── Quick Action Component ── */
function QuickAction({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-50 text-green-600 group-hover:bg-green-100",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
  };
  return (
    <Link href={href} className="quick-action group">
      <div className={`quick-action-icon rounded-xl transition ${colors[color]}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition">{label}</span>
    </Link>
  );
}
