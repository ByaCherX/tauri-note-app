// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{App, AppHandle, Manager};
use std::sync::Arc;
use std::collections::HashMap;
use tauri::async_runtime::Mutex;


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Note {
    id: String,
    title: String,
    content: String,
    last_modified: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChatMessage {
    id: String,
    sender: String,
    content: String,
    timestamp: u64,
    is_sent: bool,
}

#[tauri::command]
async fn get_notes(app_handle: AppHandle) -> Result<Vec<Note>, String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let notes_dir = app_dir.join("notes");
    
    if !notes_dir.exists() {
        fs::create_dir_all(&notes_dir).map_err(|e| e.to_string())?;
    }
    
    let mut notes = Vec::new();
    
    match fs::read_dir(&notes_dir) {
        Ok(entries) => {
            for entry in entries {
                if let Ok(entry) = entry {
                    if let Some(extension) = entry.path().extension() {
                        if extension == "json" {
                            match fs::read_to_string(entry.path()) {
                                Ok(content) => {
                                    match serde_json::from_str::<Note>(&content) {
                                        Ok(note) => notes.push(note),
                                        Err(e) => eprintln!("Failed to parse note: {}", e),
                                    }
                                }
                                Err(e) => eprintln!("Failed to read note: {}", e),
                            }
                        }
                    }
                }
            }
        }
        Err(e) => return Err(format!("Failed to read notes directory: {}", e)),
    }
    
    Ok(notes)
}

#[tauri::command]
async fn save_note(app_handle: AppHandle, note: Note) -> Result<(), String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let notes_dir = app_dir.join("notes");
    
    if !notes_dir.exists() {
        fs::create_dir_all(&notes_dir).map_err(|e| e.to_string())?;
    }
    
    let note_path = notes_dir.join(format!("{}.json", note.id));
    let note_json = serde_json::to_string_pretty(&note).map_err(|e| e.to_string())?;
    
    fs::write(note_path, note_json).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
async fn delete_note(app_handle: AppHandle, id: String) -> Result<(), String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let note_path = app_dir.join("notes").join(format!("{}.json", id));
    
    if note_path.exists() {
        fs::remove_file(note_path).map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_notes,
            save_note,
            delete_note,
            read_file,
            write_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
