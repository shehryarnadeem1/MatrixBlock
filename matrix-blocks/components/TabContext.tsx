"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Tab = "overview" | "marketplace" | "models" | "wallet" | "developer" | "chatbot";

export interface ToastState {
  show: boolean;
  message: string;
  type: "info" | "success" | "warning";
}

interface TabContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  toast: ToastState;
  showToast: (message: string, type?: "info" | "success" | "warning") => void;
  hideToast: () => void;
  web3Address: string | null;
  web3Balance: string;
  isWeb3Connected: boolean;
  isWeb3Connecting: boolean;
  connectWeb3: () => Promise<string | null>;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("marketplace");
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info"
  });
  
  // Real Web3/MetaMask connection states
  const [web3Address, setWeb3Address] = useState<string | null>(null);
  const [web3Balance, setWeb3Balance] = useState<string>("4.85 ETH");
  const [isWeb3Connected, setIsWeb3Connected] = useState<boolean>(false);
  const [isWeb3Connecting, setIsWeb3Connecting] = useState<boolean>(false);

  const showToast = (message: string, type: "info" | "success" | "warning" = "info") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const connectWeb3 = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setIsWeb3Connecting(true);
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts[0]) {
          const address = accounts[0];
          setWeb3Address(address);
          setIsWeb3Connected(true);
          
          try {
            const balanceHex = await (window as any).ethereum.request({
              method: "eth_getBalance",
              params: [address, "latest"]
            });
            if (balanceHex) {
              const wei = BigInt(balanceHex);
              const ethValue = Number(wei) / 1e18;
              setWeb3Balance(`${ethValue.toFixed(2)} ETH`);
            }
          } catch (balanceErr) {
            console.warn("Failed to retrieve balance, falling back to mock balance:", balanceErr);
            setWeb3Balance("4.85 ETH");
          }
          
          showToast("MetaMask Connected Successfully!", "success");
          return address;
        }
      } catch (err: any) {
        console.error("MetaMask connection error:", err);
        showToast(err.message || "MetaMask connection rejected", "warning");
      } finally {
        setIsWeb3Connecting(false);
      }
    } else {
      showToast("MetaMask not detected! Falling back to simulated wallet connection.", "info");
      setIsWeb3Connecting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const fallbackAddress = "0x71c46c6453a29e123a29331f08c69aa62429a26a";
      setWeb3Address(fallbackAddress);
      setWeb3Balance("4.85 ETH");
      setIsWeb3Connected(true);
      setIsWeb3Connecting(false);
      showToast("Simulated Web3 Wallet Connected!", "success");
      return fallbackAddress;
    }
    return null;
  };

  // Monitor MetaMask account changes or chain changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setWeb3Address(accounts[0]);
          setIsWeb3Connected(true);
          (window as any).ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"]
          }).then((balanceHex: string) => {
            if (balanceHex) {
              const wei = BigInt(balanceHex);
              const ethValue = Number(wei) / 1e18;
              setWeb3Balance(`${ethValue.toFixed(2)} ETH`);
            }
          }).catch(() => {
            setWeb3Balance("4.85 ETH");
          });
        } else {
          setWeb3Address(null);
          setIsWeb3Connected(false);
          setWeb3Balance("4.85 ETH");
        }
      };

      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
      
      // Auto-connect if already authorized
      (window as any).ethereum.request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            handleAccountsChanged(accounts);
          }
        }).catch(console.error);

      return () => {
        if ((window as any).ethereum.removeListener) {
          (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);
  
  return (
    <TabContext.Provider value={{ 
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
    }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error("useTab must be used within a TabProvider");
  }
  return context;
}
