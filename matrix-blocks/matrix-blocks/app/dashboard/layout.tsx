"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { TabProvider, useTab } from "@/components/TabContext";
import { Menu } from "lucide-react";

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useTab();
  
  return (
    <div className="flex min-h-screen bg-slate-50 text-zinc-900 p-2 md:p-4 gap-0 md:gap-6 relative">
      {/* Mobile Backdrop Overlay Wrapper */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar on the left */}
      <Sidebar />
      
      {/* Main content on the right */}
      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-2rem)] overflow-y-auto pr-0 md:pr-2 pt-24 md:pt-0">
        {/* Mobile Floating Header with Hamburger */}
        <header className="flex md:hidden items-center justify-between px-5 py-3.5 bg-white/70 backdrop-blur-2xl border border-zinc-200/50 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-2xl m-4 fixed top-0 left-0 right-0 z-30">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md">
              <span className="text-white font-extrabold text-sm">M</span>
            </div>
            <span className="font-bold text-xs tracking-wider text-zinc-900 uppercase">Matrix Blocks</span>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 hover:bg-zinc-200/80 transition-all active:scale-95 focus:outline-none"
          >
            <Menu className="w-5 h-5 text-zinc-800" />
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
