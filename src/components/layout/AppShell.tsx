"use client";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F0F7F0]">
      <Sidebar />
      <div className="md:ml-[260px]">
        <TopBar />
        <main className="page-container animate-fade-in">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
