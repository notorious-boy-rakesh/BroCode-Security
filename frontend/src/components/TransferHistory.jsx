import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import TransferDetails from './TransferDetails';

const TransferHistory = ({ transfers, onClose }) => {
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  if (selectedTransfer) {
    return (
      <TransferDetails 
        transfer={selectedTransfer} 
        onBack={() => setSelectedTransfer(null)} 
        onClose={onClose}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel transfer-history">
        <div className="modal-header">
          <h2>Transfer History</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="transfers-list">
          {transfers.length === 0 ? (
            <div className="empty-state">No secure transfers yet.</div>
          ) : (
            transfers.map((t, idx) => (
              <div key={idx} className="transfer-card">
                <div className="transfer-header">
                  <span className="transfer-id">🔐 {t.transferId}</span>
                  <span className="transfer-time">{t.timestamp}</span>
                </div>
                <div className="transfer-route">
                  {t.sender} &rarr; {t.receiver}
                </div>
                <div className="transfer-tech">
                  <span className="tech-badge">{t.algorithm}</span>
                  <span className="tech-badge">{t.keyProtection}</span>
                </div>
                <div className="transfer-footer">
                  <span className={`status ${t.integrity === 'VALID' ? 'success' : 'error'}`}>
                    ✓ Integrity {t.integrity}
                  </span>
                  <button 
                    className="view-journey-btn"
                    onClick={() => setSelectedTransfer(t)}
                  >
                    VIEW JOURNEY
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferHistory;
