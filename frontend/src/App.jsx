import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [sessionData, setSessionData] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/setup" 
            element={<SetupPage onSessionStart={setSessionData} />} 
          />
          <Route 
            path="/chat" 
            element={
              sessionData ? 
                <ChatPage sessionData={sessionData} /> : 
                <Navigate to="/setup" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
