"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030007] text-zinc-100 items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-4xl w-full flex flex-col items-center text-center gap-12 z-10">
        
        {/* Glow Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
            Next-Gen Neural Compute Engine
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Decentralizing the <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Compute Layer
            </span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Matrix Blocks is a hyper-scalable, zero-trust network for decentralized AI training and secure cryptographic inference workloads.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/dashboard" className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wider">
              Enter Operations Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8"
        >
          {[
            { title: "Zero Trust Protocol", icon: Shield, desc: "End-to-end encrypted model deployments utilizing hardware-level enclave computing." },
            { title: "Elastic Compute Mesh", icon: Cpu, desc: "On-demand routing to optimal edge GPU cluster nodes based on geographical latency." },
            { title: "MTX Token Utilities", icon: Zap, desc: "Gas fee distribution, proof-of-inference staking, and secure peer-to-peer compute settlement." }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-3 border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-[240px]">{item.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-[10px] text-zinc-600 font-medium">
        © 2026 MATRIX BLOCKS CORE INC. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
