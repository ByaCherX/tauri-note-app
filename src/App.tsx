import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Header from "./components/Header";
import NoteList from "./components/notepad/NoteList";
import NoteEditor from "./components/notepad/NoteEditor";
import Sidebar from "./components/notepad/Sidebar";
import LoadingScreen from "./components/LoadingScreen";
import TitleBar from "./components/TitleBar";
import About from "./components/About";
import Footer from "./components/Footer";

export interface Note {
  id: string;
  title: string;
  content: string;
  last_modified: number;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [modified, setModified] = useState(false);
  const [loadedData, setLoadedData] = useState<Note[] | null>(null);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Fetch notes on component mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        // Fetch data immediately but don't update the UI yet
        const fetchedNotes = await invoke<Note[]>("get_notes");
        setLoadedData(fetchedNotes); // Store the fetched data
      } catch (error) {
        console.error("Failed to load notes:", error);
        setLoadedData([]); // Set empty array in case of error
      }
    };
    
    loadNotes();
  }, []);

  // Handle the loading animation timing separately
  useEffect(() => {
    if (loadedData === null) return; // Wait until data is fetched
    
    // Ensure the loading screen stays visible for the full animation duration
    const loadingTimer = setTimeout(() => {
      setNotes(loadedData);
      setIsLoading(false);
    }, 2000); // 2 saniye olarak değiştirildi
    
    return () => clearTimeout(loadingTimer);
  }, [loadedData]);

  const handleNoteClick = (note: Note) => {
    setActiveNote(note);
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setActiveNote(null);
    setModified(false);
  };

  const handleSave = async (updatedNote: Note) => {
    try {
      await invoke("save_note", { note: updatedNote });
      
      setNotes(prevNotes => {
        const noteIndex = prevNotes.findIndex(note => note.id === updatedNote.id);
        if (noteIndex !== -1) {
          const newNotes = [...prevNotes];
          newNotes[noteIndex] = updatedNote;
          return newNotes;
        }
        return [...prevNotes, updatedNote];
      });
      
      setActiveNote(updatedNote);
      setModified(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu notu silmek istediğinize emin misiniz?")) {
      try {
        await invoke("delete_note", { id });
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        if (activeNote?.id === id) {
          setActiveNote(null);
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Yeni Not",
      content: "",
      last_modified: Date.now()
    };
    
    setActiveNote(newNote);
    setIsEditing(true);
    setModified(true);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleNoteChange = (updatedNote: Note) => {
    setActiveNote(updatedNote);
    setModified(true);
  };

  const handleOpenNotepad = () => {
    setShowNotepad(true);
    setShowAbout(false);
  };

  const handleOpenAbout = () => {
    setShowAbout(true);
    setShowNotepad(false);
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-container">
      <TitleBar 
        title="NotePad App" 
        onOpenNotepad={handleOpenNotepad}
        onOpenAbout={handleOpenAbout}
      />
      
      {showAbout && <About onClose={handleCloseAbout} />}
      
      {showNotepad && !showAbout && (
        <>
          <Header 
            toggleSidebar={toggleSidebar}
            isEditing={isEditing}
            activeNote={activeNote}
            onSave={() => activeNote && handleSave(activeNote)}
            modified={modified}
          />
          
          <div className="main-content">
            {sidebarVisible && (
              <Sidebar 
                notes={notes}
                onNoteClick={handleNoteClick}
                onNewNote={createNewNote}
                onDeleteNote={handleDelete}
              />
            )}
            
            <div className="content-area">
              {isEditing && activeNote ? (
                <NoteEditor 
                  note={activeNote}
                  onSave={handleSave}
                  onClose={handleClose}
                  onChange={handleNoteChange}
                />
              ) : (
                <NoteList 
                  notes={notes}
                  onNoteClick={handleNoteClick}
                  onDeleteNote={handleDelete}
                />
              )}
            </div>
          </div>
          
          <Footer />
        </>
      )}
      
      {!showNotepad && !showAbout && (
        <>
          <div className="welcome-screen">
            <h1>NotePad'e Hoşgeldiniz</h1>
            <p>Başlamak için yukarıdan "Pencereler" menüsünü açın.</p>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
