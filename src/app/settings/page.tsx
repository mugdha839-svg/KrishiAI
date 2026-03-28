"use client";
import AppShell from "@/components/layout/AppShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { supportedLanguages, farmerProfile } from "@/lib/mockData";
import { Globe, Bell, BellOff, Wifi, WifiOff, Shield, LogOut, ChevronRight, User, Smartphone, Moon, Sun, Eye, Lock } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function Toggle({ enabled, onToggle, label, desc, icon }: { enabled: boolean; onToggle: () => void; label: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-muted)] transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
          <p className="text-xs text-[var(--text-muted)]">{desc}</p>
        </div>
      </div>
      <button onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-emerald-500" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-[var(--bg-card)] shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    schemeDeadlines: true,
    aiAdvisories: true,
    crisisAlerts: true,
    weather: false,
  });
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-2xl mx-auto">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
          <p className="text-sm text-[var(--text-secondary)]">Customize your KrishiAI experience</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500 hover:bg-green-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-200">
              {farmerProfile.avatar}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-[var(--text-primary)]">{farmerProfile.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">{farmerProfile.phone}</p>
              <p className="text-xs text-[var(--text-muted)]">{farmerProfile.district}, {farmerProfile.state} • {farmerProfile.acres} acres</p>
            </div>
            <button className="p-2 rounded-xl hover:bg-[var(--bg-muted)] transition">
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
          </div>
        </motion.div>

        {/* Language Selection */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-[var(--text-primary)]">Language</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {supportedLanguages.map((l) => (
              <button key={l.code} onClick={() => setLanguage(l.code)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  language === l.code
                    ? "bg-emerald-50 border-emerald-400 ring-1 ring-emerald-200"
                    : "bg-[var(--bg-card)] border-[var(--border)] hover:border-green-200"
                }`}>
                <p className={`text-sm font-medium ${language === l.code ? "text-emerald-700" : "text-[var(--text-primary)]"}`}>{l.native}</p>
                <p className="text-xs text-[var(--text-muted)]">{l.name}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item} className="gc overflow-hidden">
          <div className="flex items-center gap-2 p-5 pb-3">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-[var(--text-primary)]">Notifications</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <Toggle enabled={notifications.priceAlerts}
              onToggle={() => setNotifications({ ...notifications, priceAlerts: !notifications.priceAlerts })}
              label="Price Alerts" desc="Get notified when crop prices hit targets" icon={<Bell className="w-4 h-4" />} />
            <Toggle enabled={notifications.schemeDeadlines}
              onToggle={() => setNotifications({ ...notifications, schemeDeadlines: !notifications.schemeDeadlines })}
              label="Scheme Deadlines" desc="Reminders before govt scheme deadlines" icon={<Bell className="w-4 h-4" />} />
            <Toggle enabled={notifications.aiAdvisories}
              onToggle={() => setNotifications({ ...notifications, aiAdvisories: !notifications.aiAdvisories })}
              label="AI Advisories" desc="Daily AI-generated farming tips" icon={<Bell className="w-4 h-4" />} />
            <Toggle enabled={notifications.crisisAlerts}
              onToggle={() => setNotifications({ ...notifications, crisisAlerts: !notifications.crisisAlerts })}
              label="Crisis Alerts" desc="Emergency alerts for market disruptions" icon={<Bell className="w-4 h-4" />} />
            <Toggle enabled={notifications.weather}
              onToggle={() => setNotifications({ ...notifications, weather: !notifications.weather })}
              label="Weather Alerts" desc="Rainfall and temperature warnings" icon={<Bell className="w-4 h-4" />} />
          </div>
        </motion.div>

        {/* App Settings */}
        <motion.div variants={item} className="gc overflow-hidden">
          <div className="flex items-center gap-2 p-5 pb-3">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-[var(--text-primary)]">App Settings</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <Toggle enabled={offlineMode} onToggle={() => setOfflineMode(!offlineMode)}
              label="Offline Mode" desc="Cache last 7 days of data for offline use"
              icon={offlineMode ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />} />
            <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)}
              label="Dark Mode" desc="Switch to dark theme"
              icon={darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} />
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-[var(--text-primary)]">Privacy & Security</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-muted)] transition">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Linked Aadhaar</span>
              </div>
              <span className="text-sm text-[var(--text-muted)]">XXXX-XXXX-{farmerProfile.aadhaar_last4}</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-muted)] transition">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Data Privacy Controls</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div variants={item}>
          <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>

        <div className="text-center pb-8">
          <p className="text-xs text-[var(--text-muted)]">KrishiAI v1.0.0 • Made with ❤️ for Indian Farmers</p>
          <p className="text-xs text-gray-300 mt-1">Team CodeSmith • Hackathon 2026</p>
        </div>
      </motion.div>
    </AppShell>
  );
}
