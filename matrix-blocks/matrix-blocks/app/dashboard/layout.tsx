"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { TabProvider } from "@/components/TabContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TabProvider>
      <div className="flex min-h-screen bg-[#030007] text-zinc-100 p-2 md:p-4 gap-0 md:gap-6">
        {/* Sidebar on the left */}
        <Sidebar />
        
        {/* Main content on the right */}
        <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-2rem)] overflow-y-auto pr-0 md:pr-2">
          {children}
        </main>
      </div>
    </TabProvider>
  );
}
