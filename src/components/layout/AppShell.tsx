"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import { getCurrentUser } from "@/lib/userAuth";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("krishiai-theme") ?? "light";
    document.documentElement.setAttribute("data-theme", saved);

    // Guard: redirect to auth if not logged in
    const user = getCurrentUser();
    if (!user) {
      router.replace("/auth");
      return;
    }
    setMounted(true);
  }, [router, pathname]);

  if (!mounted) {
    return (
      <div style={{ background: "var(--bg-base)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--green-500)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20 }}>🌿</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading KrishiAI…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Sidebar />
      <div className="main-content-area">
        <TopBar />
        {/* page-content class gives EQUAL 24px padding on ALL sides + 24px gap between rows */}
        <main className="page-content pb-28 lg:pb-6" style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
