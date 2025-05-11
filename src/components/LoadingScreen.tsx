import React from "react";
import "../styles/LoadingScreen.css";
import notePadLogo from "../assets/rust.png";

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src={notePadLogo} alt="NotePad Logo" className="loading-logo" />
        <h1>NotePad</h1>
        <div className="loading-text">
          Loading Notes...
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
