import React, { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { BACKEND_URL, ENABLE_BACKEND, DEBUG_MODE } from "../config";

export default function WalletConnectButton({ onConnected }) {
    const [address, setAddress] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);

    // Test function to generate a signature without wallet connection
    const testSignatureGeneration = async () => {
        try {
            console.log("Testing signature generation...");
            
            // Create a test wallet
            const testPrivateKey = "0x1234567890123456789012345678901234567890123456789012345678901234";
            const testWallet = new ethers.Wallet(testPrivateKey);
            
            const testMessage = "Test message for signature verification";
            const testSignature = await testWallet.signMessage(testMessage);
            
            console.log("Test signature generated:");
            console.log("Message:", testMessage);
            console.log("Signature:", testSignature);
            console.log("Signature length:", testSignature.length);
            console.log("Signature starts with 0x:", testSignature.startsWith('0x'));
            
            // Try to verify
            const recovered = ethers.verifyMessage(testMessage, testSignature);
            console.log("Recovered address:", recovered);
            console.log("Expected address:", testWallet.address);
            
            alert(`Test signature successful! Length: ${testSignature.length}, Recovered: ${recovered}`);
        } catch (err) {
            console.error("Test signature error:", err);
            alert(`Test signature failed: ${err.message}`);
        }
    };

    const connectWallet = async () => {
        if (isConnecting) return;
        
        setIsConnecting(true);
        try {
            if (DEBUG_MODE) console.log("Starting wallet connection...");
            if (DEBUG_MODE) console.log("Backend enabled:", ENABLE_BACKEND);
            if (DEBUG_MODE) console.log("Backend URL:", BACKEND_URL);
            
            // Check if MetaMask is available
            if (typeof window.ethereum === 'undefined') {
                throw new Error("No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.");
            }

            // Try to connect directly to MetaMask first
            let provider;
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length === 0) {
                    throw new Error("No accounts found");
                }
                
                provider = new ethers.BrowserProvider(window.ethereum);
                console.log("Connected to MetaMask");
            } catch (metamaskError) {
                console.log("MetaMask connection failed, trying Web3Modal...", metamaskError);
                
                // Fallback to Web3Modal
                const web3Modal = new Web3Modal({
                    network: "mainnet",
                    cacheProvider: true,
                    providerOptions: {}
                });
                
                const connection = await web3Modal.connect();
                provider = new ethers.BrowserProvider(connection);
                console.log("Connected via Web3Modal");
            }
            
            console.log("Provider created:", provider);
            
            const signer = await provider.getSigner();
            console.log("Signer obtained");
            
            const addr = await signer.getAddress();
            console.log("Signer address:", addr);

            const message = "Login to Tpay DEX Demo";
            console.log("Signing message:", message);
            
            console.log("About to sign message...");
            const signature = await signer.signMessage(message);
            console.log("Generated signature:", signature);
            console.log("Signature length:", signature.length);

            // Validate signature format
            if (!signature || typeof signature !== 'string' || !signature.startsWith('0x')) {
                throw new Error("Invalid signature format generated");
            }

            console.log("Signature validation passed");

            // Try to connect to backend if enabled, but don't fail if backend is not available
            if (ENABLE_BACKEND) {
                try {
                    if (DEBUG_MODE) console.log("Attempting to connect to backend...");
                    const res = await axios.post(`${BACKEND_URL}/auth/login`, {
                        address: addr,
                        message,
                        signature
                    }, {
                        timeout: 5000 // 5 second timeout
                    });

                    if (DEBUG_MODE) console.log("Backend response:", res.data);

                    if (res.data.success) {
                        setAddress(addr);
                        onConnected(addr, res.data.token);
                        return;
                    }
                } catch (backendError) {
                    if (DEBUG_MODE) console.warn("Backend connection failed, proceeding with local connection:", backendError.message);
                    
                    // If backend is not available, still connect locally
                    if (backendError.code === 'ECONNREFUSED' || backendError.message.includes('Network Error')) {
                        if (DEBUG_MODE) console.log("Backend not available, connecting locally...");
                        setAddress(addr);
                        onConnected(addr, "local-token");
                        return;
                    }
                    
                    // Re-throw other backend errors
                    throw backendError;
                }
            } else {
                // Backend is disabled, connect locally
                if (DEBUG_MODE) console.log("Backend disabled, connecting locally...");
                setAddress(addr);
                onConnected(addr, "local-token");
                return;
            }

            // If we get here, something went wrong
            throw new Error("Failed to complete wallet connection");

        } catch (err) {
            console.error("Wallet connection error:", err);
            
            // More specific error messages
            if (err.message.includes("User rejected") || err.message.includes("User denied")) {
                alert("Wallet connection was cancelled by user.");
            } else if (err.message.includes("No Ethereum wallet detected")) {
                alert("Please install MetaMask or another Web3 wallet to connect.");
            } else if (err.message.includes("No accounts found")) {
                alert("No accounts found in your wallet. Please unlock your wallet and try again.");
            } else if (err.message.includes("signature")) {
                alert("Signature generation failed. Please try again.");
            } else {
                alert(`Failed to connect wallet: ${err.message}`);
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAddress("");
        onConnected(null, null);
    };

    if (address) {
        return (
            <div className="wallet-info">
                <button 
                    className="wallet-button connected"
                    onClick={disconnectWallet}
                    title="Click to disconnect"
                >
                    <span className="wallet-status-icon">🔗</span>
                    <span className="wallet-address">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                    <span className="wallet-disconnect-hint">Disconnect</span>
                </button>
            </div>
        );
    }

    return (
        <div className="wallet-connect-container">
            <button 
                className={`wallet-button ${isConnecting ? 'connecting' : ''}`}
                onClick={connectWallet}
                disabled={isConnecting}
            >
                {isConnecting ? (
                    <>
                        <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                        <span className="connecting-text">Connecting...</span>
                    </>
                ) : (
                    <>
                        <span className="wallet-connect-icon">🔌</span>
                        <span className="connect-text">Connect Wallet</span>
                    </>
                )}
            </button>
            
            {/* Debug button for testing signature generation */}
            <button 
                className="test-button"
                onClick={testSignatureGeneration}
                style={{ 
                    marginLeft: '10px', 
                    padding: '8px 12px', 
                    fontSize: '12px',
                    backgroundColor: '#666',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Test Signature
            </button>
        </div>
    );
}
