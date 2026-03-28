"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <aside className="hidden lg:flex flex-col w-[260px] h-screen fixed left-0 top-0 z-40 py-6 px-4 border-r border-gray-200 bg-white">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-gray-900 font-bold text-lg tracking-tight">KrishiAI</h1>
          <p className="text-gray-400 text-[10px] font-semibold tracking-[0.12em] uppercase">Smart Farm Finance</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}>
              <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-green-600" : "text-gray-400"}`} />
              <span>{item.label}</span>
              {item.href === "/crisis" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 pulse-dot" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro Card */}
      <div className="mx-1 p-4 rounded-xl bg-green-50 border border-green-100">
        <p className="text-green-700 text-[13px] font-semibold">KrishiAI Pro</p>
        <p className="text-green-600/60 text-[11px] mt-1 leading-relaxed">AI insights for smarter farming</p>
      </div>
    </aside>
  );
}
