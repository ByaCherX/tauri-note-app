import React, { useState } from 'react';
import { getCurrentWindow as appWindow } from "@tauri-apps/api/window";
import "../styles/TitleBar.css";
import Logo from "../assets/rust.png";
import "bootstrap-icons/font/bootstrap-icons.css"

interface TitleBarProps {
  title: string;
  onOpenNotepad?: () => void;
  onOpenAbout?: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, onOpenNotepad, onOpenAbout }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  const handleMinimize = async () => {
    await appWindow().minimize();
  };

  const handleMaximize = async () => {
    if (await appWindow().isMaximized()) {
      await appWindow().unmaximize();
    } else {
      await appWindow().maximize();
    }
  };

  const handleClose = async () => {
    await appWindow().close();
  };

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleOpenNotepad = () => {
    if (onOpenNotepad) {
      onOpenNotepad();
    }
    setActiveMenu(null);
  };

  const handleOpenAbout = () => {
    if (onOpenAbout) {
      onOpenAbout();
    }
    setActiveMenu(null);
  };

  const openGithub = () => {
    // Opens the GitHub repository in the default browser
    window.open("https://github.com/ByaCherX", "notepad-github");
  };

  return (
    <div className="titlebar">
      <div className="titlebar-drag-region">
        <div className="window-icon">
          <img src={Logo} alt=" " />
        </div>
        <div className="window-title">{title}</div>
        
        <div className="titlebar-menu">
          <div 
            className="menu-item" 
            onMouseEnter={() => handleMouseEnter('windows')}
            onMouseLeave={handleMouseLeave}
          >
            <button>Pencereler</button>
            {activeMenu === 'windows' && (
              <div className="menu-dropdown hover-dropdown">
                <button onClick={handleOpenNotepad}>NotePad</button>
              </div>
            )}
          </div>

          <div 
            className="menu-item"
            onMouseEnter={() => handleMouseEnter('settings')}
            onMouseLeave={handleMouseLeave}
          >
            <button>Settings</button>
            {activeMenu === 'settings' && (
              <div className="menu-dropdown hover-dropdown">
                <button>Genel</button>
                <button>Tema</button>
                <button onClick={handleOpenAbout}>Hakkında</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="window-controls">
        <button className="window-control minimize" onClick={handleMinimize}>
          <i className="bi bi-dash-lg"></i>
        </button>
        <button className="window-control maximize" onClick={handleMaximize}>
          <i className="bi bi-arrows-fullscreen"></i>
        </button>
        <button className="window-control close" onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;