"use client";
import AppShell from "@/components/layout/AppShell";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { healthScore, farmerProfile } from "@/lib/mockData";
import { HeartPulse, TrendingUp, Download, Zap, ArrowRight, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function getScoreGrade(score: number) {
  if (score >= 800) return { grade: "Excellent", color: "#2ECC71", bg: "bg-emerald-50" };
  if (score >= 700) return { grade: "Good", color: "#27AE60", bg: "bg-green-50" };
  if (score >= 600) return { grade: "Fair", color: "#F39C12", bg: "bg-amber-50" };
  return { grade: "Needs Improvement", color: "#E74C3C", bg: "bg-red-50" };
}

const linkMap: Record<string, string> = {
  "Crop Yield History": "/crops/predict",
  "Loan Repayment": "/loans",
  "Expense Management": "/expenses",
  "Scheme Utilization": "/schemes",
  "Market Timing": "/market",
};

export default function HealthScorePage() {
  const { overall, max, breakdown, tips, history } = healthScore;
  const { grade, color, bg } = getScoreGrade(overall);
  const scorePct = (overall / max) * 100;

  const gaugeData = [{ value: scorePct, fill: color }];

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-gray-900">Farm Health Score</h1>
          <p className="text-sm text-gray-500">Your comprehensive agricultural credit score</p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div variants={item} className="gc p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-48 h-48 flex-shrink-0">
              <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e8f5e8" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(scorePct / 100) * 440} 440`}
                  className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold" style={{ color }}>{overall}</p>
                <p className="text-xs text-gray-400">out of {max}</p>
                <p className="text-sm font-bold mt-1" style={{ color }}>{grade}</p>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{farmerProfile.name}&apos;s Farm Score</h2>
              <p className="text-sm text-gray-500 mt-1">{farmerProfile.district}, {farmerProfile.state} • {farmerProfile.acres} acres</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${bg}`} style={{ color }}>{grade}</span>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +4 pts this quarter
                </span>
              </div>
              <button className="mt-4 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto sm:mx-0">
                <Download className="w-4 h-4" /> Download Report (PDF)
              </button>
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div variants={item} className="gc p-5">
          <h3 className="font-bold text-gray-900 mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {breakdown.map((b) => {
              const link = linkMap[b.category] || "/dashboard";
              const barColor = b.score >= 80 ? "#2ECC71" : b.score >= 65 ? "#F39C12" : "#E74C3C";
              return (
                <Link key={b.category} href={link} className="block">
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition group">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700 transition">{b.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: barColor }}>{b.score}/{b.max}</span>
                          <span className="text-[10px] text-gray-400">({b.weight}% weight)</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${b.score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full" style={{ background: barColor }} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Score History */}
          <motion.div variants={item} className="gc p-5">
            <h3 className="font-bold text-gray-900 mb-4">Score Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history}>
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis domain={[650, 800]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8f5e8", fontSize: "13px" }} />
                <Line type="monotone" dataKey="score" stroke="#2ECC71" strokeWidth={3} dot={{ fill: "#2ECC71", r: 4 }} name="Health Score" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Improvement Tips */}
          <motion.div variants={item} className="gc p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900">AI Improvement Tips</h3>
            </div>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <Star className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppShell>
  );
}
