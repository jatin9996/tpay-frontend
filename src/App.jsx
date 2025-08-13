import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import WalletConnectButton from "./components/WalletConnectButton";
import Home from "./pages/Home";
import Pools from "./pages/Pools";
import SwapForm from "./components/SwapForm";
import LiquidityForm from "./components/LiquidityForm";
import NotFound from "./pages/NotFound";

// Navigation component with active state
function Navigation({ user, onConnected }) {
    const location = useLocation();
    
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand">
                    <span className="brand-icon">🚀</span>
                    <span className="brand-text">Tpay DEX</span>
                </Link>
                <div className="nav-links">
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                    >
                        <span className="nav-icon">🏠</span>
                        Home
                    </Link>
                    <Link 
                        to="/pools" 
                        className={`nav-link ${location.pathname === "/pools" ? "active" : ""}`}
                    >
                        <span className="nav-icon">🏊</span>
                        Pools
                    </Link>
                    <Link 
                        to="/swap" 
                        className={`nav-link ${location.pathname === "/swap" ? "active" : ""}`}
                    >
                        <span className="nav-icon">🔄</span>
                        Swap
                    </Link>
                    <Link 
                        to="/liquidity" 
                        className={`nav-link ${location.pathname === "/liquidity" ? "active" : ""}`}
                    >
                        <span className="nav-icon">💧</span>
                        Liquidity
                    </Link>
                    <WalletConnectButton onConnected={onConnected} />
                </div>
            </div>
        </nav>
    );
}

export default function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <div className="app">
                <Navigation user={user} onConnected={(addr, token) => setUser({ addr, token })} />
                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/pools" element={<Pools />} />
                        <Route path="/swap" element={<SwapForm />} />
                        <Route path="/liquidity" element={<LiquidityForm />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
