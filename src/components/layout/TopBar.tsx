"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, AlertTriangle, X, Moon, Sun } from "lucide-react";
import { crisisData, farmerProfile, notifications } from "@/lib/mockData";
import { getGreeting } from "@/lib/utils";

export default function TopBar() {
  const [showCrisis, setShowCrisis] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("krishiai-theme");
      if (saved === "dark") {
        document.body.classList.add("dark-mode");
        setIsDark(true);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.body.classList.toggle("dark-mode", next);
    localStorage.setItem("krishiai-theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-sm border-b border-gray-200">
      {/* Crisis Banner */}
      {showCrisis && crisisData.active && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-red-500 text-white text-[13px] font-medium">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Hormuz Crisis — Fertilizer Price Surge</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/crisis" className="text-white/90 underline text-[12px] font-semibold">Details</Link>
            <button onClick={() => setShowCrisis(false)} className="text-white/70 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Left — Greeting */}
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {getGreeting()}, {farmerProfile.name} 👋
          </h2>
          <p className="text-[13px] text-gray-400">
            {farmerProfile.village}, {farmerProfile.district} • {farmerProfile.acres} acres
          </p>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm w-52">
            <Search className="w-4 h-4" />
            <span>Search...</span>
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition" aria-label="Toggle theme">
            {isDark ? <Sun className="w-4.5 h-4.5 text-gray-500" /> : <Moon className="w-4.5 h-4.5 text-gray-500" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
              <Bell className="w-4.5 h-4.5 text-gray-500" />
              {unread > 0 && <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl border border-gray-200 bg-white py-2 z-50">
                <p className="px-4 py-2 text-sm font-bold text-gray-900 border-b border-gray-100">Notifications</p>
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer">
                    <p className={`text-[13px] font-medium ${!n.read ? "text-gray-900" : "text-gray-500"}`}>{n.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
            {farmerProfile.avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
