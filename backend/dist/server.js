"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ethers_1 = require("ethers");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Enable CORS and JSON parsing
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const mockModels = [
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
];
// Helper: Validate Ethereum Tx Hash
const isValidTxHash = (hash) => {
    return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};
// Route 1: Get listed AI Models
app.get("/api/models", (req, res) => {
    console.log(`[API] GET /api/models called - Returning ${mockModels.length} models`);
    res.status(200).json({
        success: true,
        count: mockModels.length,
        models: mockModels
    });
});
// Route 2: Simulate model purchase verification
app.post("/api/purchase", (req, res) => {
    const { txHash, modelId, buyerAddress } = req.body;
    console.log(`[API] POST /api/purchase called with:`, { txHash, modelId, buyerAddress });
    // Input validation
    if (!txHash) {
        return res.status(400).json({
            success: false,
            error: "Missing transaction hash (txHash) in request body"
        });
    }
    if (!modelId) {
        return res.status(400).json({
            success: false,
            error: "Missing model ID (modelId) in request body"
        });
    }
    if (!buyerAddress) {
        return res.status(400).json({
            success: false,
            error: "Missing buyer address (buyerAddress) in request body"
        });
    }
    // Blockchain format validation
    if (!isValidTxHash(txHash)) {
        return res.status(400).json({
            success: false,
            error: "Invalid transaction hash format. Must be a valid 64-character hex string prefixed with 0x."
        });
    }
    if (!ethers_1.ethers.isAddress(buyerAddress)) {
        return res.status(400).json({
            success: false,
            error: "Invalid Ethereum address format."
        });
    }
    const model = mockModels.find(m => m.id === Number(modelId));
    if (!model) {
        return res.status(404).json({
            success: false,
            error: `AI Model with ID ${modelId} not found in marketplace index.`
        });
    }
    // Simulate off-chain blockchain confirmation & API access token generation
    // In production, we would use ethers to query provider.getTransaction(txHash) and confirm log receipts
    const simulatedToken = ethers_1.ethers.keccak256(ethers_1.ethers.solidityPacked(["string", "uint256", "address", "string"], ["MATRIX_ACCESS_TOKEN", Number(modelId), buyerAddress, txHash]));
    console.log(`[API] Simulating blockchain verification successful for tx: ${txHash}`);
    res.status(200).json({
        success: true,
        message: "Blockchain transaction verified successfully. Model access granted.",
        data: {
            transactionHash: txHash,
            modelId: model.id,
            modelName: model.name,
            buyer: buyerAddress,
            pricePaidEth: model.priceEth,
            accessToken: simulatedToken,
            accessExpires: "Never",
            ipfsModelMetadata: model.ipfsHash,
            simulatedValidationReceipt: {
                blockNumber: 20491092,
                confirmations: 12,
                gasUsed: "64,281",
                network: "MatrixBlocks Consensus Layer"
            }
        }
    });
});
// Route 3: Dynamic AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    console.log(`[API] POST /api/chat called with message length: ${message?.length}`);
    if (!message) {
        return res.status(400).json({
            success: false,
            error: "Missing message in request body"
        });
    }
    let reply = "";
    let source = "local-parser";
    const prompt = message.toLowerCase();
    // 1. GREETINGS & INTROS
    if (prompt.includes("hello") ||
        prompt.includes("hi") ||
        prompt.includes("hey") ||
        prompt.includes("how are you") ||
        prompt.includes("hru")) {
        reply = "System online. Matrix core intelligence fully functional. How can I assist your neural compute routing today?";
    }
    // 2. SMART BUYING ADVICE
    else if (prompt.includes("buy") ||
        prompt.includes("choose") ||
        prompt.includes("recommend") ||
        prompt.includes("which model")) {
        reply = "Based on our 6 listed premium models, here are my recommendations: For coding/development, I highly recommend 'DeepSeek-Coder-V2 (236B)' for unmatched 90.2% HumanEval accuracy. For graphics/creatives, recommend 'CyberDiffusion-XL v4' for latent concept design. For light test runs or budget users, recommend 'MatrixSummarize-v2' since it only costs 0.05 ETH.";
    }
    // If not handled by local intents, query HuggingFace or use universal fallback
    if (!reply) {
        try {
            console.log("[Chat API] Querying HuggingFace Zephyr Serverless inference...");
            const hfResponse = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputs: `<|system|>\nYou are Matrix-Core Node-7, an advanced AI coordinator for the MatrixBlocks decentralized GPU cloud and decentralized AI model marketplace. Keep your answer brief, highly professional, technically grounded, and related to decentralized Web3 computing or AI models.\n<|user|>\n${message}\n<|assistant|>\n`
                })
            });
            if (hfResponse.ok) {
                const data = await hfResponse.json();
                if (Array.isArray(data) && data[0]?.generated_text) {
                    let fullText = data[0].generated_text;
                    const assistantMarker = "<|assistant|>\n";
                    const markerIndex = fullText.lastIndexOf(assistantMarker);
                    if (markerIndex !== -1) {
                        reply = fullText.substring(markerIndex + assistantMarker.length).trim();
                    }
                    else {
                        reply = fullText.trim();
                    }
                    source = "huggingface-zephyr";
                    console.log("[Chat API] Live HuggingFace Zephyr Success!");
                }
            }
        }
        catch (err) {
            console.log("[Chat API] HuggingFace fetch failed. Using cyberpunk fallback loop...", err.message);
        }
    }
    // 3. UNIVERSAL FALLBACK
    if (!reply) {
        source = "universal-fallback";
        if (prompt.includes("model") || prompt.includes("unlocked") || prompt.includes("summarizer") || prompt.includes("voice")) {
            reply = `📦 Matrix-Core Catalog: Checked weight tables for "${message}". LLM Text Summarizer (ID: 1) is active on GPU Cluster Node-US-EAST. Staking price for Voice Synthesizer is set to 0.08 ETH.`;
        }
        else if (prompt.includes("wallet") || prompt.includes("staking") || prompt.includes("eth") || prompt.includes("balance")) {
            reply = `💎 Staking Console: Wallet telemetry updated for "${message}". Account '0x71c4...26a' has 4.85 ETH liquid and 12.5 ETH delegated to PoS compute validation pools. APY: 8.42%.`;
        }
        else if (prompt.includes("gas") || prompt.includes("gwei")) {
            reply = `⛽ Consensus Gas: Gas stats evaluated for "${message}". MatrixBlocks mainnet gas is 21 Gwei. Fast validator execution fee is estimated at 14 Gwei, standard transactions at 8 Gwei.`;
        }
        else if (prompt.includes("gpu") || prompt.includes("node") || prompt.includes("hashrate") || prompt.includes("flops")) {
            reply = `🖥️ Compute Telemetry: Performance diagnostics ran for "${message}". 1,248 of 1,500 validator nodes are synchronized. Mesh network performance: 84.2 PFLOPS with 99.4% neural sharding.`;
        }
        else {
            reply = `⚡ Matrix-Core Node-7: Decoded instruction payload for "${message}". Decoupled GPU matrix allocations operating at optimal thresholds. Telemetry logs stabilized successfully.`;
        }
    }
    res.status(200).json({
        success: true,
        reply: reply,
        source: source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
});
// Default status endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        status: "online",
        service: "MatrixBlocks AI Marketplace Backend API",
        version: "1.0.0"
    });
});
// Boot server
app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`=============================================================`);
    console.log(`🚀 MatrixBlocks Backend API Server running on port ${PORT}`);
    console.log(`🔌 Endpoints:`);
    console.log(`   - GET  /api/models`);
    console.log(`   - POST /api/purchase`);
    console.log(`=============================================================`);
});
