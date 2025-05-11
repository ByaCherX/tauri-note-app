import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { Note } from "../App";
import "../styles/Header.css";

interface HeaderProps {
  toggleSidebar: () => void;
  isEditing: boolean;
  activeNote: Note | null;
  onSave: () => void;
  modified: boolean;
}

const Header = ({ toggleSidebar, isEditing, activeNote, onSave, modified }: HeaderProps) => {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [__recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hexView, setHexView] = useState(false);

  const toggleFileMenu = () => {
    setFileMenuOpen(!fileMenuOpen);
    setEditMenuOpen(false);
    setViewMenuOpen(false);
  };

  const toggleEditMenu = () => {
    setEditMenuOpen(!editMenuOpen);
    setFileMenuOpen(false);
    setViewMenuOpen(false);
  };

  const toggleViewMenu = () => {
    setViewMenuOpen(!viewMenuOpen);
    setFileMenuOpen(false);
    setEditMenuOpen(false);
  };

  const closeAllMenus = () => {
    setFileMenuOpen(false);
    setEditMenuOpen(false);
    setViewMenuOpen(false);
  };

  const handleOpenFile = async () => {
    try {
      // Eğer aktif bir not varsa ve değişiklikler yapılmışsa
      if (activeNote && modified) {
        const shouldSave = window.confirm("Mevcut nottaki değişiklikleri kaydetmek istiyor musunuz?");
        
        if (shouldSave) {
          // Kullanıcı değişiklikleri kaydetmek istiyorsa
          onSave();
        }
      }
      
      // Dosya seçim dialogunu aç
      const selected = await open({
        multiple: false,
        filters: [{
          name: "Text Files",
          extensions: ["txt", "md", "js", "ts", "html", "css"]
        }]
      });
      
      // Kullanıcı bir dosya seçtiyse
      if (selected && !Array.isArray(selected)) {
        try {
          // Seçilen dosyanın içeriğini oku
          const content = await invoke<string>("read_file", { path: selected });
          
          // Dosya adını yoldan çıkart
          const fileName = selected.split(/[/\\]/).pop() || "Imported File";
          
          // Yeni not oluştur
          const newNote: Note = {
            id: crypto.randomUUID(),
            title: fileName,
            content,
            last_modified: Date.now()
          };
          
          // Eğer aktif bir not varsa, önce onu kapatın
          if (activeNote) {
            window.dispatchEvent(new CustomEvent("close-note"));
          }
          
          // Notu kaydet
          await invoke("save_note", { note: newNote });
          
          // Sayfayı yenile (not listesini güncellemek için)
          window.location.reload();
        } catch (error) {
          console.error("Dosya okuma hatası:", error);
          alert("Dosya okunamadı: " + error);
        }
      }
      closeAllMenus();
    } catch (error) {
      console.error("Dosya açma hatası:", error);
    }
  };

  const handleSaveAs = async () => {
    if (!activeNote) {
      alert("Kaydedilecek not yok!");
      return;
    }
    
    try {
      // Varsayılan dosya adı olarak notun başlığını kullan
      const suggestedName = activeNote.title || "Unnamed Note";
      
      // Dosya kayıt dialogunu aç
      const filePath = await save({
        defaultPath: `${suggestedName}.txt`,
        filters: [{
          name: "Text Files",
          extensions: ["txt"]
        }]
      });
      
      // Kullanıcı bir konum seçtiyse
      if (filePath) {
        try {
          // Dosyayı belirtilen konuma yaz
          await invoke("write_file", { 
            path: filePath, 
            content: activeNote.content 
          });
          alert("Dosya başarıyla kaydedildi!");
        } catch (error) {
          console.error("Dosya yazma hatası:", error);
          alert("Dosya kaydedilemedi: " + error);
        }
      }
      closeAllMenus();
    } catch (error) {
      console.error("Dosya kaydetme hatası:", error);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    closeAllMenus();
  };

  const toggleHexView = () => {
    setHexView(!hexView);
    // Hex görünümünü değiştiren bir event gönderelim
    window.dispatchEvent(new CustomEvent("toggle-hex-view", { detail: !hexView }));
    closeAllMenus();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        onSave();
      }
      if (event.ctrlKey && event.key === "c") {
        event.preventDefault();
        if (isEditing && activeNote) {
          // Close note
          window.dispatchEvent(new CustomEvent("close-note"));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, isEditing, activeNote]);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <i className="bi bi-layout-sidebar-inset"></i>
        </button>
        <h1>Not Defteri</h1>
        {modified && <span className="modified-indicator"><i className="bi bi-journal-text" style={{ fontSize: '24px' }}></i></span>}
      </div>
      
      {isEditing && (
        <div className="menu-bar">
          <div className="menu-item">
            <button onClick={toggleFileMenu}>Dosya</button>
            {fileMenuOpen && (
              <div className="dropdown-menu">
                <button onClick={handleOpenFile}>Open</button>
                <button onClick={() => { setRecentNotes([]); closeAllMenus(); }}>En Son</button>
                <button onClick={() => { onSave(); closeAllMenus(); }}>Kaydet</button>
                <button onClick={handleSaveAs}>Farklı Kaydet</button>
                <button 
                  onClick={() => { 
                    window.dispatchEvent(new CustomEvent("close-note")); 
                    closeAllMenus(); 
                  }}
                >
                  Kapat
                </button>
              </div>
            )}
          </div>
          
          <div className="menu-item">
            <button onClick={toggleEditMenu}>Düzenle</button>
            {editMenuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => { window.history.back(); closeAllMenus(); }}>Geri Al</button>
                <button onClick={toggleSearch}>Bul</button>
                <button onClick={() => closeAllMenus()}>Yazı Tipi</button>
              </div>
            )}
          </div>
          
          <div className="menu-item">
            <button onClick={toggleViewMenu}>Görünüm</button>
            {viewMenuOpen && (
              <div className="dropdown-menu">
                <button onClick={toggleHexView}>
                  {hexView ? "Normal Görünüm" : "View Hexadecimal"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {searchOpen && (
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setSearchOpen(false)}>X</button>
        </div>
      )}
    </header>
  );
};

export default Header;
