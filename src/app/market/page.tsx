"use client";
import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { marketPrices, crisisData } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, MapPin, Bell, BellRing, ArrowRight, AlertTriangle, Zap, ChevronDown } from "lucide-react";

type CropKey = keyof typeof marketPrices;

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function MarketPage() {
  const [selectedCrop, setSelectedCrop] = useState<CropKey>("wheat");
  const [alertSet, setAlertSet] = useState(false);
  const crop = marketPrices[selectedCrop];

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Market Prices</h1>
            <p className="text-sm text-[var(--text-secondary)]">Live mandi prices with AI sell recommendations</p>
          </div>
          <div className="relative">
            <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value as CropKey)}
              className="appearance-none bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer">
              {Object.entries(marketPrices).map(([key, c]) => (
                <option key={key} value={key}>{c.emoji} {c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </motion.div>

        {/* Price Overview Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="gc p-5 border-l-4 border-emerald-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">Current Price</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] mt-1">₹{crop.currentPrice}</p>
            <p className="text-xs text-[var(--text-muted)]">{crop.unit}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${crop.weeklyChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {crop.weeklyChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {crop.weeklyChange >= 0 ? "+" : ""}{crop.weeklyChange}% this week
            </div>
          </div>
          <div className="gc p-5 border-l-4 border-blue-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">MSP (Govt Price)</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">₹{crop.msp}</p>
            <p className="text-xs text-[var(--text-muted)]">{crop.unit}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">Minimum Support Price 2025-26</p>
          </div>
          <div className="gc p-5 border-l-4 border-amber-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">Best Mandi Price</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">₹{Math.max(...crop.mandis.map(m => m.price))}</p>
            <p className="text-xs text-[var(--text-muted)]">{crop.unit}</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">
              +{(((Math.max(...crop.mandis.map(m => m.price)) - crop.msp) / crop.msp) * 100).toFixed(1)}% above MSP
            </p>
          </div>
        </motion.div>

        {/* Price Chart */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--text-primary)]">{crop.emoji} {crop.name} — Price Trend (6 Months)</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={crop.chartData}>
              <defs>
                <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} domain={["dataMin-100", "dataMax+100"]} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8f5e8", fontSize: "13px" }} formatter={(v) => [`₹${v}`, "Price"]} />
              <Area type="monotone" dataKey="price" stroke="#2ECC71" strokeWidth={3} fill="url(#colorMarket)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mandi Comparison Table */}
          <motion.div variants={item} className="gc p-5">
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Nearest Mandis</h3>
            <div className="space-y-2">
              {crop.mandis.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-muted)] transition cursor-pointer border border-transparent hover:border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-emerald-100 text-emerald-700" : "bg-[var(--bg-muted)] text-[var(--text-secondary)]"}`}>
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{m.name}</p>
                      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1"><MapPin className="w-3 h-3" />{m.distance}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--text-primary)]">₹{m.price}</p>
                    <p className={`text-xs font-semibold ${m.trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {m.trend >= 0 ? "+" : ""}{m.trend}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Recommendation + Price Alert */}
          <div className="space-y-5">
            <motion.div variants={item} className="gc p-5 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-800">AI Sell Recommendation</h3>
              </div>
              <p className="text-sm text-emerald-700 leading-relaxed">
                📊 Best time to sell <strong>{crop.name}</strong> is this weekend. {crop.mandis[crop.mandis.length - 1]?.name || "Top mandi"} offers the highest price at ₹{Math.max(...crop.mandis.map(m => m.price))}/quintal.
                Prices may dip next week due to expected rainfall and India&apos;s record 120.2 MT harvest increasing supply pressure.
              </p>
            </motion.div>

            {/* Global Context */}
            <motion.div variants={item} className="gc p-5 bg-red-50 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-800">Why Are Prices Moving?</h3>
              </div>
              <p className="text-sm text-red-700 leading-relaxed">
                Iran-Hormuz crisis is disrupting fertilizer supply chains. Input costs up {crisisData.ureaSpikePct}% for urea. 
                This increases production costs but hasn&apos;t yet reflected proportionally in crop prices. Farm-gate margins are being squeezed.
                Govt subsidy of ₹12,000 Cr under review. India&apos;s wheat export quota stabilizing global supply.
              </p>
            </motion.div>

            {/* Price Alert */}
            <motion.div variants={item} className="gc p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-3">Set Price Alert</h3>
              <div className="flex gap-3">
                <input type="number" placeholder={`₹ Target price (current: ${crop.currentPrice})`}
                  className="flex-1 p-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                <button onClick={() => setAlertSet(true)}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                    alertSet ? "bg-amber-100 text-amber-700" : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}>
                  {alertSet ? <><BellRing className="w-4 h-4" /> Alert Set</> : <><Bell className="w-4 h-4" /> Set Alert</>}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
