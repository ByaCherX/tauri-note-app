import { useState, useEffect, useRef } from "react";
import { Note } from "../../App";
import "../../styles/NoteEditor.css";

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onClose: () => void;
  onChange: (note: Note) => void;
}

const NoteEditor = ({ note, onSave, onClose, onChange }: NoteEditorProps) => {
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [hexView, setHexView] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Convert text to hex representation
  const textToHex = (text: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const hex = text.charCodeAt(i).toString(16).padStart(2, '0');
      result += hex + ' ';
      if ((i + 1) % 16 === 0) result += '\n';
    }
    return result;
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange({
      ...note,
      content: e.target.value,
      last_modified: Date.now()
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onChange({
      ...note,
      title: e.target.value,
      last_modified: Date.now()
    });
  };

  const handleSave = () => {
    onSave({
      ...note,
      title,
      content,
      last_modified: Date.now()
    });
  };

  useEffect(() => {
    const handleCloseNote = () => {
      onClose();
    };

    window.addEventListener("close-note", handleCloseNote);
    
    // Listen for hex view toggle events from the menu
    const handleHexViewToggle = (e: CustomEvent) => {
      setHexView(e.detail);
    };
    
    window.addEventListener("toggle-hex-view" as any, handleHexViewToggle);

    return () => {
      window.removeEventListener("close-note", handleCloseNote);
      window.removeEventListener("toggle-hex-view" as any, handleHexViewToggle);
    };
  }, [onClose]);

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input 
          type="text" 
          value={title} 
          onChange={handleTitleChange}
          className="note-title-input"
          placeholder="Not başlığı..."
        />
        <button className="close-button" onClick={onClose}>✕</button>
      </div>
      
      <div className="editor-content">
        <textarea
          ref={textAreaRef}
          className="note-content-textarea"
          value={hexView ? textToHex(content) : content}
          onChange={handleContentChange}
          disabled={hexView}
          placeholder="Notunuzu buraya yazın..."
        />
      </div>
      
      <div className="editor-footer">
        <button className="save-button" onClick={handleSave}>
          Kaydet
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
