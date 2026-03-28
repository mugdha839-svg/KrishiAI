"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Search, AlertTriangle, X, Moon, Sun } from "lucide-react";
import { crisisData, farmerProfile, notifications } from "@/lib/mockData";
import { getGreeting } from "@/lib/utils";

export default function TopBar() {
  const [crisisDismissed, setCrisisDismissed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  // Read theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("krishiai-theme") ?? "light";
    setIsDark(saved === "dark");
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Close notif panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const val = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", val);
    localStorage.setItem("krishiai-theme", val);
  };

  return (
    <header
      className="sticky top-0 z-30 topbar"
      style={{ minHeight: "var(--topbar-height)" }}
    >
      {/* Crisis Banner */}
      {!crisisDismissed && crisisData.active && (
        <div
          className="crisis-banner flex items-center justify-between px-4 sm:px-6 py-2 text-sm"
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span className="truncate font-semibold">
              ⚠️ Hormuz Crisis — Fertilizer prices up {crisisData.ureaSpikePct}%
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <Link href="/crisis" className="text-white/90 underline text-xs font-bold hover:text-white transition">
              Details
            </Link>
            <button
              onClick={() => setCrisisDismissed(true)}
              className="text-white/70 hover:text-white transition p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Greeting */}
        <div className="min-w-0">
          <h2
            className="text-base font-bold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {getGreeting()}, {farmerProfile.name} 👋
          </h2>
          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
            {farmerProfile.village}, {farmerProfile.district} · {farmerProfile.acres} acres
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          {/* Search */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer hover:opacity-80 transition"
            style={{
              background: "var(--bg-muted)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              width: "180px",
            }}
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">Search…</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-track"
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="theme-toggle-knob">
              {isDark ? "🌙" : "☀️"}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-xl transition-all"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green-500)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {unread}
                </span>
              )}
            </button>

            {showNotif && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <div
                  className="px-4 py-3 text-sm font-bold border-b"
                  style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                >
                  Notifications
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 cursor-pointer transition-all"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--bg-muted)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <p className="text-xs font-semibold" style={{ color: !n.read ? "var(--text-primary)" : "var(--text-muted)" }}>
                      {n.title}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
            style={{ background: "var(--green-500)" }}
          >
            {farmerProfile.avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
