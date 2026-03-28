"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply saved theme to <html> on mount
    const saved = localStorage.getItem("krishiai-theme") ?? "light";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <div className="main-content-area">
        <TopBar />
        <main
          className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8"
          style={{ maxWidth: "1400px", width: "100%", margin: "0 auto" }}
        >
          {mounted ? children : (
            <div className="space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton h-32 w-full" />
              ))}
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
