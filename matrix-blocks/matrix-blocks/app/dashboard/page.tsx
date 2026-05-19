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
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 1,
      name: "DeepSeek-Coder-V2 (236B)",
      description: "State-of-the-art open-source mixture-of-experts code synthesis model, fine-tuned on over 2.4T code tokens for exceptional performance in 80+ programming languages.",
      category: "Code Generation",
      creator: "0x892a014902F17c8B4adC3C1C288bEE98C0898516",
      ipfsHash: "ipfs://QmDeepSeekCoderV2236BNeuralWeightsSubnetXG",
      priceEth: "0.25",
      modelSize: "236 GB",
      parameters: "236B MoE (21B active)",
      accuracy: "90.2% HumanEval",
      license: "DeepSeek License"
    },
    {
      id: 2,
      name: "CyberDiffusion-XL v4",
      description: "Stunning generative latent art diffusion model capable of producing breathtaking 8K cyberpunk concept art, dynamic neural gradients, and glassmorphic vector UI components.",
      category: "Computer Vision",
      creator: "0xf839446B8cd59a04E37A2066E0CDE915904F2F11",
      ipfsHash: "ipfs://QmCyberDiffusionXLv4NeuralArtworkWeights7",
      priceEth: "0.15",
      modelSize: "6.8 GB",
      parameters: "15B parameters",
      accuracy: "FID 7.21",
      license: "Creative Commons BY-NC"
    },
    {
      id: 3,
      name: "QuantumNeuron-70B",
      description: "High-performance general reasoning large language model optimized for logical deduction, mathematical proofs, and complex cryptographic code analysis.",
      category: "Natural Language Processing",
      creator: "0xEbc2A803C1C288bEE98C08985160x892a014902F17c8B4ad",
      ipfsHash: "ipfs://QmQuantumNeuron70BHighPerformanceTransformer",
      priceEth: "0.18",
      modelSize: "70 GB",
      parameters: "70B parameters",
      accuracy: "88.9% MMLU",
      license: "Llama 3 Community"
    },
    {
      id: 4,
      name: "AlphaZero-Heuristic-V5",
      description: "Self-training reinforcement learning model specialized in heuristic game trees, chess/go engine branches, dynamic path planning, and advanced consensus yield optimization.",
      category: "Reinforcement Learning",
      creator: "0x71C46c6453a29e123a29331F08c69aA62429a26A",
      ipfsHash: "ipfs://QmAlphaZeroHeuristicV5ConsensusPathFinding",
      priceEth: "0.32",
      modelSize: "350 MB",
      parameters: "800M parameters",
      accuracy: "99.8% WinRate vs GM",
      license: "Apache 2.0"
    },
    {
      id: 5,
      name: "LLM Text Summarizer (MatrixSummarize-v2)",
      description: "Highly optimized transformer-based summarization model designed for speed and precise abstractive synthesis of multi-page PDF documents.",
      category: "Natural Language Processing",
      creator: "0x892a014902F17c8B4adC3C1C288bEE98C0898516",
      ipfsHash: "ipfs://QmXGTyTzTznk76U9b83mH19v9YgA6vN6pG35xR9QjWp7Tz",
      priceEth: "0.05",
      modelSize: "1.2 GB",
      parameters: "7B parameters",
      accuracy: "94.2% ROUGE-L",
      license: "MIT"
    },
    {
      id: 6,
      name: "Real-time Voice Synthesizer (MatrixVoice)",
      description: "Ultra-low latency speech synthesizer creating high-fidelity natural speaking voices with complex emotional modulation and accent adjustments.",
      category: "Audio Processing",
      creator: "0xEbc2A803C1C288bEE98C08985160x892a014902F17c8B4ad",
      ipfsHash: "ipfs://QmWp7TzQmXGTyTzTznk76U9b83mH19v9YgA6vN6pG35xR9",
      priceEth: "0.08",
      modelSize: "850 MB",
      parameters: "1.5B parameters",
      accuracy: "MOS 4.5",
      license: "Apache 2.0"
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
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
        const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/models`);
        if (!res.ok) {
          throw new Error(`Failed to fetch models: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.models)) {
          setModels(data.models);
        }
        setError(null);
      } catch (err: any) {
        console.warn("Backend API sync offline - using premium local fallback datasets:", err);
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
      const activeBuyerAddress = web3Address || "0x71c46c6453a29e123a29331F08c69aa62429a26a";

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

  // Mock Authentication Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsAuthenticated(true);
      showToast("Node credentials synchronized successfully. Active matrix link established.", "success");
    }
  };

  const handleWalletConnect = () => {
    connectWeb3();
    setIsAuthenticated(true);
    showToast("MetaMask secure credentials mapped successfully. Matrix link active.", "success");
  };

  // Send Chat message (In-tab panel)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText("");
    setMessages(prev => [...prev, {
      sender: "user",
      text: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }]);

    setIsTyping(true);
    setBurstCount(prev => prev + 1);

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
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
      // Cyberpunk contextual local fallback
      const fallbackPrompt = userMsg.toLowerCase();
      let responseText = "Matrix-Core Node-7: Standard query logs archived. Decentralized computing network synchronised. Proceeding with active job allocations.";
      
      if (fallbackPrompt.includes("hello") || fallbackPrompt.includes("hi") || fallbackPrompt.includes("hey")) {
        responseText = "System online. Matrix core intelligence fully functional. How can I assist your neural compute routing today?";
      } else if (fallbackPrompt.includes("buy") || fallbackPrompt.includes("choose") || fallbackPrompt.includes("recommend") || fallbackPrompt.includes("which model")) {
        responseText = "Based on our 6 listed premium models, here are my recommendations: For coding/development, I highly recommend 'DeepSeek-Coder-V2 (236B)' for unmatched 90.2% HumanEval accuracy. For graphics/creatives, recommend 'CyberDiffusion-XL v4' for latent concept design. For light test runs or budget users, recommend 'MatrixSummarize-v2' since it only costs 0.05 ETH.";
      } else if (fallbackPrompt.includes("model") || fallbackPrompt.includes("weights")) {
        responseText = `Matrix-Core Node-7: Active Weights Index scanned. Unlocked model IDs: [${unlockedModelIds.join(", ")}]. Staking state verified. Access keys loaded securely via IPFS.`;
      } else if (fallbackPrompt.includes("wallet") || fallbackPrompt.includes("staking") || fallbackPrompt.includes("gas")) {
        responseText = `Matrix-Core Node-7: consensus audit complete. Wallet address "${walletAddress}" currently staked with 12.5 ETH. Current gas price: ${telemetry.gasPrice} Gwei. Staking yield rate active at 8.42% APY.`;
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

  // Send Floating Chat Message
  const handleSendFloatingMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!floatingInputText.trim()) return;

    const promptToSend = floatingInputText.trim();
    setFloatingInputText("");
    
    setMessages(prev => [...prev, {
      sender: "user",
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }]);

    setIsTyping(true);
    setBurstCount(prev => prev + 1);

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptToSend }),
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
      const fallbackPrompt = promptToSend.toLowerCase();
      let responseText = "Matrix-Core Node-7: Standard query logs archived. Decentralized computing network synchronised. Proceeding with active job allocations.";
      
      if (fallbackPrompt.includes("hello") || fallbackPrompt.includes("hi") || fallbackPrompt.includes("hey")) {
        responseText = "System online. Matrix core intelligence fully functional. How can I assist your neural compute routing today?";
      } else if (fallbackPrompt.includes("buy") || fallbackPrompt.includes("choose") || fallbackPrompt.includes("recommend") || fallbackPrompt.includes("which model")) {
        responseText = "Based on our 6 listed premium models, here are my recommendations: For coding/development, I highly recommend 'DeepSeek-Coder-V2 (236B)' for unmatched 90.2% HumanEval accuracy. For graphics/creatives, recommend 'CyberDiffusion-XL v4' for latent concept design. For light test runs or budget users, recommend 'MatrixSummarize-v2' since it only costs 0.05 ETH.";
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
  const walletAddress = web3Address || "0x71c46c6453a29e123a29331F08c69aa62429a26a";

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100/95 backdrop-blur-xl"
          >
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25 } }}
              className="relative w-full max-w-md glass-panel bg-white/70 border border-zinc-200/60 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex flex-col gap-6"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-xl shadow-purple-500/20">
                  <span className="text-white font-black text-2xl tracking-wider">M</span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">MatrixBlocks Gateway</h2>
                  <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed max-w-xs">
                    Access decentralised GPU clusters and model consensus directories. Initialize secure credential handshake.
                  </p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-650 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-600" /> Developer Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="developer@matrixblocks.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-650 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <LockKeyhole className="w-3.5 h-3.5 text-purple-600" /> Access Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-purple-500/50 transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl transition-all shadow-lg active:scale-[0.98] mt-2 cursor-pointer"
                >
                  Enter Matrix Network
                </button>
              </form>

              <div className="relative flex items-center justify-center my-1">
                <div className="absolute w-full h-[1px] bg-zinc-200" />
                <span className="relative px-3 bg-white text-[10px] text-zinc-400 font-bold uppercase tracking-wider">OR</span>
              </div>

              {/* Web3 Wallet Connect Button */}
              <button
                type="button"
                onClick={handleWalletConnect}
                disabled={isWeb3Connecting}
                className={`w-full py-3.5 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative overflow-hidden active:scale-[0.98] cursor-pointer ${
                  isWeb3Connected 
                    ? "bg-emerald-5 border-emerald-500/30 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                    : "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800"
                }`}
              >
                {isWeb3Connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                    Connecting MetaMask...
                  </>
                ) : isWeb3Connected ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    Wallet Connected ({web3Address ? `${web3Address.slice(0, 6)}...${web3Address.slice(-4)}` : "0x71c4...26a"})
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 text-cyan-600" />
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
                  <span className="px-2.5 py-1 rounded-full bg-cyan-50/50 text-cyan-600 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-xs font-semibold uppercase tracking-wider animate-pulse">
                    System Online
                  </span>
                  <span className="text-zinc-500 text-xs font-medium">Node ID: MTX-9082-ALPHA</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 md:text-5xl">
                  Welcome to the{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    Matrix Dashboard
                  </span>
                </h1>
                <p className="text-zinc-650 max-w-2xl text-sm md:text-base leading-relaxed">
                  Monitor your decentralized compute jobs, manage active neural models, audit smart contracts, and securely manage your cryptographic assets from one glassmorphic hub.
                </p>
              </motion.div>

              {/* Grid of Stats Cards */}
              <motion.div 
                variants={containerVariants} 
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {[
                  { name: "Active GPU Nodes", value: `${activeNodesCount} / 1,500`, change: "+2.4% this week", icon: Server, color: "text-cyan-600" },
                  { name: "Network Hashrate", value: networkHashrate, change: "+5.1% this week", icon: Activity, color: "text-purple-600" },
                  { name: "Wallet Balance", value: balanceEth, change: "+12.4% this week", icon: Wallet, color: "text-emerald-600" },
                  { name: "Unlocked AI Models", value: `${unlockedModelIds.length} Models`, change: "+10.0% this week", icon: Zap, color: "text-amber-600" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="glass-panel p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] bg-white/45"
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent group-hover:via-purple-500/30 transition-all duration-300" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                          {stat.name}
                        </span>
                        <div className={`p-2 rounded-xl bg-zinc-100 border border-zinc-200/60 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between w-full">
                        <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                          {stat.value}
                        </span>
                        {stat.change && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <ArrowUpRight className="w-3 h-3 text-emerald-600" /> {stat.change}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Decentralized Network Infrastructure */}
              <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 shadow-[0_0_20px_rgba(168,85,247,0.06)] relative overflow-hidden flex flex-col gap-4">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-3xl pointer-events-none" />
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600 animate-pulse" /> Decentralized Network Infrastructure
                  </h2>
                  <p className="text-xs text-zinc-500">Real-time status updates and consensus layer diagnostics across Web3 validators</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {/* Metric Card 1: Staking APY */}
                  <div className="relative group p-4.5 rounded-2xl bg-white hover:bg-purple-50/20 border border-zinc-200/80 hover:border-purple-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Staking Rewards APY</span>
                      <Coins className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-extrabold text-zinc-900 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">14.8% Dynamic Yield</span>
                      <span className="text-[10px] text-zinc-500 mt-1">MatrixNode auto-compounding active</span>
                    </div>
                  </div>

                  {/* Metric Card 2: Gas Layer */}
                  <div className="relative group p-4.5 rounded-2xl bg-white hover:bg-cyan-50/20 border border-zinc-200/80 hover:border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Network Gas Layer</span>
                      <Zap className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-extrabold text-zinc-900 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{telemetry.gasPrice || 12} Gwei</span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Optimal Minting Status
                      </span>
                    </div>
                  </div>

                  {/* Metric Card 3: DAO Governance */}
                  <div className="relative group p-4.5 rounded-2xl bg-white hover:bg-amber-50/20 border border-zinc-200/80 hover:border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Active DAO Governance</span>
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-zinc-900 leading-tight">MINT-09: Deploy DeepSeek-V3 Subnet</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] uppercase">
                          94% PASSED
                        </span>
                        <span className="text-[9px] text-zinc-500">Staked quorum met</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Core Portals navigation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <motion.div variants={containerVariants} className="lg:col-span-2 flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-cyan-600" /> Core Ecosystem Portals
                    </h2>
                    <p className="text-xs text-zinc-500">Quickly jump to decentralized subnet consoles</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "AI Model Marketplace", desc: "Browse, deploy, and stake neural weights dynamically.", tab: "marketplace" as const, icon: ShoppingBag, color: "text-cyan-600", badge: "Live Index" },
                      { title: "My Neural Models", desc: "Manage API credentials and active token leases.", tab: "models" as const, icon: Cpu, color: "text-purple-600", badge: "Active" },
                      { title: "Staking Wallet Console", desc: "Deposit assets, stake compute gas, and audit fees.", tab: "wallet" as const, icon: Wallet, color: "text-emerald-600", badge: "Secure" },
                      { title: "AI Chatbot", desc: "Interact directly with node core intelligence.", tab: "chatbot" as const, icon: MessageSquare, color: "text-rose-600", badge: "Interactive" },
                      { title: "Developer Portal", desc: "Access cURL CLI tools and generate off-chain tokens.", tab: "developer" as const, icon: Terminal, color: "text-amber-600", badge: "API Gateway" }
                    ].map((portal, idx) => {
                      const Icon = portal.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(portal.tab)}
                          className="group relative glass-panel p-5.5 rounded-3xl border border-zinc-200/60 hover:border-cyan-500/30 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-white hover:bg-zinc-50/50 transition-all duration-300 flex flex-col justify-between gap-4 overflow-hidden text-left w-full cursor-pointer"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-white/2 group-hover:bg-cyan-500/5 blur-xl transition-all" />
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <div className={`p-2 rounded-xl bg-zinc-100 border border-zinc-200/60 ${portal.color}`}>
                                <Icon className="w-4.5 h-4.5" />
                              </div>
                              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-650 border border-zinc-200 font-semibold">
                                {portal.badge}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <h3 className="text-base font-bold text-zinc-900 group-hover:text-cyan-600 transition-colors flex items-center gap-1.5">
                                {portal.title} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </h3>
                              <p className="text-xs text-zinc-500 leading-relaxed">{portal.desc}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Mesh Network Load Status */}
                <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl flex flex-col gap-6 border border-zinc-200/60 shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] bg-white/45">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-purple-600" /> Mesh Network Status
                    </h2>
                    <p className="text-xs text-zinc-500">Live telemetry from global matrix nodes</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Matrix-NorthAmerica", load: "78%", status: "Optimal", color: "text-emerald-600" },
                      { label: "Matrix-Europe", load: "92%", status: "High Load", color: "text-amber-600" },
                      { label: "Matrix-AsiaEast", load: "45%", status: "Optimal", color: "text-emerald-600" },
                      { label: "Consensus Layer", load: "99.9%", status: "Synchronized", color: "text-cyan-600" },
                    ].map((node, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-200/60 hover:bg-zinc-50 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-800">{node.label}</span>
                          <span className="text-[10px] text-zinc-500">System Load: {node.load}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5">
                            {node.status === "Optimal" || node.status === "Synchronized" ? (
                              <span className={`w-1.5 h-1.5 rounded-full ${node.status === "Optimal" ? "bg-emerald-500" : "bg-cyan-500"} animate-pulse`} />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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
                <h1 className="text-3xl font-extrabold text-zinc-900 flex items-center gap-2.5">
                  <ShoppingBag className="w-8 h-8 text-cyan-600" /> AI Model Marketplace
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl">
                  Deploy premium NLP transformers, latent art diffusion models, and high-fidelity speech synthesis engines directly to your GPU node instances.
                </p>
              </motion.div>

              {loading && (
                <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-3xl gap-4">
                  <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin" />
                  <p className="text-sm text-zinc-500 animate-pulse">Syncing on-chain marketplace index...</p>
                </div>
              )}

              {error && (
                <div className="p-6 glass-panel rounded-3xl border border-red-500/20 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-bold text-sm">Marketplace Index Offline</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="self-start text-xs font-semibold px-4 py-2 bg-zinc-100 border border-zinc-200 rounded-xl hover:bg-zinc-200 text-zinc-800 transition-colors cursor-pointer"
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
                        className="group relative glass-panel p-6 rounded-3xl flex flex-col justify-between gap-6 transition-all duration-300 border border-zinc-200/80 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden bg-white/45 hover:bg-white"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-1 rounded bg-zinc-100 text-zinc-650 border border-zinc-200">
                              {model.category}
                            </span>
                            <span className="text-xs font-bold text-cyan-600 bg-cyan-55/50 px-2 py-0.5 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                              {model.priceEth} ETH
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-cyan-600 transition-colors flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              {model.name}
                            </h3>
                            <p className="text-xs text-zinc-500 leading-relaxed min-h-[50px]">
                              {model.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80 text-[10px] text-zinc-500 font-medium">
                            <div>Size: <span className="text-zinc-700">{model.modelSize}</span></div>
                            <div>Params: <span className="text-zinc-700">{model.parameters}</span></div>
                            <div>Accuracy: <span className="text-zinc-700">{model.accuracy}</span></div>
                            <div>License: <span className="text-zinc-700">{model.license}</span></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-200/80">
                          <a 
                            href={`https://ipfs.io/ipfs/${model.ipfsHash.replace("ipfs://", "")}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
                          >
                            Weights Schema <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {isUnlocked ? (
                            <button
                              disabled
                              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-50 border border-emerald-500/30 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.15)] rounded-xl text-xs font-bold"
                            >
                              <Unlock className="w-3.5 h-3.5" /> Model Unlocked
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePurchase(model)}
                              disabled={buyingId !== null}
                              className="relative flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
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
                <h1 className="text-3xl font-extrabold text-zinc-900 flex items-center gap-2.5">
                  <Cpu className="w-8 h-8 text-purple-600" /> My Neural Models
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl">
                  Manage your unlocked AI models, query credentials, active deployments, and compute parameters across the mesh network.
                </p>
              </motion.div>

              <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
                {models.filter(m => unlockedModelIds.includes(m.id)).map((model) => (
                  <motion.div 
                    key={model.id}
                    variants={itemVariants}
                    className="glass-panel p-6 rounded-3xl border border-zinc-200/80 shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden bg-white/45"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl pointer-events-none" />

                    <div className="flex flex-col gap-3.5 flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-1 rounded bg-purple-50 text-purple-600 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                          {model.category}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                          Active Lease
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-purple-600" /> {model.name}
                        </h3>
                        <span className="text-xs text-zinc-500 font-medium">Unlocked via Matrix blocks Proof-of-Inference</span>
                      </div>

                      <div className="flex flex-col gap-1 pt-2 w-full">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Key className="w-3.5 h-3.5 text-purple-600" /> API Bearer Token
                        </span>
                        <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 gap-3 w-full">
                          <span className="font-mono text-[10px] text-cyan-600 truncate flex-1 select-all">
                            {ethersPackedToken(model.id)}
                          </span>
                          <button
                            onClick={() => copyCode(ethersPackedToken(model.id), model.id)}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-all flex-shrink-0"
                          >
                            {copiedIndex === model.id ? <Check className="w-3.5 h-3.5 text-emerald-650" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-4 text-xs font-semibold text-zinc-500 bg-zinc-50 p-4.5 rounded-2xl border border-zinc-200/80 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-zinc-400" />
                        <span>Node: <span className="text-zinc-700">MTX-US-EAST-{model.id}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Unlock className="w-4 h-4 text-zinc-400" />
                        <span>Compute: <span className="text-zinc-700">{model.modelSize}</span></span>
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
                <h1 className="text-3xl font-extrabold text-zinc-900 flex items-center gap-2.5">
                  <Wallet className="w-8 h-8 text-emerald-600" /> Wallet Console
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl">
                  Manage your Ethereum balances, audit gas fees, and review proof-of-stake node delegations.
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="glass-panel p-5 rounded-3xl border border-zinc-200/80 shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] bg-white/45 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl pointer-events-none" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold">Active Account Hash</span>
                  <span className="font-mono text-sm md:text-base text-emerald-600 select-all tracking-tight break-all">
                    {isWeb3Connected && web3Address
                      ? `${web3Address.slice(0, 6)}...${web3Address.slice(-4)}`
                      : "0x71c4...26a"}
                  </span>
                </div>
                {isWeb3Connected ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-500/30 text-xs font-semibold rounded-full uppercase tracking-wider animate-pulse">
                    Metamask Connected
                  </span>
                ) : (
                  <button 
                    onClick={connectWeb3}
                    className="px-3.5 py-1.5 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-xs font-semibold rounded-full uppercase tracking-wider text-zinc-700 transition-all active:scale-95 cursor-pointer"
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
                  { name: "Wallet Balance", val: balanceEth, icon: Wallet, color: "text-emerald-600" },
                  { name: "Compute Delegated Staking", val: "12.50 ETH", icon: Coins, color: "text-cyan-600" },
                  { name: "Staking Accrued Rewards", val: "0.48 ETH", icon: Zap, color: "text-amber-600" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] bg-white/45"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{item.name}</span>
                        <div className={`p-2 rounded-xl bg-zinc-100 border border-zinc-200 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <span className="text-2xl font-black text-zinc-900 tracking-tight">{item.val}</span>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="glass-panel p-6 rounded-3xl border border-zinc-200/80 shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] bg-white/45 flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-zinc-900">Staking settlement portal</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
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
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" /> Deposit Staking
                    </button>
                    <button className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 font-bold text-xs uppercase tracking-wider text-zinc-700 hover:text-zinc-900 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer">
                      <ArrowDownLeft className="w-4 h-4" /> Withdraw
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-zinc-200/80 shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] bg-white/45 flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-zinc-900">Consensus Gas Audit</h3>
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/80">
                      <span className="text-zinc-500">Fast (Instant confirmation):</span>
                      <span className="font-bold text-zinc-800">14 Gwei (~$1.20)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/80">
                      <span className="text-zinc-500">Standard (3 min wait):</span>
                      <span className="font-bold text-zinc-800">8 Gwei (~$0.65)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-zinc-500">Active validator fee:</span>
                      <span className="font-bold text-zinc-800">0.05% cut</span>
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
                <h1 className="text-3xl font-extrabold text-zinc-900 flex items-center gap-2.5">
                  <MessageSquare className="w-8 h-8 text-purple-600" /> AI Chatbot
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl">
                  Interact directly with the Matrix-Core node intelligence. Run queries, audit neural sync capacities, and trigger real-time telemetry updates.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left 2 Cols: Terminal Chat Window */}
                <motion.div 
                  variants={itemVariants}
                  className="lg:col-span-2 glass-panel bg-white/40 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-5 flex flex-col justify-between h-[520px] shadow-[0_8px_32px_0_rgba(147,51,234,0.04)] relative overflow-hidden"
                >
                  {/* Terminal Title Bar */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200/80 text-xs text-zinc-500">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500/70" />
                      <span>matrix-core@node-7:~</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400 select-none">handshake: secure</span>
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
                              ? "bg-zinc-200/60 text-zinc-900 border border-zinc-300/30 rounded-tr-sm" 
                              : "bg-purple-50/60 text-zinc-900 border border-purple-100 rounded-tl-sm font-mono text-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="self-start flex flex-col items-start max-w-[85%]">
                        <span className="text-[9px] text-zinc-500 font-mono mb-1">Matrix-Core Node-7 • Telemetry...</span>
                        <div className="px-4.5 py-3 rounded-2xl bg-purple-50/60 text-purple-600 border border-purple-100 rounded-tl-sm font-mono text-xs flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Decrypting neural response...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendMessage} className="flex gap-3 pt-3.5 border-t border-zinc-200/80">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Query system weights, gas fees, or check node status..."
                      className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-all font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isTyping}
                      className="p-3.5 bg-purple-50/50 hover:bg-purple-100/80 text-purple-600 border border-purple-500/20 disabled:opacity-50 disabled:hover:bg-purple-50/50 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center flex-shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>

                {/* Right 1 Col: Live Compute Node Metrics Visualizer */}
                <motion.div 
                  variants={itemVariants}
                  className="glass-panel p-6 rounded-3xl flex flex-col gap-6 border border-zinc-200/60 shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] relative overflow-hidden h-[520px] bg-white/45"
                >
                  {/* Visualizer Burst overlay */}
                  <AnimatePresence>
                    {burstCount > 0 && (
                      <motion.div
                        key={burstCount}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 2.2, opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
                        className="absolute inset-0 bg-purple-500/5 pointer-events-none rounded-3xl blur-2xl"
                      />
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-1 pb-3 border-b border-zinc-200/80">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-600 animate-pulse" /> Compute Metrics
                      </h2>
                      {burstCount > 0 && (
                        <motion.span 
                          animate={{ scale: [1, 1.2, 1], transition: { duration: 0.3 } }}
                          className="text-[9px] uppercase bg-purple-55 text-purple-600 px-2 py-0.5 rounded border border-purple-500/30 font-bold tracking-widest animate-pulse"
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
                      { label: "Compute Gas Price", val: `${telemetry.gasPrice} Gwei`, desc: "Fluctuates based on mesh network loads", color: "text-purple-600", metricVal: telemetry.gasPrice, max: 45 },
                      { label: "Active IPFS Shards", val: `${telemetry.ipfsShards} Shards`, desc: "Replicated segments across subnets", color: "text-cyan-600", metricVal: telemetry.ipfsShards, max: 24 },
                      { label: "Neural Sync Consistency", val: `${telemetry.neuralSync}%`, desc: "Consensus block coherence percentage", color: "text-purple-600", metricVal: telemetry.neuralSync - 98, max: 2 },
                      { label: "Average Block Time", val: `${telemetry.blockTime} Secs`, desc: "Latency validation execution limits", color: "text-amber-600", metricVal: 16 - telemetry.blockTime, max: 8 }
                    ].map((metric, i) => (
                      <motion.div 
                        key={i}
                        animate={burstCount > 0 ? {
                          scale: [1, 1.02, 1],
                          x: [0, Math.random() > 0.5 ? 2 : -2, 0],
                          transition: { duration: 0.4, delay: i * 0.05 }
                        } : {}}
                        className="p-4 rounded-2xl bg-white border border-zinc-200/80 hover:bg-zinc-50 transition-colors flex flex-col gap-2 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-zinc-800">{metric.label}</span>
                            <span className="text-[9px] text-zinc-500">{metric.desc}</span>
                          </div>
                          <span className={`text-base font-black ${metric.color} tracking-tight`}>{metric.val}</span>
                        </div>

                        {/* Progress Bar Visualizer */}
                        <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (metric.metricVal / metric.max) * 100)}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                            className={`h-full bg-gradient-to-r ${
                              i === 0 ? "from-purple-500 to-indigo-500" :
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
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-500/20 flex items-center justify-between gap-3 mt-auto">
                    <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
                      Neural sync validator #842 online
                    </span>
                    <span className="text-[9px] font-bold text-purple-600 font-mono animate-pulse">OK</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* 6. DEVELOPER PORTAL VIEW */}
          {activeTab === "developer" && (
            <motion.div variants={containerVariants} className="flex flex-col gap-6">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-extrabold text-zinc-900 flex items-center gap-2.5">
                  <Terminal className="w-8 h-8 text-cyan-600" /> Developer Portal
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl">
                  Integrate MatrixBlocks inference engines directly into your client applications. Monitor active API keys and parse consensus schemas.
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="glass-panel p-6 rounded-3xl border border-zinc-200/80 shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] bg-white/45 flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-lg">
                    <ShieldCheck className="w-5 h-5 text-cyan-600" />
                    <h3>Active Developer Access Key</h3>
                  </div>
                  <button
                    onClick={() => {
                      const randHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
                      const newKey = `mtx_live_${randHex}`;
                      setApiKey(newKey);
                      showToast("New production API token generated successfully!", "success");
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    Generate New Production Token
                  </button>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed text-left">
                  This key is utilized to authenticate off-chain API requests against the consensus models directory. Keep it secure!
                </p>
                
                <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-2xl border border-zinc-200 gap-3">
                  <span className="font-mono text-xs text-cyan-600 truncate flex-1 select-all text-left">
                    {apiKey}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      setCopiedIndex(99);
                      setTimeout(() => setCopiedIndex(null), 2000);
                      showToast("Active Developer Access Key copied to clipboard!", "success");
                    }}
                    className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-500 hover:text-zinc-900 transition-all flex-shrink-0 cursor-pointer"
                  >
                    {copiedIndex === 99 ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
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
                    className="glass-panel p-6 rounded-3xl border border-zinc-200/80 shadow-[0_8px_32px_0_rgba(147,51,234,0.02)] bg-white/45 flex flex-col gap-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                        <Code className="w-4.5 h-4.5 text-purple-600" /> {snippet.title}
                      </span>
                      <button
                        onClick={() => copyCode(snippet.code, idx)}
                        className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
                      >
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <pre className="p-4 rounded-2xl bg-zinc-950/90 border border-white/5 font-mono text-[10px] text-zinc-300 leading-relaxed overflow-x-auto select-all text-left">
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
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.9, y: 30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25 } }}
                  exit={{ scale: 0.9, y: 30, opacity: 0 }}
                  className="relative w-full max-w-lg glass-panel bg-white border border-zinc-200 rounded-3xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)] flex flex-col gap-6"
                >
                  <button 
                    onClick={() => setPurchasedReceipt(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center gap-3 text-center mt-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-full bg-cyan-50 border border-cyan-500/30 flex items-center justify-center text-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    >
                      <CheckCircle className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-extrabold text-zinc-900">AI Model Unlocked Successfully</h3>
                      <p className="text-xs text-zinc-500 mt-1">Proof-of-inference transaction validated on MatrixBlocks Chain</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 bg-zinc-50 p-4.5 rounded-2xl border border-zinc-200/80 text-xs text-left">
                    <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                      <span className="text-zinc-500">Unlocking Target:</span>
                      <span className="font-semibold text-zinc-800">{purchasedReceipt.modelName}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                      <span className="text-zinc-500">Staked Settlement:</span>
                      <span className="font-bold text-cyan-600">{purchasedReceipt.pricePaidEth} ETH</span>
                    </div>
                    <div className="flex flex-col gap-1 py-1 border-b border-zinc-200">
                      <span className="text-zinc-500">Tx Hash:</span>
                      <span className="font-mono text-[10px] text-zinc-655 truncate">{purchasedReceipt.transactionHash}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-2">
                      <span className="text-zinc-500 font-semibold">🔑 Generated Access Token:</span>
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-zinc-200 gap-3">
                        <span className="font-mono text-[9px] text-cyan-600 truncate flex-1 select-all">
                          {purchasedReceipt.accessToken}
                        </span>
                        <button
                          onClick={() => copyToClipboard(purchasedReceipt.accessToken)}
                          className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-all flex-shrink-0 cursor-pointer"
                        >
                          {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setPurchasedReceipt(null)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-semibold text-xs uppercase tracking-wider text-white rounded-xl transition-all cursor-pointer"
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
            className="fixed top-6 right-6 z-[100] flex items-center gap-3.5 px-5 py-4 rounded-2xl glass-panel bg-white/90 backdrop-blur-xl border border-zinc-200/85 shadow-[0_10px_40px_rgba(0,0,0,0.06)] min-w-[320px] select-none text-left"
          >
            <div className={`p-2 rounded-xl bg-zinc-100 border border-zinc-200 ${
              toast.type === "success" 
                ? "text-emerald-600" 
                : toast.type === "warning" 
                  ? "text-amber-600" 
                  : "text-cyan-600"
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
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                {toast.type === "success" 
                  ? "Node Synced" 
                  : toast.type === "warning" 
                    ? "Telemetry Alert" 
                    : "Network Status"}
              </span>
              <p className="text-xs text-zinc-950 font-semibold leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={hideToast}
              className="text-zinc-400 hover:text-zinc-900 p-1 hover:bg-zinc-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
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
              className="w-96 h-[500px] rounded-3xl glass-panel bg-white/90 backdrop-blur-xl border border-zinc-200/85 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden text-zinc-900"
            >
              {/* Pop-up Header */}
              <div className="p-4.5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 shadow-md">
                    <span className="text-white font-extrabold text-sm">M</span>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white animate-pulse" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-extrabold text-zinc-900 tracking-wide">Matrix-Core Node-7</span>
                    <span className="text-[9px] text-zinc-500 font-medium">PoI Syncing: active</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFloatingChatOpen(false)}
                  className="text-zinc-500 hover:text-zinc-900 p-1.5 hover:bg-zinc-100 rounded-xl transition-colors focus:outline-none cursor-pointer"
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
                          ? "bg-zinc-200/60 text-zinc-900 shadow-sm rounded-tr-none font-medium text-left"
                          : "bg-purple-50/60 border border-purple-100 text-zinc-900 rounded-tl-none font-medium text-left"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className="text-[8px] text-zinc-400 mt-1 block text-right font-semibold">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none px-4 py-3 bg-purple-50/60 border border-purple-100 text-purple-650 text-xs flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                      <span className="animate-pulse tracking-wide font-medium">Decrypting response...</span>
                    </div>
                  </div>
                )}
                <div ref={floatingChatEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendFloatingMessage} className="p-3 border-t border-zinc-200 bg-zinc-50 flex gap-2">
                <input
                  type="text"
                  value={floatingInputText}
                  onChange={(e) => setFloatingInputText(e.target.value)}
                  placeholder="Query Matrix-Core node weights..."
                  className="flex-1 bg-white text-zinc-900 placeholder-zinc-450 rounded-xl px-4 py-2.5 text-xs border border-zinc-200 focus:border-purple-500/80 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!floatingInputText.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-40 disabled:hover:opacity-40 transition-all shadow-md focus:outline-none cursor-pointer"
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
          className={`w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-rose-500/20 hover:shadow-rose-500/35 relative border border-white/10 focus:outline-none z-50 cursor-pointer`}
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
  return `0xa8b16c6453a29e123a29331f08c69aa62429a26a${id}98f238ab3c98dc23bc98bc1982a01`;
}
