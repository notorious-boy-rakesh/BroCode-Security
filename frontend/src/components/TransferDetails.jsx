import React, { useState } from 'react';
import { ArrowLeft, X, ChevronDown, ChevronUp } from 'lucide-react';

const TransferDetails = ({ transfer, onBack, onClose }) => {
  const [expandedStep, setExpandedStep] = useState(null);

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel transfer-details-modal">
        <div className="modal-header">
          <h2>Transfer {transfer.transferId} Journey</h2>
          <button className="icon-btn" onClick={onBack} title="Close Journey"><X size={24} /></button>
        </div>

        <div className="transfer-summary">
          <div className="route-box">
            <span className="user-label">SENDER</span>
            <span className="user-name">{transfer.sender}</span>
          </div>
          <div className="route-arrow">&rarr;</div>
          <div className="route-box">
            <span className="user-label">RECEIVER</span>
            <span className="user-name">{transfer.receiver}</span>
          </div>
        </div>

        <div className="timeline-container">
          {transfer.steps.map((step, idx) => (
            <div key={idx} className="timeline-step">
              <div className="step-connector">
                <div className="step-dot"></div>
                {idx < transfer.steps.length - 1 && <div className="step-line"></div>}
              </div>
              <div 
                className={`step-content glass-panel ${expandedStep === idx ? 'expanded' : ''}`}
                onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
              >
                <div className="step-header">
                  <h3>{step.stepName}</h3>
                  <div className="step-header-right">
                    <span className="step-algo">{step.algorithm}</span>
                    {expandedStep === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                
                {expandedStep === idx && (
                  <div className="step-details">
                    <p className="step-desc">{step.description}</p>
                    <div className="code-block mono-text">
                      {step.details}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransferDetails;
