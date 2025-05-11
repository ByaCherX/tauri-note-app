import React from "react";
import { Note } from "../../App";
import "../../styles/NoteList.css";

interface NoteListProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onNoteClick, onDeleteNote }) => {
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="note-list-container">
      <h2>Notlar</h2>
      
      {notes.length === 0 ? (
        <p className="no-notes">Henüz hiç not oluşturmadınız.</p>
      ) : (
        <div className="note-grid">
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-card-content" onClick={() => onNoteClick(note)}>
                <h3 className="note-title">{note.title}</h3>
                <div className="note-preview">
                  {note.content.length > 100
                    ? `${note.content.substring(0, 100)}...`
                    : note.content}
                </div>
                <div className="note-date">
                  {formatDate(note.last_modified)}
                </div>
              </div>
              <button 
                className="delete-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
