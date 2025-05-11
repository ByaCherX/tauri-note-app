import React, { useState, useEffect } from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("00:00:00");
  const [status, setStatus] = useState<'preparing' | 'ready'>('preparing');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    // Update time immediately and then every second
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    // Set status to ready after 4 seconds
    const statusTimer = setTimeout(() => {
      setStatus('ready');
    }, 4000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(statusTimer);
    };
  }, []);
  
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <div className="clock">{currentTime}</div>
      </div>
      <div className="footer-right">
        <div className={`status-box ${status}`}>
          {status === 'preparing' ? 'Preparing' : 'Ready'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
