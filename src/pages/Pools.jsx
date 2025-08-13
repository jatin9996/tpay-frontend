import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function Pools() {
    const [pools, setPools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("tvl");

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

    // Filter and sort pools
    const filteredAndSortedPools = pools
        .filter(pool => 
            pool.token0.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pool.token1.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "tvl":
                    return parseFloat(b.totalValueLockedUSD) - parseFloat(a.totalValueLockedUSD);
                case "volume":
                    return (b.volume24h || 0) - (a.volume24h || 0);
                case "name":
                    return a.token0.symbol.localeCompare(b.token0.symbol);
                default:
                    return 0;
            }
        });

    if (isLoading) {
        return (
            <div className="fade-in">
                <div className="page-header">
                    <h1 className="page-title">Liquidity Pools</h1>
                    <p className="page-subtitle">
                        Discover and explore the best liquidity pools with competitive rates
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
                        Discover and explore the best liquidity pools with competitive rates
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

            {/* Search and Filter Controls */}
            <div className="card mb-4">
                <div className="filters-container">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search pools by token symbol..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                            style={{ maxWidth: '300px' }}
                        />
                    </div>
                    <div className="sort-controls">
                        <label className="form-label" style={{ marginRight: '0.5rem' }}>Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="form-input"
                            style={{ maxWidth: '150px' }}
                        >
                            <option value="tvl">TVL (High to Low)</option>
                            <option value="volume">24h Volume</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Pools Summary */}
            <div className="pools-summary">
                <div className="summary-card">
                    <div className="summary-item">
                        <div className="summary-value">{pools.length}</div>
                        <div className="summary-label">Total Pools</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-value">
                            ${pools.reduce((total, pool) => total + parseFloat(pool.totalValueLockedUSD || 0), 0).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                        </div>
                        <div className="summary-label">Total TVL</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-value">
                            ${pools.reduce((total, pool) => total + (pool.volume24h || 0), 0).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                        </div>
                        <div className="summary-label">24h Volume</div>
                    </div>
                </div>
            </div>

            {/* Pools Grid */}
            {filteredAndSortedPools.length === 0 ? (
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">No Pools Found</h2>
                        <p className="card-subtitle">
                            {searchTerm ? `No pools match "${searchTerm}". Try a different search term.` : 'There are currently no liquidity pools. Be the first to create one!'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="pool-grid">
                    {filteredAndSortedPools.map((pool, i) => (
                        <div key={i} className="pool-card">
                            <div className="pool-header">
                                <div className="pool-tokens">
                                    <span className="token-symbol">{pool.token0.symbol}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>/</span>
                                    <span className="token-symbol">{pool.token1.symbol}</span>
                                </div>
                                <div className="pool-rank">
                                    #{i + 1}
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
