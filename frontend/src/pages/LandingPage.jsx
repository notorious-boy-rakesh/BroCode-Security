import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Key, Activity } from 'lucide-react';
import '../styles/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="logo-container">
          <Shield className="logo-icon" size={64} />
          <h1 className="logo-text">Bro Cipher</h1>
        </div>

        <h2 className="tagline">
          Brocode Security
        </h2>

        <p className="description">
          An educational end-to-end cryptographic chat simulation demonstrating real-world secure communication.
        </p>

        <button
          className="cyber-button start-btn"
          onClick={() => navigate('/setup')}
        >
          START SECURE CHAT
        </button>

        <div className="features-grid">
          <div className="feature-card">
            <Lock size={24} className="feature-icon" />
            <h3>AES-256-GCM</h3>
            <p>Authenticated symmetric encryption for message confidentiality and integrity.</p>
          </div>
          <div className="feature-card">
            <Key size={24} className="feature-icon" />
            <h3>RSA-OAEP</h3>
            <p>Secure asymmetric key wrapping to protect session keys during transit.</p>
          </div>
          <div className="feature-card">
            <Activity size={24} className="feature-icon" />
            <h3>Visual Journey</h3>
            <p>Watch your message travel through every cryptographic step.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
