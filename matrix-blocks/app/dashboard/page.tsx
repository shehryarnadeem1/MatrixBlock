"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Wallet, 
  Terminal, 
  ShoppingBag, 
  Activity, 
  Zap, 
  Globe, 
  Server,
  Lock,
  Unlock,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  X,
  ArrowRight,
  HardDrive,
  Key,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  ShieldCheck,
  Code,
  MessageSquare,
  Send,
  Loader2,
  Mail,
  LockKeyhole
} from "lucide-react";
import { useTab } from "@/components/TabContext";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
};

interface AIModel {
  id: number;
  name: string;
  description: string;
  category: string;
  creator: string;
  ipfsHash: string;
  priceEth: string;
  modelSize: string;
  parameters: string;
  accuracy: string;
  license: string;
}

interface PurchaseReceipt {
  transactionHash: string;
  modelId: number;
  modelName: string;
  buyer: string;
  pricePaidEth: string;
  accessToken: string;
  accessExpires: string;
  ipfsModelMetadata: string;
  simulatedValidationReceipt: {
    blockNumber: number;
    confirmations: number;
    gasUsed: string;
    network: string;
  };
}

interface Message {
  sender: "user" | "core";
  text: string;
  timestamp: string;
}

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Dashboard() {
  const { 
    activeTab, 
    setActiveTab, 
    toast, 
    showToast, 
    hideToast,
    web3Address,
    web3Balance,
    isWeb3Connected,
    isWeb3Connecting,
    connectWeb3
  } = useTab();

  // Mock Authentication States
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [floatingInputText, setFloatingInputText] = useState<string>("");
  const floatingChatEndRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  // Developer Access Key dynamic state
  const [apiKey, setApiKey] = useState<string>("mtx_live_9082a014902F17c8B4adC3C1C288bEE98C");

  // Shared state for models and transactions
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [purchasedReceipt, setPurchasedReceipt] = useState<PurchaseReceipt | null>(null);
  const [unlockedModelIds, setUnlockedModelIds] = useState<number[]>([1]); // model ID 1 unlocked by default
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // AI Chatbot States
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "core",
      text: "⚡ Matrix-Core Node-7 initializing... Neural link established. How can I facilitate your on-chain model operations today, Developer?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Compute visualizer burst state
  const [burstCount, setBurstCount] = useState<number>(0);
  const [telemetry, setTelemetry] = useState({
    gasPrice: 21,
    ipfsShards: 14,
    neuralSync: 99.4,
    blockTime: 12.4
  });

  // Fetch Live Models on load
  useEffect(() => {
    async function fetchModels() {
      try {
        setLoading(true);
        const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/models`);
        if (!res.ok) {
          throw new Error(`Failed to fetch models: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.models)) {
          setModels(data.models);
        } else {
          throw new Error("Invalid API response format");
        }
        setError(null);
      } catch (err: any) {
        console.error("Error fetching models:", err);
        setError(`Unable to connect to MatrixBlocks Backend API. Please ensure your backend server is running on ${NEXT_PUBLIC_API_URL}.`);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  // Fluctuating Telemetry Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => ({
        gasPrice: Math.max(12, Math.min(45, prev.gasPrice + (Math.random() > 0.5 ? 1 : -1))),
        ipfsShards: Math.max(8, Math.min(24, prev.ipfsShards + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0))),
        neuralSync: parseFloat(Math.max(98.1, Math.min(100.0, prev.neuralSync + (Math.random() > 0.5 ? 0.05 : -0.05))).toFixed(2)),
        blockTime: parseFloat(Math.max(8.0, Math.min(16.0, prev.blockTime + (Math.random() > 0.5 ? 0.2 : -0.2))).toFixed(1))
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Web3 Simulate Purchase Handler
  const handlePurchase = async (model: AIModel) => {
    try {
      setBuyingId(model.id);
      
      const dummyTxHash = `0x71c54902F17c8B` + Array.from({ length: 50 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const activeBuyerAddress = web3Address || "0x71c46c6453a29e123a29331f08c69aa62429a26a";

      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txHash: dummyTxHash,
          modelId: model.id,
          buyerAddress: activeBuyerAddress,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to process blockchain transaction simulation.");
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPurchasedReceipt(result.data);
      setUnlockedModelIds((prev) => [...prev, model.id]);
    } catch (err: any) {
      alert(`Simulation Error: ${err.message}`);
    } finally {
      setBuyingId(null);
    }
  };

  // Mock Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleWalletConnect = async () => {
    const address = await connectWeb3();
    if (address) {
      setIsAuthenticated(true); // Automatically login when Web3 connected
    }
  };

  // AI Chat Bot Send
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const promptToSend = inputText;
    setInputText("");
    setIsTyping(true);

    // Trigger Visualizer Burst Animation
    setBurstCount(prev => prev + 1);

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: promptToSend
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setMessages(prev => [...prev, {
          sender: "core",
          text: result.reply,
          timestamp: result.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }]);
      } else {
        throw new Error(result.error || "Failed to fetch response from Matrix-Core.");
      }
    } catch (err: any) {
      console.error("Chat API Error:", err);
      // Premium contextual local fallback inside the client if the network completely fails
      const fallbackPrompt = promptToSend.toLowerCase();
      let responseText = "Matrix-Core Node-7: Standard query logs archived. Decentralized computing network synchronised. Proceeding with active job allocations.";
      
      if (fallbackPrompt.includes("model") || fallbackPrompt.includes("weights")) {
        responseText = `Matrix-Core Node-7: Active Weights Index scanned. Unlocked model IDs: [${unlockedModelIds.join(", ")}]. Staking state verified. Access keys loaded securely via IPFS.`;
      } else if (fallbackPrompt.includes("wallet") || fallbackPrompt.includes("staking") || fallbackPrompt.includes("gas")) {
        responseText = `Matrix-Core Node-7: consensus audit complete. Wallet address "0x71c4...26a" currently staked with 12.5 ETH. Current gas price: ${telemetry.gasPrice} Gwei. Staking yield rate active at 8.42% APY.`;
      } else if (fallbackPrompt.includes("shard") || fallbackPrompt.includes("ipfs")) {
        responseText = `Matrix-Core Node-7: active IPFS distributed network nodes monitored. Current sharding factor: ${telemetry.ipfsShards} active segments. Integrity checksum validated successfully.`;
      } else if (fallbackPrompt.includes("status") || fallbackPrompt.includes("sync")) {
        responseText = `Matrix-Core Node-7: complete network telemetry scanned. Nodes online: 1,248/1,500. Compute output: ${networkHashrate}. Neural Sync capacity: ${telemetry.neuralSync}%.`;
      }

      setMessages(prev => [...prev, {
        sender: "core",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // AI Chat Bot Send (Floating)
  const handleSendFloatingMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!floatingInputText.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: floatingInputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const promptToSend = floatingInputText;
    setFloatingInputText("");
    setIsTyping(true);

    // Trigger Visualizer Burst Animation
    setBurstCount(prev => prev + 1);

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: promptToSend
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setMessages(prev => [...prev, {
          sender: "core",
          text: result.reply,
          timestamp: result.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }]);
      } else {
        throw new Error(result.error || "Failed to fetch response from Matrix-Core.");
      }
    } catch (err: any) {
      console.error("Chat API Error:", err);
      // Premium contextual local fallback inside the client if the network completely fails
      const fallbackPrompt = promptToSend.toLowerCase();
      let responseText = "Matrix-Core Node-7: Standard query logs archived. Decentralized computing network synchronised. Proceeding with active job allocations.";
      
      if (fallbackPrompt.includes("model") || fallbackPrompt.includes("weights")) {
        responseText = `Matrix-Core Node-7: Active Weights Index scanned. Unlocked model IDs: [${unlockedModelIds.join(", ")}]. Staking state verified. Access keys loaded securely via IPFS.`;
      } else if (fallbackPrompt.includes("wallet") || fallbackPrompt.includes("staking") || fallbackPrompt.includes("gas")) {
        responseText = `Matrix-Core Node-7: consensus audit complete. Wallet address "0x71c4...26a" currently staked with 12.5 ETH. Current gas price: ${telemetry.gasPrice} Gwei. Staking yield rate active at 8.42% APY.`;
      } else if (fallbackPrompt.includes("shard") || fallbackPrompt.includes("ipfs")) {
        responseText = `Matrix-Core Node-7: active IPFS distributed network nodes monitored. Current sharding factor: ${telemetry.ipfsShards} active segments. Integrity checksum validated successfully.`;
      } else if (fallbackPrompt.includes("status") || fallbackPrompt.includes("sync")) {
        responseText = `Matrix-Core Node-7: complete network telemetry scanned. Nodes online: 1,248/1,500. Compute output: ${networkHashrate}. Neural Sync capacity: ${telemetry.neuralSync}%.`;
      }

      setMessages(prev => [...prev, {
        sender: "core",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (isFloatingChatOpen) {
      floatingChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isFloatingChatOpen]);

  // Copy utilities
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const copyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Constants
  const activeNodesCount = 1248;
  const networkHashrate = "84.2 PFLOPS";
  const balanceEth = web3Balance;
  const walletAddress = web3Address || "0x71c46c6453a29e123a29331f08c69aa62429a26a";

  return (
    <div className="w-full relative min-h-[calc(100vh-4rem)]">
      
      {/* 1. AUTHENTICATION GATEWAY PORTAL */}
      <AnimatePresence mode="wait">
        {!isAuthenticated && (
          <motion.div
            key="login-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.3 } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030007]/90 backdrop-blur-xl"
          >
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25 } }}
              className="relative w-full max-w-md glass-panel bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-xl shadow-purple-500/20">
                  <span className="text-white font-black text-2xl tracking-wider">M</span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">MatrixBlocks Gateway</h2>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed max-w-xs">
                    Access decentralised GPU clusters and model consensus directories. Initialize secure credential handshake.
                  </p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Developer Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="developer@matrixblocks.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <LockKeyhole className="w-3.5 h-3.5 text-purple-400" /> Access Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl transition-all shadow-lg active:scale-[0.98] mt-2"
                >
                  Enter Matrix Network
                </button>
              </form>

              <div className="relative flex items-center justify-center my-1">
                <div className="absolute w-full h-[1px] bg-white/10" />
                <span className="relative px-3 bg-[#08060c] text-[10px] text-zinc-500 font-bold uppercase tracking-wider">OR</span>
              </div>

              {/* Web3 Wallet Connect Button */}
              <button
                type="button"
                onClick={handleWalletConnect}
                disabled={isWeb3Connecting}
                className={`w-full py-3.5 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative overflow-hidden active:scale-[0.98] ${
                  isWeb3Connected 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                }`}
              >
                {isWeb3Connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    Connecting MetaMask...
                  </>
                ) : isWeb3Connected ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Wallet Connected ({web3Address ? `${web3Address.slice(0, 6)}...${web3Address.slice(-4)}` : "0x71c4...26a"})
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 text-cyan-400" />
                    Connect Web3 Wallet
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Authenticated Dashboard */}
      {isAuthenticated && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8 py-6 relative"
          variants={containerVariants}
        >
          {/* 1. OVERVIEW VIEW */}
          {activeTab === "overview" && (
            <>
              {/* Welcome Header */}
              <motion.div variants={itemVariants} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider animate-pulse">
                    System Online
                  </span>
                  <span className="text-zinc-500 text-xs font-medium">Node ID: MTX-9082-ALPHA</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                  Welcome to the{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Matrix Dashboard
                  </span>
                </h1>
                <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
                  Monitor your decentralized compute jobs, manage active neural models, audit smart contracts, and securely manage your cryptographic assets from one glassmorphic hub.
                </p>
              </motion.div>

              {/* Grid of Stats Cards */}
              <motion.div 
                variants={containerVariants} 
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {[
                  { name: "Active GPU Nodes", value: `${activeNodesCount} / 1,500`, change: "+2.4% this week", icon: Server, color: "text-cyan-400" },
                  { name: "Network Hashrate", value: networkHashrate, change: "+5.1% this week", icon: Activity, color: "text-purple-400" },
                  { name: "Wallet Balance", value: balanceEth, change: "+12.4% this week", icon: Wallet, color: "text-emerald-400" },
                  { name: "Unlocked AI Models", value: `${unlockedModelIds.length} Models`, change: "+10.0% this week", icon: Zap, color: "text-amber-400" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="glass-panel p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-300" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                          {stat.name}
                        </span>
                        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between w-full">
                        <span className="text-2xl font-bold text-white tracking-tight">
                          {stat.value}
                        </span>
                        {stat.change && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <ArrowUpRight className="w-3 h-3 text-emerald-400" /> {stat.change}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Core Portals navigation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <motion.div variants={containerVariants} className="lg:col-span-2 flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-cyan-400" /> Core Ecosystem Portals
                    </h2>
                    <p className="text-xs text-zinc-500">Quickly jump to decentralized subnet consoles</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "AI Model Marketplace", desc: "Browse, deploy, and stake neural weights dynamically.", tab: "marketplace" as const, icon: ShoppingBag, color: "text-cyan-400", badge: "Live Index" },
                      { title: "My Neural Models", desc: "Manage API credentials and active token leases.", tab: "models" as const, icon: Cpu, color: "text-purple-400", badge: "Active" },
                      { title: "Staking Wallet Console", desc: "Deposit assets, stake compute gas, and audit fees.", tab: "wallet" as const, icon: Wallet, color: "text-emerald-400", badge: "Secure" },
                      { title: "AI Chatbot", desc: "Interact directly with node core intelligence.", tab: "chatbot" as const, icon: MessageSquare, color: "text-rose-400", badge: "Interactive" },
                      { title: "Developer Portal", desc: "Access cURL CLI tools and generate off-chain tokens.", tab: "developer" as const, icon: Terminal, color: "text-amber-400", badge: "API Gateway" }
                    ].map((portal, idx) => {
                      const Icon = portal.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(portal.tab)}
                          className="group relative glass-panel p-5.5 rounded-3xl border border-white/5 hover:border-cyan-500/30 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between gap-4 overflow-hidden text-left w-full"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-white/2 group-hover:bg-cyan-500/5 blur-xl transition-all" />
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${portal.color}`}>
                                <Icon className="w-4.5 h-4.5" />
                              </div>
                              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-semibold">
                                {portal.badge}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                                {portal.title} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </h3>
                              <p className="text-xs text-zinc-400 leading-relaxed">{portal.desc}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Mesh Network Load Status */}
                <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl flex flex-col gap-6 border border-white/5">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-purple-400" /> Mesh Network Status
                    </h2>
                    <p className="text-xs text-zinc-500">Live telemetry from global matrix nodes</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Matrix-NorthAmerica", load: "78%", status: "Optimal", color: "text-emerald-400" },
                      { label: "Matrix-Europe", load: "92%", status: "High Load", color: "text-amber-400" },
                      { label: "Matrix-AsiaEast", load: "45%", status: "Optimal", color: "text-emerald-400" },
                      { label: "Consensus Layer", load: "99.9%", status: "Synchronized", color: "text-cyan-400" },
                    ].map((node, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-200">{node.label}</span>
                          <span className="text-[10px] text-zinc-500">System Load: {node.load}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5">
                            {node.status === "Optimal" || node.status === "Synchronized" ? (
                              <span className={`w-1.5 h-1.5 rounded-full ${node.status === "Optimal" ? "bg-emerald-400" : "bg-cyan-400"} animate-pulse`} />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            )}
                            <span className={`text-[10px] font-semibold ${node.color}`}>{node.status}</span>
                          </div>
                          <span className="text-[9px] text-zinc-500">Latency: 14ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* 2. MARKETPLACE VIEW */}
          {activeTab === "marketplace" && (
            <motion.div variants={containerVariants} className="flex flex-col gap-6">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
                  <ShoppingBag className="w-8 h-8 text-cyan-400" /> AI Model Marketplace
                </h1>
                <p className="text-zinc-400 text-sm max-w-xl">
                  Deploy premium NLP transformers, latent art diffusion models, and high-fidelity speech synthesis engines directly to your GPU node instances.
                </p>
              </motion.div>

              {loading && (
                <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-3xl gap-4">
                  <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                  <p className="text-sm text-zinc-400 animate-pulse">Syncing on-chain marketplace index...</p>
                </div>
              )}

              {error && (
                <div className="p-6 glass-panel rounded-3xl border border-red-500/20 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-bold text-sm">Marketplace Index Offline</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="self-start text-xs font-semibold px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white transition-colors"
                  >
                    Retry Sync
                  </button>
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {models.map((model) => {
                    const isUnlocked = unlockedModelIds.includes(model.id);
                    const isBuying = buyingId === model.id;

                    return (
                      <motion.div
                        key={model.id}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className="group relative glass-panel p-6 rounded-3xl flex flex-col justify-between gap-6 transition-all duration-300 border border-white/5 hover:border-white/20 overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                              {model.category}
                            </span>
                            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                              {model.priceEth} ETH
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              {model.name}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed min-h-[50px]">
                              {model.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 bg-white/2 p-3 rounded-xl border border-white/5 text-[10px] text-zinc-500 font-medium">
                            <div>Size: <span className="text-zinc-300">{model.modelSize}</span></div>
                            <div>Params: <span className="text-zinc-300">{model.parameters}</span></div>
                            <div>Accuracy: <span className="text-zinc-300">{model.accuracy}</span></div>
                            <div>License: <span className="text-zinc-300">{model.license}</span></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
                          <a 
                            href={`https://ipfs.io/ipfs/${model.ipfsHash.replace("ipfs://", "")}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
                          >
                            Weights Schema <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {isUnlocked ? (
                            <button
                              disabled
                              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold"
                            >
                              <Unlock className="w-3.5 h-3.5" /> Model Unlocked
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePurchase(model)}
                              disabled={buyingId !== null}
                              className="relative flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                            >
                              {isBuying ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                  Staking Gas...
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" /> Purchase Access
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* 3. MY MODELS VIEW */}
          {activeTab === "models" && (
            <motion.div variants={containerVariants} className="flex flex-col gap-6">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
                  <Cpu className="w-8 h-8 text-purple-400" /> My Neural Models
                </h1>
                <p className="text-zinc-400 text-sm max-w-xl">
                  Manage your unlocked AI models, query credentials, active deployments, and compute parameters across the mesh network.
                </p>
              </motion.div>

              <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
                {models.filter(m => unlockedModelIds.includes(m.id)).map((model) => (
                  <motion.div 
                    key={model.id}
                    variants={itemVariants}
                    className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl pointer-events-none" />

                    <div className="flex flex-col gap-3.5 flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {model.category}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-1 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
                          Active Lease
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-purple-400" /> {model.name}
                        </h3>
                        <span className="text-xs text-zinc-500 font-medium">Unlocked via Matrix blocks Proof-of-Inference</span>
                      </div>

                      <div className="flex flex-col gap-1 pt-2 w-full">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Key className="w-3.5 h-3.5" /> API Bearer Token
                        </span>
                        <div className="flex items-center justify-between bg-zinc-950/80 p-2.5 rounded-xl border border-white/10 gap-3 w-full">
                          <span className="font-mono text-[10px] text-cyan-400 truncate flex-1 select-all">
                            {ethersPackedToken(model.id)}
                          </span>
                          <button
                            onClick={() => copyCode(ethersPackedToken(model.id), model.id)}
                            className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all flex-shrink-0"
                          >
                            {copiedIndex === model.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-4 text-xs font-semibold text-zinc-500 bg-white/2 p-4.5 rounded-2xl border border-white/5 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-zinc-400" />
                        <span>Node: <span className="text-zinc-300">MTX-US-EAST-{model.id}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Unlock className="w-4 h-4 text-zinc-400" />
                        <span>Compute: <span className="text-zinc-300">{model.modelSize}</span></span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* 4. WALLET VIEW */}
          {activeTab === "wallet" && (
            <motion.div variants={containerVariants} className="flex flex-col gap-6">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
                  <Wallet className="w-8 h-8 text-emerald-400" /> Wallet Console
                </h1>
                <p className="text-zinc-400 text-sm max-w-xl">
                  Manage your Ethereum balances, audit gas fees, and review proof-of-stake node delegations.
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl pointer-events-none" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold">Active Account Hash</span>
                  <span className="font-mono text-sm md:text-base text-emerald-400 select-all tracking-tight break-all">
                    {isWeb3Connected && web3Address
                      ? `${web3Address.slice(0, 6)}...${web3Address.slice(-4)}`
                      : "0x71c4...26a"}
                  </span>
                </div>
                {isWeb3Connected ? (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full uppercase tracking-wider animate-pulse">
                    Metamask Connected
                  </span>
                ) : (
                  <button 
                    onClick={connectWeb3}
                    className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold rounded-full uppercase tracking-wider text-zinc-300 transition-all active:scale-95"
                  >
                    Connect MetaMask
                  </button>
                )}
              </motion.div>

              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  { name: "Wallet Balance", val: balanceEth, icon: Wallet, color: "text-emerald-400" },
                  { name: "Compute Delegated Staking", val: "12.50 ETH", icon: Coins, color: "text-cyan-400" },
                  { name: "Staking Accrued Rewards", val: "0.48 ETH", icon: Zap, color: "text-amber-400" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{item.name}</span>
                        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <span className="text-2xl font-black text-white tracking-tight">{item.val}</span>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-white">Staking settlement portal</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Delegate compute jobs by staking native ETH. Delegating assets automatically powers the GPU cluster inference nodes, earning yield from validation block cuts.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        if (!isWeb3Connected) {
                          connectWeb3();
                        } else {
                          showToast("Initiating staking deposit for connected wallet...", "info");
                        }
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <ArrowUpRight className="w-4 h-4" /> Deposit Staking
                    </button>
                    <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs uppercase tracking-wider text-zinc-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98">
                      <ArrowDownLeft className="w-4 h-4" /> Withdraw
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-white">Consensus Gas Audit</h3>
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className="text-zinc-500">Fast (Instant confirmation):</span>
                      <span className="font-bold text-zinc-200">14 Gwei (~$1.20)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className="text-zinc-500">Standard (3 min wait):</span>
                      <span className="font-bold text-zinc-200">8 Gwei (~$0.65)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-zinc-500">Active validator fee:</span>
                      <span className="font-bold text-zinc-200">0.05% cut</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 5. AI PLAYGROUND CHATBOT & LIVE COMPUTE VISUALIZER */}
          {activeTab === "chatbot" && (
            <motion.div variants={containerVariants} className="flex flex-col gap-6">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
                  <MessageSquare className="w-8 h-8 text-rose-400" /> AI Chatbot
                </h1>
                <p className="text-zinc-400 text-sm max-w-xl">
                  Interact directly with the Matrix-Core node intelligence. Run queries, audit neural sync capacities, and trigger real-time telemetry updates.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left 2 Cols: Terminal Chat Window */}
                <motion.div 
                  variants={itemVariants}
                  className="lg:col-span-2 glass-panel bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-[520px] shadow-2xl relative overflow-hidden"
                >
                  {/* Terminal Title Bar */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/5 text-xs text-zinc-400">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                      <span>matrix-core@node-7:~</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500 select-none">handshake: secure</span>
                  </div>

                  {/* Messages Body */}
                  <div className="flex-1 overflow-y-auto my-4 pr-1 flex flex-col gap-4 scrollbar-thin">
                    {messages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex flex-col max-w-[85%] ${
                          msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                        }`}
                      >
                        <span className="text-[9px] text-zinc-500 font-mono mb-1">{msg.sender === "user" ? "Developer" : "Matrix-Core Node-7"} • {msg.timestamp}</span>
                        <div 
                          className={`px-4.5 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === "user" 
                              ? "bg-gradient-to-r from-blue-600/40 to-purple-600/40 text-white border border-white/10 rounded-tr-sm" 
                              : "bg-white/5 text-zinc-200 border border-white/5 rounded-tl-sm font-mono text-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="self-start flex flex-col items-start max-w-[85%]">
                        <span className="text-[9px] text-zinc-500 font-mono mb-1">Matrix-Core Node-7 • Telemetry...</span>
                        <div className="px-4.5 py-3 rounded-2xl bg-white/5 text-cyan-400 border border-white/5 rounded-tl-sm font-mono text-xs flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Decrypting neural response...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendMessage} className="flex gap-3 pt-3.5 border-t border-white/5">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Query system weights, gas fees, or check node status..."
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50 transition-all font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isTyping}
                      className="p-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 disabled:opacity-50 disabled:hover:bg-rose-500/10 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>

                {/* Right 1 Col: Live Compute Node Metrics Visualizer */}
                <motion.div 
                  variants={itemVariants}
                  className="glass-panel p-6 rounded-3xl flex flex-col gap-6 border border-white/5 shadow-2xl relative overflow-hidden h-[520px]"
                >
                  {/* Visualizer Burst overlay */}
                  <AnimatePresence>
                    {burstCount > 0 && (
                      <motion.div
                        key={burstCount}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 2.2, opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
                        className="absolute inset-0 bg-rose-500/10 pointer-events-none rounded-3xl blur-2xl"
                      />
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-1 pb-3 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-rose-400" /> Compute Metrics
                      </h2>
                      {burstCount > 0 && (
                        <motion.span 
                          animate={{ scale: [1, 1.2, 1], transition: { duration: 0.3 } }}
                          className="text-[9px] uppercase bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30 font-bold tracking-widest animate-pulse"
                        >
                          BURST ACTIVE
                        </motion.span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">Live consensus telemetry for node 0x71c4...</p>
                  </div>

                  {/* Dynamic widgets */}
                  <div className="flex flex-col gap-4 flex-1 justify-center">
                    {[
                      { label: "Compute Gas Price", val: `${telemetry.gasPrice} Gwei`, desc: "Fluctuates based on mesh network loads", color: "text-rose-400", metricVal: telemetry.gasPrice, max: 45 },
                      { label: "Active IPFS Shards", val: `${telemetry.ipfsShards} Shards`, desc: "Replicated segments across subnets", color: "text-cyan-400", metricVal: telemetry.ipfsShards, max: 24 },
                      { label: "Neural Sync Consistency", val: `${telemetry.neuralSync}%`, desc: "Consensus block coherence percentage", color: "text-purple-400", metricVal: telemetry.neuralSync - 98, max: 2 },
                      { label: "Average Block Time", val: `${telemetry.blockTime} Secs`, desc: "Latency validation execution limits", color: "text-amber-400", metricVal: 16 - telemetry.blockTime, max: 8 }
                    ].map((metric, i) => (
                      <motion.div 
                        key={i}
                        animate={burstCount > 0 ? {
                          scale: [1, 1.02, 1],
                          x: [0, Math.random() > 0.5 ? 2 : -2, 0],
                          transition: { duration: 0.4, delay: i * 0.05 }
                        } : {}}
                        className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-colors flex flex-col gap-2 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-200">{metric.label}</span>
                            <span className="text-[9px] text-zinc-500">{metric.desc}</span>
                          </div>
                          <span className={`text-base font-black ${metric.color} tracking-tight`}>{metric.val}</span>
                        </div>

                        {/* Progress Bar Visualizer */}
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (metric.metricVal / metric.max) * 100)}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                            className={`h-full bg-gradient-to-r ${
                              i === 0 ? "from-rose-500 to-pink-500" :
                              i === 1 ? "from-cyan-500 to-blue-500" :
                              i === 2 ? "from-purple-500 to-indigo-500" :
                              "from-amber-500 to-orange-500"
                            }`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Visualizer Status Footer */}
                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between gap-3 mt-auto">
                    <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                      Neural sync validator #842 online
                    </span>
                    <span className="text-[9px] font-bold text-rose-400 font-mono">OK</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* 6. DEVELOPER PORTAL VIEW */}
          {activeTab === "developer" && (
            <motion.div variants={containerVariants} className="flex flex-col gap-6">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
                  <Terminal className="w-8 h-8 text-cyan-400" /> Developer Portal
                </h1>
                <p className="text-zinc-400 text-sm max-w-xl">
                  Integrate MatrixBlocks inference engines directly into your client applications. Monitor active API keys and parse consensus schemas.
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <h3>Active Developer Access Key</h3>
                  </div>
                  <button
                    onClick={() => {
                      const randHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
                      const newKey = `mtx_live_${randHex}`;
                      setApiKey(newKey);
                      showToast("New production API token generated successfully!", "success");
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 focus:outline-none"
                  >
                    Generate New Production Token
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  This key is utilized to authenticate off-chain API requests against the consensus models directory. Keep it secure!
                </p>
                
                <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-2xl border border-white/10 gap-3">
                  <span className="font-mono text-xs text-cyan-400 truncate flex-1 select-all">
                    {apiKey}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      setCopiedIndex(99);
                      setTimeout(() => setCopiedIndex(null), 2000);
                      showToast("Active Developer Access Key copied to clipboard!", "success");
                    }}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all flex-shrink-0"
                  >
                    {copiedIndex === 99 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={containerVariants} className="flex flex-col gap-6">
                {[
                  {
                    title: "Query Available Neural Models (Node.js Fetch)",
                    code: `fetch("${NEXT_PUBLIC_API_URL}/api/models")\n  .then(res => res.json())\n  .then(data => console.log(\`Active Models: \${data.count}\`));`
                  },
                  {
                    title: "Verify Model Access Token (cURL CLI)",
                    code: `curl -X POST ${NEXT_PUBLIC_API_URL}/api/purchase \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "txHash": "0x71c54902F17c8Babcdef...",\n    "modelId": 1,\n    "buyerAddress": "${walletAddress}"\n  }'`
                  }
                ].map((snippet, idx) => (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <Code className="w-4.5 h-4.5 text-purple-400" /> {snippet.title}
                      </span>
                      <button
                        onClick={() => copyCode(snippet.code, idx)}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all"
                      >
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <pre className="p-4 rounded-2xl bg-zinc-950/80 border border-white/5 font-mono text-[10px] text-zinc-300 leading-relaxed overflow-x-auto select-all">
                      <code>{snippet.code}</code>
                    </pre>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Glassmorphic Success Modal */}
          <AnimatePresence>
            {purchasedReceipt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPurchasedReceipt(null)}
                  className="absolute inset-0 bg-black/85 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.9, y: 30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25 } }}
                  exit={{ scale: 0.9, y: 30, opacity: 0 }}
                  className="relative w-full max-w-lg glass-panel bg-[#090710]/95 border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col gap-6"
                >
                  <button 
                    onClick={() => setPurchasedReceipt(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center gap-3 text-center mt-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
                    >
                      <CheckCircle className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white">AI Model Unlocked Successfully</h3>
                      <p className="text-xs text-zinc-400 mt-1">Proof-of-inference transaction validated on MatrixBlocks Chain</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 bg-white/2 p-4.5 rounded-2xl border border-white/5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-white/3">
                      <span className="text-zinc-500">Unlocking Target:</span>
                      <span className="font-semibold text-zinc-200">{purchasedReceipt.modelName}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/3">
                      <span className="text-zinc-500">Staked Settlement:</span>
                      <span className="font-bold text-cyan-400">{purchasedReceipt.pricePaidEth} ETH</span>
                    </div>
                    <div className="flex flex-col gap-1 py-1 border-b border-white/3">
                      <span className="text-zinc-500">Tx Hash:</span>
                      <span className="font-mono text-[10px] text-zinc-400 truncate">{purchasedReceipt.transactionHash}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-2">
                      <span className="text-zinc-500 font-semibold">🔑 Generated Access Token:</span>
                      <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-white/10 gap-3">
                        <span className="font-mono text-[9px] text-cyan-400 truncate flex-1 select-all">
                          {purchasedReceipt.accessToken}
                        </span>
                        <button
                          onClick={() => copyToClipboard(purchasedReceipt.accessToken)}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all flex-shrink-0"
                        >
                          {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setPurchasedReceipt(null)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-semibold text-xs uppercase tracking-wider text-white rounded-xl transition-all"
                  >
                    Close Receipt
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Glassmorphic Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-6 right-6 z-[100] flex items-center gap-3.5 px-5 py-4 rounded-2xl glass-panel bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl min-w-[320px] select-none"
          >
            <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${
              toast.type === "success" 
                ? "text-emerald-400" 
                : toast.type === "warning" 
                  ? "text-amber-400" 
                  : "text-cyan-400"
            }`}>
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : toast.type === "warning" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Activity className="w-5 h-5 animate-pulse" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 flex-1 pr-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                {toast.type === "success" 
                  ? "Node Synced" 
                  : toast.type === "warning" 
                    ? "Telemetry Alert" 
                    : "Network Status"}
              </span>
              <p className="text-xs text-zinc-200 font-semibold leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={hideToast}
              className="text-zinc-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Chatbot Action Button & Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isFloatingChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-96 h-[500px] rounded-3xl glass-panel bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Pop-up Header */}
              <div className="p-4.5 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 shadow-md">
                    <span className="text-white font-extrabold text-sm">M</span>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-zinc-950 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-white tracking-wide">Matrix-Core Node-7</span>
                    <span className="text-[9px] text-zinc-500 font-medium">PoI Syncing: active</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFloatingChatOpen(false)}
                  className="text-zinc-400 hover:text-white p-1.5 hover:bg-white/5 rounded-xl transition-colors focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chats Container */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md rounded-tr-none font-medium"
                          : "bg-white/5 border border-white/5 text-zinc-200 rounded-tl-none font-medium"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className="text-[8px] text-zinc-500 mt-1 block text-right font-semibold">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none px-4 py-3 bg-white/5 border border-white/5 text-zinc-400 text-xs flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                      <span className="animate-pulse tracking-wide font-medium">Decrypting neural response...</span>
                    </div>
                  </div>
                )}
                <div ref={floatingChatEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendFloatingMessage} className="p-3 border-t border-white/5 bg-white/2 flex gap-2">
                <input
                  type="text"
                  value={floatingInputText}
                  onChange={(e) => setFloatingInputText(e.target.value)}
                  placeholder="Query Matrix-Core node weights..."
                  className="flex-1 bg-white/5 hover:bg-white/7 focus:bg-white/8 text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-2.5 text-xs border border-white/5 focus:border-rose-500/30 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!floatingInputText.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-40 disabled:hover:opacity-40 transition-all shadow-md focus:outline-none"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Floating Action Button (FAB) */}
        <motion.button
          onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-rose-500/20 hover:shadow-rose-500/35 relative border border-white/10 focus:outline-none z-50`}
        >
          {/* Animated pulsing outer rings */}
          <span className="absolute inset-0 rounded-full bg-rose-500 opacity-20 animate-ping -z-10" />
          
          {isFloatingChatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageSquare className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>
    </div>
  );
}

// Simple deterministic helper to generate access token for unlocked items list preview
function ethersPackedToken(id: number) {
  // Simulates keccak256 hash output
  return `0xa8b16c6453a29e123a29331f08c69aa62429a26a${id}98f238ab3c98dc23bc98bc1982a01`;
}
