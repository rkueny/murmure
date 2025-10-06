use anyhow::Result;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

const MODEL_FILENAME: &str = "parakeet-tdt-0.6b-v3-int8";

pub struct Model {
    app_handle: AppHandle,
}

impl Model {
    pub fn new(app_handle: AppHandle) -> Result<Self> {
        Ok(Self { app_handle })
    }

    pub fn get_model_path(&self) -> Result<PathBuf> {
        let model_path = self.app_handle.path().resolve(
            format!("../resources/{}", MODEL_FILENAME),
            tauri::path::BaseDirectory::Resource,
        )?;

        if !model_path.exists() {
            anyhow::bail!("Bundled model not found at: {}", model_path.display());
        }

        Ok(model_path)
    }

    pub fn is_available(&self) -> bool {
        self.get_model_path().is_ok()
    }
}
