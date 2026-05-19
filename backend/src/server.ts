import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Mock AI Model database with premium metadata
interface AIModelMetadata {
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

const mockModels: AIModelMetadata[] = [
  {
    id: 1,
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
    id: 2,
    name: "Diffusion Art Generator (MatrixArt-v4)",
    description: "Latent text-to-image diffusion model capable of producing stunning 4K hyper-realistic digital artwork and abstract neural patterns.",
    category: "Computer Vision",
    creator: "0xf839446B8cd59a04E37A2066E0CDE915904F2F11",
    ipfsHash: "ipfs://QmY8A19v9YgA6vN6pG35xR9QjWp7TzQmXGTyTzTznk76U9",
    priceEth: "0.12",
    modelSize: "4.5 GB",
    parameters: "12B parameters",
    accuracy: "FID 8.4",
    license: "Creative Commons BY-NC"
  },
  {
    id: 3,
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
const isValidTxHash = (hash: string): boolean => {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};

// Route 1: Get listed AI Models
app.get("/api/models", (req: Request, res: Response) => {
  console.log(`[API] GET /api/models called - Returning ${mockModels.length} models`);
  res.status(200).json({
    success: true,
    count: mockModels.length,
    models: mockModels
  });
});

// Route 2: Simulate model purchase verification
app.post("/api/purchase", (req: Request, res: Response) => {
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

  if (!ethers.isAddress(buyerAddress)) {
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
  const simulatedToken = ethers.keccak256(
    ethers.solidityPacked(
      ["string", "uint256", "address", "string"],
      ["MATRIX_ACCESS_TOKEN", Number(modelId), buyerAddress, txHash]
    )
  );

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
app.post("/api/chat", async (req: Request, res: Response) => {
  const { message } = req.body;
  console.log(`[API] POST /api/chat called with message length: ${message?.length}`);

  if (!message) {
    return res.status(400).json({
      success: false,
      error: "Missing message in request body"
    });
  }

  let reply = "";
  let source = "local-fallback";

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
      const data: any = await hfResponse.json();
      if (Array.isArray(data) && data[0]?.generated_text) {
        let fullText = data[0].generated_text;
        const assistantMarker = "<|assistant|>\n";
        const markerIndex = fullText.lastIndexOf(assistantMarker);
        if (markerIndex !== -1) {
          reply = fullText.substring(markerIndex + assistantMarker.length).trim();
        } else {
          reply = fullText.trim();
        }
        source = "huggingface-zephyr";
        console.log("[Chat API] Live HuggingFace Zephyr Success!");
      } else {
        console.log("[Chat API] HuggingFace returned invalid response format:", data);
      }
    } else {
      console.log(`[Chat API] HuggingFace returned status: ${hfResponse.status}`);
    }
  } catch (err: any) {
    console.log("[Chat API] HuggingFace fetch failed. Using cyberpunk fallback loop...", err.message);
  }

  // Robust try-catch cyberpunk local fallback that NEVER ignores user inputs
  if (!reply) {
    console.log("[Chat API] Applying Layer 2 (Thematic Cyberpunk Dynamic Fallback)...");
    const prompt = message.toLowerCase();
    
    if (prompt.includes("hello") || prompt.includes("hi") || prompt.includes("hey")) {
      reply = `⚡ Matrix-Core Node-7: Handshake established for query regarding "${message}". Cryptographic stream is secure. How can I facilitate your model leases, GPU allocations, or consensus delegations today?`;
    } else if (prompt.includes("model") || prompt.includes("unlocked") || prompt.includes("summarizer") || prompt.includes("voice")) {
      reply = `📦 Matrix-Core Catalog: Checked weight tables for "${message}". LLM Text Summarizer (ID: 1) is active on GPU Cluster Node-US-EAST. Staking price for Voice Synthesizer is set to 0.08 ETH.`;
    } else if (prompt.includes("wallet") || prompt.includes("staking") || prompt.includes("eth") || prompt.includes("balance")) {
      reply = `💎 Staking Console: Wallet telemetry updated for "${message}". Account '0x71c4...26a' has 4.85 ETH liquid and 12.5 ETH delegated to PoS compute validation pools. APY: 8.42%.`;
    } else if (prompt.includes("gas") || prompt.includes("gwei")) {
      reply = `⛽ Consensus Gas: Gas stats evaluated for "${message}". MatrixBlocks mainnet gas is 21 Gwei. Fast validator execution fee is estimated at 14 Gwei, standard transactions at 8 Gwei.`;
    } else if (prompt.includes("gpu") || prompt.includes("node") || prompt.includes("hashrate") || prompt.includes("flops")) {
      reply = `🖥️ Compute Telemetry: Performance diagnostics ran for "${message}". 1,248 of 1,500 validator nodes are synchronized. Mesh network performance: 84.2 PFLOPS with 99.4% neural sharding.`;
    } else {
      reply = `⚡ Matrix-Core Node-7: Processed on-chain instruction for query regarding "${message}". Decoded consensus weights suggest nominal operations. Active telemetry is stable.`;
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
app.get("/", (req: Request, res: Response) => {
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
