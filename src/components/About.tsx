import React from 'react';
import '../styles/About.css';
import Logo from "../assets/rust.png";

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  return (
    <div className="about-page">
      <div className="about-container">
        <button className="about-close-button" onClick={onClose}>✕</button>
        
        <div className="about-header">
          <img src={Logo} alt="Logo" className="about-logo" />
          <h1>Tauri Note App</h1>
          <div className="version">Version 0.0.0</div>
        </div>
        
        <div className="about-content">
          <section className="about-section">
            <h2>Hakkında</h2>
            <p>
              Tauri Note App, modern ve kullanıcı dostu bir not alma uygulamasıdır. 
              Notlarınızı organize etmenize, düzenlemenize ve her cihazda erişilebilir 
              kılmanıza olanak tanır.
            </p>
          </section>
          
          <section className="about-section">
            <h2>Özellikler</h2>
            <ul>
              <li>Hızlı not oluşturma ve düzenleme</li>
              <li>Güvenli, yerel depolama</li>
              <li>Tauri ile multi-platform destek</li>
              <li>Modern tasarım ve animasyonlar</li>
              <li>Kolay kullanılabilir arayüz</li>
              <li>Dosya içe/dışa aktarma</li>
            </ul>
          </section>
          
          <section className="about-section">
            <h2>Techs</h2>
            <div className="tech-stack">
              <div className="tech-item">
                <div className="tech-icon">⚛️</div>
                <div className="tech-name">React</div>
              </div>
              <div className="tech-item">
                <div className="tech-icon">🦀</div>
                <div className="tech-name">Rust</div>
              </div>
              <div className="tech-item">
                <div className="tech-icon"><svg role="img" height={ 32 } width={ 32 } fill='#2466c9' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>TypeScript</title><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg></div>
                <div className="tech-name">TypeScript</div>
              </div>
              <div className="tech-item">
                <div className="tech-icon">📦</div>
                <div className="tech-name">Tauri</div>
              </div>
              <div className="tech-item">
                <div className="tech-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-browser-edge" viewBox="0 0 16 16">
                    <path d="M9.482 9.341c-.069.062-.17.153-.17.309 0 .162.107.325.3.456.877.613 2.521.54 2.592.538h.002c.667 0 1.32-.18 1.894-.519A3.84 3.84 0 0 0 16 6.819c.018-1.316-.44-2.218-.666-2.664l-.04-.08C13.963 1.487 11.106 0 8 0A8 8 0 0 0 .473 5.29C1.488 4.048 3.183 3.262 5 3.262c2.83 0 5.01 1.885 5.01 4.797h-.004v.002c0 .338-.168.832-.487 1.244l.006-.006z"/>
                    <path d="M.01 7.753a8.14 8.14 0 0 0 .753 3.641 8 8 0 0 0 6.495 4.564 5 5 0 0 1-.785-.377h-.01l-.12-.075a5.5 5.5 0 0 1-1.56-1.463A5.543 5.543 0 0 1 6.81 5.8l.01-.004.025-.012c.208-.098.62-.292 1.167-.285q.194.001.384.033a4 4 0 0 0-.993-.698l-.01-.005C6.348 4.282 5.199 4.263 5 4.263c-2.44 0-4.824 1.634-4.99 3.49m10.263 7.912q.133-.04.265-.084-.153.047-.307.086z"/>
                    <path d="M10.228 15.667a5 5 0 0 0 .303-.086l.082-.025a8.02 8.02 0 0 0 4.162-3.3.25.25 0 0 0-.331-.35q-.322.168-.663.294a6.4 6.4 0 0 1-2.243.4c-2.957 0-5.532-2.031-5.532-4.644q.003-.203.046-.399a4.54 4.54 0 0 0-.46 5.898l.003.005c.315.441.707.821 1.158 1.121h.003l.144.09c.877.55 1.721 1.078 3.328.996"/>
                  </svg>
                </div>
                <div className="tech-name">Webview2</div>
              </div>
            </div>
          </section>
          
          <section className="about-section credits">
            <h2>Emre Kayal</h2>
            <p>
              Copyright © 2025 - Tüm Hakları Saklıdır.
            </p>
            <div className="social-links">
              <a href="https://github.com/ByaCherX" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="bi bi-github"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
