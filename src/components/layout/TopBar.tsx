"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, Globe, AlertTriangle, X, ChevronDown } from "lucide-react";
import { crisisData, farmerProfile, notifications, supportedLanguages } from "@/lib/mockData";
import { getGreeting } from "@/lib/utils";

export default function TopBar() {
  const [showCrisis, setShowCrisis] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-emerald-100">
      {showCrisis && crisisData.active && (
        <div className="crisis-banner flex items-center justify-between text-sm animate-crisis">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">{crisisData.title}</span>
            <span className="sm:hidden">⚠️ Fertilizer Crisis — Urea +{crisisData.ureaSpikePct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/crisis" className="text-white/90 underline text-xs font-medium">View Details</Link>
            <button onClick={() => setShowCrisis(false)} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{getGreeting()}, {farmerProfile.name} 👋</h2>
          <p className="text-xs text-gray-500">{farmerProfile.village}, {farmerProfile.district}, {farmerProfile.state} • {farmerProfile.acres} acres</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => { setShowLang(!showLang); setShowNotif(false); }} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition">
              <Globe className="w-3.5 h-3.5" /><span className="hidden sm:inline">EN</span><ChevronDown className="w-3 h-3" />
            </button>
            {showLang && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto">
                {supportedLanguages.map((l) => (
                  <button key={l.code} onClick={() => setShowLang(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition flex justify-between">
                    <span>{l.name}</span><span className="text-gray-400">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => { setShowNotif(!showNotif); setShowLang(false); }} className="relative p-2 rounded-xl hover:bg-gray-100 transition">
              <Bell className="w-5 h-5 text-gray-600" />
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <p className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100">Notifications</p>
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition cursor-pointer ${!n.read ? "bg-emerald-50/50" : ""}`}>
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">{farmerProfile.avatar}</div>
        </div>
      </div>
    </header>
  );
}
