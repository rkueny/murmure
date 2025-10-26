use crate::audio::write_transcription;
use crate::audio::{record_audio, stop_recording};
use crate::history::get_last_transcription;
use crate::shortcuts::{
    keys_to_string, LastTranscriptShortcutKeys, RecordShortcutKeys, TranscriptionSuspended,
};
use global_hotkey::hotkey::{Code, HotKey, Modifiers};
use global_hotkey::{GlobalHotKeyEvent, GlobalHotKeyManager};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter, Manager};

// Convert VK code to global-hotkey Code
fn vk_to_code(vk: i32) -> Option<Code> {
    match vk {
        0x41 => Some(Code::KeyA),
        0x42 => Some(Code::KeyB),
        0x43 => Some(Code::KeyC),
        0x44 => Some(Code::KeyD),
        0x45 => Some(Code::KeyE),
        0x46 => Some(Code::KeyF),
        0x47 => Some(Code::KeyG),
        0x48 => Some(Code::KeyH),
        0x49 => Some(Code::KeyI),
        0x4A => Some(Code::KeyJ),
        0x4B => Some(Code::KeyK),
        0x4C => Some(Code::KeyL),
        0x4D => Some(Code::KeyM),
        0x4E => Some(Code::KeyN),
        0x4F => Some(Code::KeyO),
        0x50 => Some(Code::KeyP),
        0x51 => Some(Code::KeyQ),
        0x52 => Some(Code::KeyR),
        0x53 => Some(Code::KeyS),
        0x54 => Some(Code::KeyT),
        0x55 => Some(Code::KeyU),
        0x56 => Some(Code::KeyV),
        0x57 => Some(Code::KeyW),
        0x58 => Some(Code::KeyX),
        0x59 => Some(Code::KeyY),
        0x5A => Some(Code::KeyZ),
        0x30 => Some(Code::Digit0),
        0x31 => Some(Code::Digit1),
        0x32 => Some(Code::Digit2),
        0x33 => Some(Code::Digit3),
        0x34 => Some(Code::Digit4),
        0x35 => Some(Code::Digit5),
        0x36 => Some(Code::Digit6),
        0x37 => Some(Code::Digit7),
        0x38 => Some(Code::Digit8),
        0x39 => Some(Code::Digit9),
        0x70 => Some(Code::F1),
        0x71 => Some(Code::F2),
        0x72 => Some(Code::F3),
        0x73 => Some(Code::F4),
        0x74 => Some(Code::F5),
        0x75 => Some(Code::F6),
        0x76 => Some(Code::F7),
        0x77 => Some(Code::F8),
        0x78 => Some(Code::F9),
        0x79 => Some(Code::F10),
        0x7A => Some(Code::F11),
        0x7B => Some(Code::F12),
        0x20 => Some(Code::Space),
        0x0D => Some(Code::Enter),
        0x1B => Some(Code::Escape),
        0x09 => Some(Code::Tab),
        0x08 => Some(Code::Backspace),
        0x2E => Some(Code::Delete),
        0x2D => Some(Code::Insert),
        0x24 => Some(Code::Home),
        0x23 => Some(Code::End),
        0x21 => Some(Code::PageUp),
        0x22 => Some(Code::PageDown),
        0x26 => Some(Code::ArrowUp),
        0x28 => Some(Code::ArrowDown),
        0x25 => Some(Code::ArrowLeft),
        0x27 => Some(Code::ArrowRight),
        _ => None,
    }
}

// Convert VK codes to HotKey
fn vk_codes_to_hotkey(vk_codes: &[i32]) -> Option<HotKey> {
    if vk_codes.is_empty() {
        return None;
    }

    let mut modifiers = Modifiers::empty();
    let mut key_code: Option<Code> = None;

    for &vk in vk_codes {
        match vk {
            0x5B => modifiers |= Modifiers::META,  // Win/Cmd key
            0x11 => modifiers |= Modifiers::CONTROL,
            0x12 => modifiers |= Modifiers::ALT,
            0x10 => modifiers |= Modifiers::SHIFT,
            _ => {
                if let Some(code) = vk_to_code(vk) {
                    key_code = Some(code);
                }
            }
        }
    }

    // A hotkey must have at least one non-modifier key
    key_code.map(|code| HotKey::new(Some(modifiers), code))
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
enum HotkeyType {
    Record,
    LastTranscript,
}

// Auto-stop recording after this duration (60 seconds)
const MAX_RECORDING_DURATION: Duration = Duration::from_secs(60);

pub fn init_shortcuts(app: AppHandle) {
    let manager = GlobalHotKeyManager::new().expect("Failed to create GlobalHotKeyManager");
    let manager = Arc::new(Mutex::new(manager));

    // Keep track of registered hotkeys
    let registered_hotkeys: Arc<Mutex<HashMap<HotkeyType, HotKey>>> = Arc::new(Mutex::new(HashMap::new()));
    let is_recording: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
    let recording_start_time: Arc<Mutex<Option<Instant>>> = Arc::new(Mutex::new(None));

    // Clone for the event listener thread
    let app_listener = app.clone();
    let is_recording_listener = is_recording.clone();
    let recording_start_time_listener = recording_start_time.clone();

    // Start event listener thread
    std::thread::spawn(move || {
        let receiver = GlobalHotKeyEvent::receiver();

        loop {
            if let Ok(event) = receiver.recv() {
                if app_listener.state::<TranscriptionSuspended>().get() {
                    continue;
                }

                let record_keys = app_listener.state::<RecordShortcutKeys>().get();
                let last_transcript_keys = app_listener.state::<LastTranscriptShortcutKeys>().get();

                let record_hotkey = vk_codes_to_hotkey(&record_keys);
                let last_transcript_hotkey = vk_codes_to_hotkey(&last_transcript_keys);

                // Check if this event matches the record hotkey (toggle mode)
                if let Some(ref hotkey) = record_hotkey {
                    if event.id == hotkey.id() && event.state == global_hotkey::HotKeyState::Pressed {
                        let mut recording = is_recording_listener.lock().unwrap();
                        if !*recording {
                            // Start recording
                            record_audio(&app_listener);
                            *recording = true;
                            *recording_start_time_listener.lock().unwrap() = Some(Instant::now());
                            let _ = app_listener.emit("shortcut:start", keys_to_string(&record_keys));
                            println!("Recording started (toggle mode - press again to stop or auto-stop in 60s)");
                        } else {
                            // Stop recording (toggle mode)
                            let _ = stop_recording(&app_listener);
                            *recording = false;
                            *recording_start_time_listener.lock().unwrap() = None;
                            let _ = app_listener.emit("shortcut:stop", keys_to_string(&record_keys));
                            println!("Recording stopped manually");
                        }
                    }
                }

                // Check if this event matches the last transcript hotkey
                if let Some(ref hotkey) = last_transcript_hotkey {
                    if event.id == hotkey.id() && event.state == global_hotkey::HotKeyState::Pressed {
                        if let Ok(last_transcript) = get_last_transcription(&app_listener) {
                            let _ = write_transcription(&app_listener, &last_transcript);
                        }
                    }
                }
            }
        }
    });

    // Clone for the timeout checker thread
    let app_timeout = app.clone();
    let is_recording_timeout = is_recording.clone();
    let recording_start_time_timeout = recording_start_time.clone();

    // Start timeout checker thread
    std::thread::spawn(move || {
        loop {
            std::thread::sleep(Duration::from_secs(1));

            let mut recording = is_recording_timeout.lock().unwrap();
            if *recording {
                let start_time = recording_start_time_timeout.lock().unwrap();
                if let Some(start) = *start_time {
                    if start.elapsed() >= MAX_RECORDING_DURATION {
                        // Auto-stop recording after timeout
                        let _ = stop_recording(&app_timeout);
                        *recording = false;
                        drop(recording);
                        *recording_start_time_timeout.lock().unwrap() = None;
                        let record_keys = app_timeout.state::<RecordShortcutKeys>().get();
                        let _ = app_timeout.emit("shortcut:stop", keys_to_string(&record_keys));
                        println!("Recording auto-stopped after 60 seconds");
                    }
                }
            }
        }
    });

    // Clone for the hotkey registration thread
    let app_registrar = app.clone();
    let manager_registrar = manager.clone();
    let registered_hotkeys_registrar = registered_hotkeys.clone();

    // Start hotkey registration update thread
    std::thread::spawn(move || {
        loop {
            let record_keys = app_registrar.state::<RecordShortcutKeys>().get();
            let last_transcript_keys = app_registrar.state::<LastTranscriptShortcutKeys>().get();

            let record_hotkey = vk_codes_to_hotkey(&record_keys);
            let last_transcript_hotkey = vk_codes_to_hotkey(&last_transcript_keys);

            let mut registered = registered_hotkeys_registrar.lock().unwrap();
            let manager = manager_registrar.lock().unwrap();

            // Update record hotkey if changed
            if let Some(ref new_hotkey) = record_hotkey {
                if registered.get(&HotkeyType::Record) != Some(new_hotkey) {
                    // Unregister old hotkey if exists
                    if let Some(old_hotkey) = registered.remove(&HotkeyType::Record) {
                        let _ = manager.unregister(old_hotkey);
                    }
                    // Register new hotkey
                    if let Err(e) = manager.register(*new_hotkey) {
                        eprintln!("Failed to register record hotkey: {}", e);
                    } else {
                        registered.insert(HotkeyType::Record, *new_hotkey);
                    }
                }
            } else {
                // No hotkey configured, unregister if any
                if let Some(old_hotkey) = registered.remove(&HotkeyType::Record) {
                    let _ = manager.unregister(old_hotkey);
                }
            }

            // Update last transcript hotkey if changed
            if let Some(ref new_hotkey) = last_transcript_hotkey {
                if registered.get(&HotkeyType::LastTranscript) != Some(new_hotkey) {
                    // Unregister old hotkey if exists
                    if let Some(old_hotkey) = registered.remove(&HotkeyType::LastTranscript) {
                        let _ = manager.unregister(old_hotkey);
                    }
                    // Register new hotkey
                    if let Err(e) = manager.register(*new_hotkey) {
                        eprintln!("Failed to register last transcript hotkey: {}", e);
                    } else {
                        registered.insert(HotkeyType::LastTranscript, *new_hotkey);
                    }
                }
            } else {
                // No hotkey configured, unregister if any
                if let Some(old_hotkey) = registered.remove(&HotkeyType::LastTranscript) {
                    let _ = manager.unregister(old_hotkey);
                }
            }

            drop(registered);
            drop(manager);

            // Check for changes every 500ms
            std::thread::sleep(Duration::from_millis(500));
        }
    });
}
