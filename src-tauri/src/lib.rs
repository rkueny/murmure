mod audio;
mod clipboard;
mod commands;
mod dictionary;
mod engine;
mod history;
mod model;
mod settings;
mod shortcuts;
mod tray_icon;

use audio::preload_engine;
use commands::*;
use dictionary::Dictionary;
use model::Model;
use shortcuts::init_shortcuts;
use std::sync::Arc;
use tauri::{DeviceEventFilter, Manager};
use tray_icon::setup_tray;

use crate::shortcuts::ShortcutKeys;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .device_event_filter(DeviceEventFilter::Never)
        .setup(|app| {
            let model =
                Arc::new(Model::new(app.handle().clone()).expect("Failed to initialize model"));
            app.manage(model);

            let s = settings::load_settings(&app.handle());
            app.manage(Dictionary::new(s.dictionary.clone()));

            match preload_engine(&app.handle()) {
                Ok(_) => println!("Transcription engine ready"),
                Err(e) => println!("Transcription engine will be loaded on first use: {}", e),
            }

            setup_tray(&app.handle())?;

            let keys = shortcuts::parse_binding_keys(&s.shortcut);
            app.manage(ShortcutKeys::new(keys));

            init_shortcuts(app.handle().clone());
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .invoke_handler(tauri::generate_handler![
            is_model_available,
            get_model_path,
            get_recent_transcriptions,
            get_shortcut,
            set_shortcut,
            set_dictionary,
            get_dictionary,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
