use crate::audio::{record_audio, stop_recording, write_transcription};
use crate::history::get_last_transcription;
use crate::settings::load_settings;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

pub fn init_shortcuts(app: AppHandle) {
    let s = load_settings(&app);

    if let Ok(shortcut) = s.record_shortcut.parse::<Shortcut>() {
        let record_binding = s.record_shortcut.clone();
        let _ = app.global_shortcut().on_shortcut(shortcut, move |ah, _sc, event| {
            match event.state {
                ShortcutState::Pressed => {
                    record_audio(ah);
                    let _ = ah.emit("shortcut:start", record_binding.clone());
                }
                ShortcutState::Released => {
                    let _ = stop_recording(ah);
                    let _ = ah.emit("shortcut:stop", record_binding.clone());
                }
                _ => {}
            }
        });
    } else {
        eprintln!("Invalid record shortcut: {}", s.record_shortcut);
    }

    if let Ok(shortcut) = s.last_transcript_shortcut.parse::<Shortcut>() {
        let _ = app.global_shortcut().on_shortcut(shortcut, move |ah, _sc, event| {
            if let ShortcutState::Pressed = event.state {
                if let Ok(text) = get_last_transcription(ah) {
                    let _ = write_transcription(ah, &text);
                }
            }
        });
    } else {
        eprintln!(
            "Invalid last transcript shortcut: {}",
            s.last_transcript_shortcut
        );
    }
}


