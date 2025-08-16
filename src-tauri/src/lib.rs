use std::fs;
use tauri::Manager;

#[tauri::command]
fn create_database_dir() -> Result<(), String> {
    let home_dir = std::env::var("USERPROFILE")
        .or_else(|_| std::env::var("HOME"))
        .map_err(|_| "Could not find home directory")?;
    
    let app_data_dir = std::path::Path::new(&home_dir)
        .join("AppData")
        .join("Roaming")
        .join("stock-management");
    
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir)
            .map_err(|e| format!("Failed to create database directory: {}", e))?;
    }
    
    println!("Database directory created at: {:?}", app_data_dir);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_database_dir])
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                // Use zoom to make fonts/UI smaller - change this number:
                let _ = window.set_zoom(0.8);  // 0.8 = 80% size (smaller fonts/UI)
            }
            
            let home_dir = std::env::var("USERPROFILE")
                .or_else(|_| std::env::var("HOME"))
                .unwrap_or_else(|_| ".".to_string());
            
            let app_data_dir = std::path::Path::new(&home_dir)
                .join("AppData")
                .join("Roaming")
                .join("stock-management");
            
            if !app_data_dir.exists() {
                let _ = fs::create_dir_all(&app_data_dir);
                println!("Created database directory: {:?}", app_data_dir);
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}