import React, { useState } from 'react';
import { Shield, Search } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';
import TransferHistory from '../components/TransferHistory';
import SecurityStatus from '../components/SecurityStatus';
import '../styles/chat.css';

const ChatPage = ({ sessionData }) => {
  const [transfers, setTransfers] = useState([]);
  const [showTransfers, setShowTransfers] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleNewTransfer = (transfer) => {
    setTransfers(prev => [transfer, ...prev]);
    if (transfer.status === 'SUCCESS') {
      setMessages(prev => [...prev, {
        id: transfer.transferId,
        sender: transfer.sender,
        receiver: transfer.receiver,
        content: transfer.finalMessage,
        timestamp: transfer.timestamp,
        status: 'VERIFIED'
      }]);
    }
  };

  return (
    <div className="chat-layout">
      <header className="chat-header glass-panel">
        <div className="header-logo">
          <Shield className="logo-icon" size={24} />
          <h2>BRO CIPHER CHAT</h2>
        </div>
        <SecurityStatus />
      </header>

      <main className="chat-main">
        <div className="windows-container">
          <ChatWindow 
            currentUser={sessionData.user1} 
            receiver={sessionData.user2}
            sessionData={sessionData}
            messages={messages}
            onTransfer={handleNewTransfer}
          />
          
          <div className="window-divider"></div>
          
          <ChatWindow 
            currentUser={sessionData.user2} 
            receiver={sessionData.user1}
            sessionData={sessionData}
            messages={messages}
            onTransfer={handleNewTransfer}
          />
        </div>
      </main>

      <div className="view-transfer-bar">
        <button 
          className="cyber-button view-transfer-btn"
          onClick={() => setShowTransfers(true)}
        >
          <Search size={18} /> VIEW TRANSFER DETAILS ({transfers.length})
        </button>
      </div>

      {showTransfers && (
        <TransferHistory 
          transfers={transfers} 
          onClose={() => setShowTransfers(false)} 
        />
      )}
    </div>
  );
};

export default ChatPage;
