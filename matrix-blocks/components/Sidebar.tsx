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
    <aside className={`fixed md:sticky inset-y-0 md:inset-y-auto left-0 md:left-4 z-50 md:z-10 w-72 md:w-68 h-screen md:h-[calc(100vh-2rem)] flex flex-col justify-between p-6 rounded-none md:rounded-2xl glass-panel bg-white/60 backdrop-blur-xl border border-zinc-200/60 select-none transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      isOpen 
        ? "translate-x-0 shadow-[0_0_30px_rgba(147,51,234,0.08)] border-purple-500/30" 
        : "translate-x-[-100%] md:translate-x-0 shadow-[0_8px_32px_0_rgba(147,51,234,0.04)]"
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
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-widest text-zinc-900 uppercase group-hover:text-purple-600 transition-colors duration-300">
              Matrix Blocks
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">Decentralized AI</span>
          </div>
        </button>
        <div className="h-[1px] w-full bg-zinc-200/80 my-4" />
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
                ? "text-zinc-900 font-semibold animate-pulse"
                : "text-zinc-500 hover:text-zinc-900 font-medium"
            }`}
          >
            {/* Active background highlight */}
            {activeTab === "overview" && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/5 border-l-2 border-purple-600"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            {/* Hover background highlight */}
            <motion.div
              className="absolute inset-0 bg-zinc-100/80 opacity-0 group-hover:opacity-100 rounded-xl -z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />

            <LayoutDashboard
              className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                activeTab === "overview" ? "text-purple-600" : "text-zinc-400 group-hover:text-zinc-750"
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
                    ? "text-zinc-900 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 font-medium"
                }`}
              >
                {/* Active background highlight */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/5 border-l-2 border-purple-600"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover background highlight */}
                <motion.div
                  className="absolute inset-0 bg-zinc-100/80 opacity-0 group-hover:opacity-100 rounded-xl -z-10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />

                <Icon
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-purple-600" : "text-zinc-400 group-hover:text-zinc-750"
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
        <div className="h-[1px] w-full bg-zinc-200/80" />
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
              className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 overflow-hidden relative focus:outline-none hover:border-purple-500/30 transition-colors"
            >
              <User className="w-4 h-4 text-zinc-500" />
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
                className="text-xs font-semibold text-zinc-800 focus:outline-none hover:text-purple-600 transition-colors"
              >
                {isWeb3Connected && web3Address 
                  ? `${web3Address.slice(0, 6)}...${web3Address.slice(-4)}`
                  : "MatrixNode-892"}
              </button>
              <span className={`text-[10px] ${isWeb3Connected ? "text-emerald-600" : "text-zinc-500"} font-medium flex items-center gap-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isWeb3Connected ? "bg-emerald-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`} />
                {isWeb3Connected ? "Web3 Wallet" : "Active Node"}
              </span>
            </div>
          </div>
          <button 
            onClick={() => showToast("Subnet Settings Console is syncing with Matrix-Core...", "info")}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors focus:outline-none"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
