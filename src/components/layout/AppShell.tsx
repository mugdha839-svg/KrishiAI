"use client";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="main-content-area">
        <TopBar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
