"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Sprout, TrendingUp, Landmark, FileText,
  Wallet, MessageCircle, HeartPulse, AlertTriangle, Settings, Leaf
} from "lucide-react";

const navItems = [
  { href: "/dashboard",      label: "Dashboard",      icon: LayoutDashboard },
  { href: "/crops/predict",  label: "Crop Prediction", icon: Sprout },
  { href: "/market",         label: "Market Prices",  icon: TrendingUp },
  { href: "/loans",          label: "Loans",          icon: Landmark },
  { href: "/schemes",        label: "Govt Schemes",   icon: FileText },
  { href: "/expenses",       label: "Expenses",       icon: Wallet },
  { href: "/chat",           label: "AI Chat",        icon: MessageCircle },
  { href: "/health-score",   label: "Health Score",   icon: HeartPulse },
  { href: "/crisis",         label: "Crisis Hub",     icon: AlertTriangle },
  { href: "/settings",       label: "Settings",       icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 py-5 px-3"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        transition: "background 150ms ease, border-color 150ms ease",
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
          style={{ background: "var(--green-500)" }}
        >
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight" style={{ color: "var(--text-primary)" }}>
            KrishiAI
          </h1>
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            Farm Finance
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 group relative"
              style={{
                background: isActive ? "var(--green-50)" : "transparent",
                color: isActive ? "var(--green-600)" : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "var(--bg-muted)";
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <item.icon
                className="flex-shrink-0"
                style={{
                  width: 16, height: 16,
                  color: isActive ? "var(--green-600)" : "var(--text-muted)",
                }}
              />
              <span>{item.label}</span>
              {item.href === "/crisis" && (
                <span
                  className="ml-auto w-2 h-2 rounded-full pulse-dot"
                  style={{ background: "#EF4444" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div
        className="mt-4 mx-1 p-4 rounded-xl"
        style={{
          background: "var(--green-50)",
          border: "1px solid var(--green-100)",
        }}
      >
        <p className="text-[13px] font-semibold" style={{ color: "var(--green-600)" }}>
          KrishiAI Pro
        </p>
        <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "var(--text-secondary)" }}>
          AI insights for smarter farming
        </p>
      </div>
    </aside>
  );
}
