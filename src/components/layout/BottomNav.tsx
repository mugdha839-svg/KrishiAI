"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, MessageCircle, Wallet, AlertTriangle } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home",     icon: LayoutDashboard },
  { href: "/market",    label: "Market",   icon: TrendingUp },
  { href: "/chat",      label: "AI Chat",  icon: MessageCircle },
  { href: "/expenses",  label: "Expenses", icon: Wallet },
  { href: "/crisis",    label: "Crisis",   icon: AlertTriangle },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-150 relative"
          >
            <item.icon
              className="w-5 h-5"
              style={{ color: active ? "var(--green-600)" : "var(--text-muted)" }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: active ? "var(--green-600)" : "var(--text-muted)" }}
            >
              {item.label}
            </span>
            {item.href === "/crisis" && (
              <span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-red-500 rounded-full pulse-dot" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
