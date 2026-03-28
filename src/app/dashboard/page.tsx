"use client";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { kpiData, crisisData, marketPrices, weatherData, recentActivities } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Sprout, Landmark, FileText, MessageCircle, Droplets, Wind, Sun, AlertTriangle, ArrowRight, Zap } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* KPI Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Net Profit Forecast" value={formatCurrency(kpiData.netProfitForecast)} change={kpiData.netProfitChange} icon="📊" color="emerald" />
          <KPICard title="Land Coverage" value={`${kpiData.landCoverage} Acres`} subtitle={`${kpiData.landUtilization}% utilized`} icon="🌾" color="blue" />
          <KPICard title="Active Loans" value={String(kpiData.activeLoans)} subtitle={formatCurrency(kpiData.totalLoanAmount)} icon="🏦" color="amber" />
          <KPICard title="Scheme Benefits" value={formatCurrency(kpiData.schemeBenefits)} subtitle={`${kpiData.schemesApplied} schemes active`} icon="🏛️" color="purple" />
        </motion.div>

        {/* Crisis Intelligence Widget */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-5 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider">Crisis Intelligence</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Strait of Hormuz Fertilizer Crisis</h3>
            <p className="text-white/80 text-sm mb-3">Urea +{crisisData.ureaSpikePct}% | DAP +{crisisData.dapSpikePct}% | MOP +{crisisData.mopSpikePct}% — {crisisData.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2">
                <p className="text-xs text-white/70">Urea Price</p>
                <p className="text-lg font-bold">₹{crisisData.currentUreaPrice}<span className="text-xs text-red-200 ml-1">↑{crisisData.ureaSpikePct}%</span></p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2">
                <p className="text-xs text-white/70">DAP Price</p>
                <p className="text-lg font-bold">₹{crisisData.currentDAPPrice}<span className="text-xs text-red-200 ml-1">↑{crisisData.dapSpikePct}%</span></p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2">
                <p className="text-xs text-white/70">Govt Status</p>
                <p className="text-sm font-semibold">₹12,000 Cr Subsidy Bill</p>
              </div>
            </div>
            <Link href="/crisis" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-white/90 hover:text-white transition">
              View Full Crisis Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction href="/crops/predict" icon={<Sprout className="w-6 h-6" />} label="Predict Profit" color="bg-emerald-50 text-emerald-600" />
          <QuickAction href="/loans" icon={<Landmark className="w-6 h-6" />} label="Check Loans" color="bg-blue-50 text-blue-600" />
          <QuickAction href="/schemes" icon={<FileText className="w-6 h-6" />} label="Find Schemes" color="bg-purple-50 text-purple-600" />
          <QuickAction href="/chat" icon={<MessageCircle className="w-6 h-6" />} label="Ask AI" color="bg-amber-50 text-amber-600" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Market Pulse Chart */}
          <motion.div variants={item} className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Market Pulse</h3>
                <p className="text-xs text-gray-500">Your crop prices — last 6 months</p>
              </div>
              <Link href="/market" className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={marketPrices.wheat.chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} domain={["dataMin-50", "dataMax+50"]} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8f5e8", fontSize: "13px" }} />
                <Area type="monotone" dataKey="price" stroke="#2ECC71" strokeWidth={3} fill="url(#colorPrice)" name="Wheat ₹/qtl" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              {Object.values(marketPrices).map((crop) => (
                <div key={crop.name} className="flex items-center gap-2 text-sm">
                  <span>{crop.emoji}</span>
                  <span className="font-medium text-gray-700">{crop.name}</span>
                  <span className="text-xs font-semibold" style={{ color: crop.weeklyChange >= 0 ? "#27AE60" : "#E74C3C" }}>
                    {crop.weeklyChange >= 0 ? "+" : ""}{crop.weeklyChange}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weather Widget */}
          <motion.div variants={item} className="glass-card p-5">
            <h3 className="font-bold text-gray-900 mb-3">Weather</h3>
            <div className="text-center mb-4">
              <span className="text-5xl">{weatherData.current.icon}</span>
              <p className="text-3xl font-bold text-gray-900 mt-1">{weatherData.current.temp}°C</p>
              <p className="text-sm text-gray-500">{weatherData.current.condition}</p>
              <p className="text-xs text-gray-400">{weatherData.location}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-blue-50 rounded-xl">
                <Droplets className="w-4 h-4 text-blue-500 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Humidity</p>
                <p className="text-sm font-bold text-gray-700">{weatherData.current.humidity}%</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-xl">
                <Wind className="w-4 h-4 text-gray-500 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Wind</p>
                <p className="text-sm font-bold text-gray-700">{weatherData.current.windSpeed}km/h</p>
              </div>
              <div className="text-center p-2 bg-amber-50 rounded-xl">
                <Sun className="w-4 h-4 text-amber-500 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">UV</p>
                <p className="text-sm font-bold text-gray-700">{weatherData.current.uv}</p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {weatherData.forecast.slice(0, 5).map((d) => (
                <div key={d.day} className="flex-shrink-0 text-center p-2 rounded-xl bg-gray-50 min-w-[56px]">
                  <p className="text-[10px] text-gray-500 font-medium">{d.day}</p>
                  <p className="text-lg my-0.5">{d.icon}</p>
                  <p className="text-xs font-bold text-gray-700">{d.high}°</p>
                  <p className="text-[10px] text-gray-400">{d.low}°</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-700"><Zap className="w-3 h-3 inline mr-1" />{weatherData.advisory}</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="font-bold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.text}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}

function KPICard({ title, value, change, subtitle, icon, color }: { title: string; value: string; change?: number; subtitle?: string; icon: string; color: string }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change >= 0 ? "+" : ""}{change}% vs last season
            </div>
          )}
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <span className="text-3xl opacity-80 group-hover:scale-110 transition-transform">{icon}</span>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <Link href={href} className="quick-action group">
      <div className={`quick-action-icon ${color} rounded-xl group-hover:scale-110 transition-transform`}>{icon}</div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </Link>
  );
}
