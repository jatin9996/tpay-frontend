import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function SwapForm() {
    const [form, setForm] = useState({
        tokenIn: "",
        tokenOut: "",
        amountIn: "",
        recipient: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage(null);
    };

    const handleSwap = async () => {
        if (!form.tokenIn || !form.tokenOut || !form.amountIn || !form.recipient) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        setIsLoading(true);
        setMessage(null);
        
        try {
            const res = await axios.post(`${BACKEND_URL}/dex/swap`, form);
            setMessage({ 
                type: 'success', 
                text: `Swap successful! Transaction Hash: ${res.data.txHash}` 
            });
            setForm({ tokenIn: "", tokenOut: "", amountIn: "", recipient: "" });
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.error || err.message || 'Swap failed' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Swap Tokens</h1>
                <p className="page-subtitle">
                    Exchange tokens instantly with the best rates and lowest fees
                </p>
            </div>

            <div className="card swap-container">
                <div className="card-header">
                    <h2 className="card-title">Token Swap</h2>
                    <p className="card-subtitle">Enter the details for your token swap</p>
                </div>

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">Token In Address</label>
                    <input
                        name="tokenIn"
                        placeholder="0x..."
                        value={form.tokenIn}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="swap-arrow">⬇️</div>

                <div className="form-group">
                    <label className="form-label">Token Out Address</label>
                    <input
                        name="tokenOut"
                        placeholder="0x..."
                        value={form.tokenOut}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Amount In</label>
                    <input
                        name="amountIn"
                        type="number"
                        placeholder="0.0"
                        value={form.amountIn}
                        onChange={handleChange}
                        className="form-input"
                        step="0.000001"
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Recipient Address</label>
                    <input
                        name="recipient"
                        placeholder="0x..."
                        value={form.recipient}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <button
                    onClick={handleSwap}
                    disabled={isLoading}
                    className="btn btn-primary btn-lg btn-full"
                >
                    {isLoading ? (
                        <>
                            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                            Processing Swap...
                        </>
                    ) : (
                        'Execute Swap'
                    )}
                </button>
            </div>
        </div>
    );
}
