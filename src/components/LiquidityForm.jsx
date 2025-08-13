import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function LiquidityForm() {
    const [form, setForm] = useState({
        token0: "",
        token1: "",
        amount0: "",
        amount1: "",
        recipient: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage(null);
    };

    const handleAddLiquidity = async () => {
        if (!form.token0 || !form.token1 || !form.amount0 || !form.amount1 || !form.recipient) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        setIsLoading(true);
        setMessage(null);
        
        try {
            const res = await axios.post(`${BACKEND_URL}/liquidity/add-liquidity`, form);
            setMessage({ 
                type: 'success', 
                text: `Liquidity added successfully! Transaction Hash: ${res.data.txHash}` 
            });
            setForm({ token0: "", token1: "", amount0: "", amount1: "", recipient: "" });
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.error || err.message || 'Failed to add liquidity' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Add Liquidity</h1>
                <p className="page-subtitle">
                    Provide liquidity to earn trading fees and rewards
                </p>
            </div>

            <div className="card liquidity-container">
                <div className="card-header">
                    <h2 className="card-title">Liquidity Pool</h2>
                    <p className="card-subtitle">Create a new liquidity pool or add to existing one</p>
                </div>

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="liquidity-pair">
                    <div className="form-group">
                        <label className="form-label">Token 0 Address</label>
                        <input
                            name="token0"
                            placeholder="0x..."
                            value={form.token0}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Token 1 Address</label>
                        <input
                            name="token1"
                            placeholder="0x..."
                            value={form.token1}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="liquidity-pair">
                    <div className="form-group">
                        <label className="form-label">Amount 0</label>
                        <input
                            name="amount0"
                            type="number"
                            placeholder="0.0"
                            value={form.amount0}
                            onChange={handleChange}
                            className="form-input"
                            step="0.000001"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount 1</label>
                        <input
                            name="amount1"
                            type="number"
                            placeholder="0.0"
                            value={form.amount1}
                            onChange={handleChange}
                            className="form-input"
                            step="0.000001"
                            min="0"
                        />
                    </div>
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
                    onClick={handleAddLiquidity}
                    disabled={isLoading}
                    className="btn btn-success btn-lg btn-full"
                >
                    {isLoading ? (
                        <>
                            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                            Adding Liquidity...
                        </>
                    ) : (
                        'Add Liquidity'
                    )}
                </button>
            </div>
        </div>
    );
}
