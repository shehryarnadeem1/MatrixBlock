"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { TabProvider, useTab } from "@/components/TabContext";
import { Menu } from "lucide-react";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useTab();
  
  return (
    <div className="flex min-h-screen bg-[#030007] text-zinc-100 p-2 md:p-4 gap-0 md:gap-6 relative">
      {/* Sidebar on the left */}
      <Sidebar />
      
      {/* Main content on the right */}
      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-2rem)] overflow-y-auto pr-0 md:pr-2 pt-16 md:pt-0">
        {/* Mobile Floating Header with Hamburger */}
        <header className="flex md:hidden items-center justify-between px-5 py-3.5 bg-zinc-950/70 border border-white/5 backdrop-blur-md rounded-2xl fixed top-4 left-4 right-4 z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md">
              <span className="text-white font-extrabold text-sm">M</span>
            </div>
            <span className="font-bold text-xs tracking-wider text-white uppercase">Matrix Blocks</span>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 focus:outline-none"
          >
            <Menu className="w-5 h-5 text-zinc-200" />
          </button>
        </header>

        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TabProvider>
      <DashboardInner>{children}</DashboardInner>
    </TabProvider>
  );
}
