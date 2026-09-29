import React, { useState, useRef, useEffect } from 'react';
import { Send, Lock, CheckCircle2 } from 'lucide-react';
import { sendMessage } from '../services/api';

const ChatWindow = ({ currentUser, receiver, sessionData, messages, onTransfer }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusText, setStatusText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    setIsSending(true);
    const textToSend = inputMessage;
    setInputMessage('');
    
    try {
      // Simulate animation timeline
      setStatusText('Encrypting...');
      await new Promise(r => setTimeout(r, 400));
      setStatusText('🔒 Securing payload...');
      await new Promise(r => setTimeout(r, 400));
      setStatusText('🚀 Transmitting...');
      
      const transferResponse = await sendMessage(
        sessionData.sessionId,
        currentUser,
        receiver,
        textToSend
      );

      setStatusText('🔓 Decrypting...');
      await new Promise(r => setTimeout(r, 400));
      
      if(transferResponse.status === 'SUCCESS') {
        setStatusText('✓ Verified');
        onTransfer(transferResponse);
      }
      
      setTimeout(() => setStatusText(''), 1000);
    } catch (error) {
      console.error(error);
      setStatusText('⚠️ Encryption failed');
      setTimeout(() => setStatusText(''), 3000);
      setInputMessage(textToSend); // restore
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-window glass-panel">
      <div className="chat-window-header">
        <h3>{currentUser}</h3>
        <span className="subtitle">Talking to {receiver}</span>
      </div>

      <div className="messages-area">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.sender === currentUser ? 'sent' : 'received'}`}>
            <div className="message-bubble">
              <p>{msg.content}</p>
              <div className="message-meta">
                <span className="timestamp">{msg.timestamp}</span>
                {msg.sender === currentUser && (
                  <span className="security-icons">
                    <Lock size={12} />
                    <CheckCircle2 size={12} />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {statusText && (
          <div className="status-animation">
            {statusText}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="input-area">
        <input
          type="text"
          className="input-field message-input"
          placeholder={`Message ${receiver}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isSending}
        />
        <button 
          type="submit" 
          className="cyber-button send-btn"
          disabled={!inputMessage.trim() || isSending}
        >
          <Send size={18} /> SEND
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
