import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import '../styles/components.css';

const SecurityStatus = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="security-status-container" onMouseLeave={() => setExpanded(false)}>
      <div 
        className="status-indicator"
        onMouseEnter={() => setExpanded(true)}
      >
        <span className="pulse-dot"></span>
        SECURE SESSION
      </div>
      
      {expanded && (
        <div className="status-dropdown glass-panel">
          <h3>Security Features</h3>
          <ul>
            <li><ShieldCheck size={16} className="text-success" /> AES-GCM Enabled</li>
            <li><ShieldCheck size={16} className="text-success" /> RSA-OAEP Key Protection</li>
            <li><ShieldCheck size={16} className="text-success" /> Authentication Tag Enabled</li>
            <li><ShieldCheck size={16} className="text-success" /> Secure Random IV per message</li>
            <li><ShieldCheck size={16} className="text-success" /> Input Validation Enabled</li>
            <li><ShieldCheck size={16} className="text-success" /> Private Keys Protected</li>
            <li><ShieldAlert size={16} className="text-warning" /> HTTPS Recommended for Deploy</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SecurityStatus;
