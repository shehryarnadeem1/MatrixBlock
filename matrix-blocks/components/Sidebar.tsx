"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Cpu, 
  Wallet, 
  Terminal, 
  LayoutDashboard, 
  Settings, 
  User,
  MessageSquare
} from "lucide-react";
import { useTab, Tab } from "./TabContext";

interface NavItem {
  name: string;
  tab: Tab;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Marketplace", tab: "marketplace", icon: ShoppingBag },
  { name: "My Models", tab: "models", icon: Cpu },
  { name: "Wallet Settings", tab: "wallet", icon: Wallet },
  { name: "AI Chatbot", tab: "chatbot", icon: MessageSquare },
  { name: "Developer API", tab: "developer", icon: Terminal },
];

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    showToast, 
    web3Address, 
    isWeb3Connected, 
    connectWeb3,
    isMobileMenuOpen: isOpen,
    setIsMobileMenuOpen: setIsOpen
  } = useTab();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 animate-fade-in"
        />
      )}
      
      <aside className={`fixed md:sticky inset-y-4 md:inset-y-auto left-4 md:left-4 z-50 md:z-10 w-68 h-[calc(100vh-2rem)] flex flex-col justify-between p-6 rounded-2xl glass-panel bg-[#030007]/90 md:bg-white/5 backdrop-blur-xl md:backdrop-blur-md border border-white/10 select-none shadow-2xl transform transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"
      }`}>
        
        {/* Brand Logo */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => {
              setActiveTab("overview");
              setIsOpen(false);
            }} 
            className="flex items-center gap-3 group w-full text-left focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
              <span className="text-white font-extrabold text-lg tracking-wider">M</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-widest text-white uppercase group-hover:text-cyan-400 transition-colors duration-300">
                Matrix Blocks
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Decentralized AI</span>
            </div>
          </button>
          <div className="h-[1px] w-full bg-white/10 my-4" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-2 py-4">
          
          {/* Dashboard Home Link */}
          <button 
            onClick={() => {
              setActiveTab("overview");
              setIsOpen(false);
            }} 
            className="relative group w-full text-left focus:outline-none"
          >
            <div
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                activeTab === "overview"
                  ? "text-white font-semibold"
                  : "text-zinc-400 hover:text-zinc-100 font-medium"
              }`}
            >
              {/* Active background highlight */}
              {activeTab === "overview" && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/10 border-l-2 border-cyan-400"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover background highlight */}
              <motion.div
                className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl -z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />

              <LayoutDashboard
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  activeTab === "overview" ? "text-cyan-400" : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              />
              <span className="text-sm">Dashboard Overview</span>
            </div>
          </button>

          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            const Icon = item.icon;

            return (
              <button 
                key={item.name} 
                onClick={() => {
                  setActiveTab(item.tab);
                  setIsOpen(false);
                }} 
                className="relative group w-full text-left focus:outline-none"
              >
                <div
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 font-medium"
                  }`}
                >
                  {/* Active background highlight */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/10 border-l-2 border-cyan-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover background highlight */}
                  <motion.div
                    className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl -z-10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />

                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? "text-cyan-400" : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="flex flex-col gap-4">
          <div className="h-[1px] w-full bg-white/10" />
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (isWeb3Connected && web3Address) {
                    showToast(`Connected Web3 Wallet: ${web3Address}`, "success");
                  } else {
                    connectWeb3();
                  }
                }}
                className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 overflow-hidden relative focus:outline-none hover:border-cyan-500/30 transition-colors"
              >
                <User className="w-4 h-4 text-zinc-400" />
              </button>
              <div className="flex flex-col text-left">
                <button 
                  onClick={() => {
                    if (isWeb3Connected && web3Address) {
                      showToast(`Connected Web3 Wallet: ${web3Address}`, "success");
                    } else {
                      connectWeb3();
                    }
                  }}
                  className="text-xs font-semibold text-zinc-200 focus:outline-none hover:text-cyan-400 transition-colors"
                >
                  {isWeb3Connected && web3Address 
                    ? `${web3Address.slice(0, 6)}...${web3Address.slice(-4)}`
                    : "MatrixNode-892"}
                </button>
                <span className={`text-[10px] ${isWeb3Connected ? "text-emerald-400" : "text-zinc-500"} font-medium flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isWeb3Connected ? "bg-emerald-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
                  {isWeb3Connected ? "Web3 Wallet" : "Active Node"}
                </span>
              </div>
            </div>
            <button 
              onClick={() => showToast("Subnet Settings Console is syncing with Matrix-Core...", "info")}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
