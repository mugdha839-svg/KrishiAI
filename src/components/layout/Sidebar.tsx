"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Sprout, TrendingUp, Landmark, FileText,
  Wallet, MessageCircle, HeartPulse, AlertTriangle, Settings, Leaf
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crops/predict", label: "Crop Prediction", icon: Sprout },
  { href: "/market", label: "Market Prices", icon: TrendingUp },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/schemes", label: "Govt Schemes", icon: FileText },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/chat", label: "AI Chat", icon: MessageCircle },
  { href: "/health-score", label: "Health Score", icon: HeartPulse },
  { href: "/crisis", label: "Crisis Hub", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="glass-sidebar hidden md:flex flex-col w-[260px] min-h-screen fixed left-0 top-0 z-40 py-6 px-4">
      <Link href="/dashboard" className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight">KrishiAI</h1>
          <p className="text-emerald-400/60 text-[10px] font-medium tracking-widest uppercase">Smart Farm Finance</p>
        </div>
      </Link>
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-white/50 hover:text-white/90 hover:bg-white/5"
              }`}>
              {isActive && (
                <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-emerald-400 rounded-r-full" />
              )}
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
              {item.href === "/crisis" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 mx-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-emerald-400 text-xs font-semibold">KrishiAI Pro</p>
        <p className="text-white/40 text-[11px] mt-1">AI-powered insights for smarter farming decisions</p>
      </div>
    </aside>
  );
}
