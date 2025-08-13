import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function PoolList() {
    const [pools, setPools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPools = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${BACKEND_URL}/data/pools`);
                setPools(res.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch pools:', err);
                setError('Failed to load pools. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPools();
    }, []);

    if (isLoading) {
        return (
            <div className="fade-in">
                <div className="page-header">
                    <h1 className="page-title">Liquidity Pools</h1>
                    <p className="page-subtitle">
                        Discover and explore the best liquidity pools
                    </p>
                </div>
                <div className="loading">
                    <div className="spinner"></div>
                    <span style={{ marginLeft: '1rem' }}>Loading pools...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fade-in">
                <div className="page-header">
                    <h1 className="page-title">Liquidity Pools</h1>
                    <p className="page-subtitle">
                        Discover and explore the best liquidity pools
                    </p>
                </div>
                <div className="message error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Liquidity Pools</h1>
                <p className="page-subtitle">
                    Discover and explore the best liquidity pools with competitive rates
                </p>
            </div>

            {pools.length === 0 ? (
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">No Pools Available</h2>
                        <p className="card-subtitle">
                            There are currently no liquidity pools. Be the first to create one!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="pool-grid">
                    {pools.map((pool, i) => (
                        <div key={i} className="pool-card">
                            <div className="pool-header">
                                <div className="pool-tokens">
                                    <span className="token-symbol">{pool.token0.symbol}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>/</span>
                                    <span className="token-symbol">{pool.token1.symbol}</span>
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>TVL:</span>
                                    <span className="pool-tvl">
                                        ${parseFloat(pool.totalValueLockedUSD).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </span>
                                </div>
                                
                                {pool.volume24h && (
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>24h Volume:</span>
                                        <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>
                                            ${parseFloat(pool.volume24h).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                )}
                                
                                {pool.fee && (
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Fee:</span>
                                        <span style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>
                                            {(parseFloat(pool.fee) * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                gap: '0.5rem', 
                                marginTop: '1rem' 
                            }}>
                                <button className="btn btn-primary" style={{ flex: 1 }}>
                                    Swap
                                </button>
                                <button className="btn btn-secondary" style={{ flex: 1 }}>
                                    Add Liquidity
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
