import { useState } from "react";
import { Note } from "../../App";
import "../../styles/Sidebar.css";

interface SidebarProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string) => void;
}

const Sidebar = ({ notes, onNoteClick, onNewNote, onDeleteNote }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'about'>('notes');
  
  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <button 
          className={activeTab === 'notes' ? 'active' : ''}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>
      
      {activeTab === 'notes' && (
        <div className="notes-tab">
          <button className="new-note-button" onClick={onNewNote}>
            <i className="bi bi-journal-plus" style={{ fontSize: '24px' }}></i>New Note
          </button>
          
          <div className="note-list">
            {notes.length === 0 ? (
              <p className="no-notes">Henüz not oluşturmadınız.</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="sidebar-note-item">
                  <div 
                    className="note-title"
                    onClick={() => onNoteClick(note)}
                  >
                    {note.title || "İsimsiz Not"}
                  </div>
                  <button 
                    className="delete-note"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Bu notu silmek istediğinize emin misiniz?")) {
                        onDeleteNote(note.id);
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
