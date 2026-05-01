import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // <-- CSS ko yahan import kiya hai

const LandingPage = () => {
  return (
    <div className="landing-container">
      
      {/* Navbar */}
      <nav className="landing-nav">
        <h1 className="nav-logo">
          RSA <span className="text-green">Platform</span>
        </h1>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="btn-signup">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-main">
        <h2 className="hero-title">
          Stuck on the Road?<br />
          <span className="text-green">We've Got Your Back.</span>
        </h2>
        
        <p className="hero-subtitle">
          Fast, reliable, and 24/7 roadside assistance at your fingertips. Get emergency help or join our network of professional mechanics.
        </p>
        
        <div className="hero-buttons">
          <Link to="/login" className="btn-primary">
            Get Emergency Help 🚨
          </Link>
          <Link to="/signup" className="btn-secondary">
            Join as Mechanic 👨‍🔧
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Roadside Assistance Platform.  Developed by Naman Wagadre.</p>
      </footer>
      
    </div>
  );
};

export default LandingPage;