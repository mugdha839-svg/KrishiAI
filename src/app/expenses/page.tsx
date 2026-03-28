"use client";
import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { expenseCategories, monthlyExpenses, expenses as defaultExpenses } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/userAuth";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Download, Filter, Wallet, TrendingUp, AlertTriangle, Zap, Calendar, X } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const COLORS = ["#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#F39C12", "#1ABC9C"];
const categoryFilters = ["All", ...expenseCategories.map((c) => c.name)];

export default function ExpensesPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const user = getCurrentUser();
  const userExpenses = user?.expenses || defaultExpenses;

  const totalExpenses = expenseCategories.reduce((sum, c) => sum + c.total, 0);
  const filtered = userExpenses.filter((e) => {
    const matchFilter = filter === "All" || e.category === filter;
    const matchSearch = e.notes.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Farm Expenses</h1>
            <p className="text-sm text-[var(--text-secondary)]">Track, analyze, and optimize your farm spending</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="gc p-5 border-l-4 border-emerald-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">Total This Season</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Rabi 2025-26</p>
          </div>
          <div className="gc p-5 border-l-4 border-red-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">Highest Category</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(expenseCategories[0].total)}</p>
            <p className="text-xs text-red-500 mt-1">{expenseCategories[0].icon} {expenseCategories[0].name} (+{((expenseCategories[0].total / totalExpenses) * 100).toFixed(0)}%)</p>
          </div>
          <div className="gc p-5 border-l-4 border-amber-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">This Month</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{formatCurrency(monthlyExpenses[monthlyExpenses.length - 1].total)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 font-semibold">
              <TrendingUp className="w-3 h-3" /> +39% vs last month
            </div>
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div variants={item} className="gc p-5 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-800">AI Expense Insight</h3>
          </div>
          <p className="text-sm text-amber-700 leading-relaxed">
            ⚠️ Your fertilizer spend is <strong>34% above</strong> last season — primarily due to the global price surge from the Strait of Hormuz crisis.
            Apply for the <strong>Emergency Fertilizer Relief Package</strong> (₹5,000/acre) to offset ₹{(5000 * 12).toLocaleString("en-IN")} across your 12 acres.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly Bar Chart */}
          <motion.div variants={item} className="gc p-5">
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyExpenses}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8f5e8", fontSize: "13px" }} formatter={(v) => formatCurrency(v as number)} />
                <Bar dataKey="total" fill="#2ECC71" radius={[6, 6, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Donut */}
          <motion.div variants={item} className="gc p-5">
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={expenseCategories} dataKey="total" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {expenseCategories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {expenseCategories.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span>{c.icon}</span>
                  <span className="text-[var(--text-secondary)]">{c.name}</span>
                  <span className="ml-auto font-bold text-[var(--text-primary)]">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Expense List */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categoryFilters.map((c) => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filter === c ? "bg-emerald-500 text-white" : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-gray-200"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filtered.map((e) => {
              const cat = expenseCategories.find((c) => c.name === e.category);
              return (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-muted)] transition">
                  <span className="text-2xl">{cat?.icon || "💰"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{e.notes}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: (cat?.color || "#666") + "15", color: cat?.color }}>{e.category}</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(e.amount)}</p>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--border)]">
            <button className="flex-1 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button className="flex-1 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </motion.div>

        {/* Add Expense Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--bg-card)] rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Add Expense</h3>
                <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)]"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
              </div>
              <div className="space-y-3">
                <select className="w-full p-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-300">
                  <option value="">Select Category</option>
                  {expenseCategories.map((c) => (<option key={c.name} value={c.name}>{c.icon} {c.name}</option>))}
                </select>
                <input type="number" placeholder="Amount (₹)" className="w-full p-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                <input type="date" className="w-full p-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                <textarea placeholder="Notes (optional)" rows={2} className="w-full p-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
                <button onClick={() => setShowAdd(false)}
                  className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold hover:shadow-lg transition-all">
                  Save Expense
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AppShell>
  );
}
