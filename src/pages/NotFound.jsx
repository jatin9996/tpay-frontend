import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="fade-in">
            <div className="not-found-container">
                <div className="not-found-content">
                    <div className="not-found-icon">🚀</div>
                    <h1 className="not-found-title">404</h1>
                    <h2 className="not-found-subtitle">Page Not Found</h2>
                    <p className="not-found-description">
                        Oops! The page you're looking for doesn't exist. 
                        It might have been moved, deleted, or you entered the wrong URL.
                    </p>
                    <div className="not-found-actions">
                        <Link to="/" className="btn btn-primary btn-lg">
                            🏠 Go Home
                        </Link>
                        <Link to="/pools" className="btn btn-secondary btn-lg">
                            💧 View Pools
                        </Link>
                    </div>
                    <div className="not-found-help">
                        <p>Need help? Try these popular pages:</p>
                        <div className="help-links">
                            <Link to="/swap" className="help-link">Swap Tokens</Link>
                            <Link to="/liquidity" className="help-link">Add Liquidity</Link>
                            <Link to="/pools" className="help-link">Browse Pools</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
