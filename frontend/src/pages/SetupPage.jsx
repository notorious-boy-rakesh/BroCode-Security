import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, ArrowRight } from 'lucide-react';
import { startSession } from '../services/api';
import '../styles/setup.css';

const SetupPage = ({ onSessionStart }) => {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user1.trim() || !user2.trim()) {
      setError('Both names are mandatory.');
      return;
    }
    if (user1.trim().toLowerCase() === user2.trim().toLowerCase()) {
      setError('Users must have different names.');
      return;
    }

    setLoading(true);
    try {
      const response = await startSession(user1.trim(), user2.trim());
      if (response.status === 'SUCCESS') {
        onSessionStart({
          sessionId: response.sessionId,
          user1: user1.trim(),
          user2: user2.trim()
        });
        navigate('/chat');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize secure session. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card glass-panel">
        <div className="setup-header">
          <Shield className="setup-icon" size={40} />
          <h2>Initialize Secure Session</h2>
          <p>Establish a cryptographic context between two users.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="user-input-group">
            <label>
              <User size={18} /> USER 1
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter User 1 Name"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="user-input-group">
            <label>
              <User size={18} /> USER 2
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter User 2 Name"
              value={user2}
              onChange={(e) => setUser2(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="cyber-button submit-btn"
            disabled={loading}
          >
            {loading ? 'GENERATING KEYS...' : 'START SECURE CHAT'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPage;
