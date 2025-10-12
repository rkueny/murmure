# Murmure

A privacy-first, open-source speech-to-text application that runs entirely on your machine, powered by NVIDIA’s Parakeet model for fast, local transcription. Murmure turns your voice into text with no internet connection and zero data collection.

![demo](public/murmure-screenshot-beautiful.png)

## Features

- **Privacy First**: All processing happens locally on your device. No data ever leaves your computer.
- **No Telemetry**: Zero tracking, zero analytics. Your data stays yours, always.
- **Open Source**: Free and open source software. Inspect, modify, and contribute.
- **Powered by Parakeet**: NVIDIA’s state-of-the-art speech recognition model runs entirely on-device for fast, low-latency transcription.

## Installation

Download the latest [release](https://github.com/Kieirra/murmure/releases) and follow the install wizard.

Note : I did not signe the application on window yet, so OS can see it like dangerous but I can assure there is no malware or anything in the msi. We will signe it when we will be in non release.

## Usage

Murmure provides a clean and focused speech-to-text experience.
Once launched, simply start recording your voice, the text appears instantly, processed directly on your computer.

Typical use cases include:

- Talking to any AI prompt (Cursor, ChatGPT, Mistral, etc.)
- Writing notes hands-free
- Capturing creative ideas or dictation

Because all computation is local, no network connection is required.

## Technology

Murmure uses NVIDIA’s Parakeet TDT, a highly experimental optimized transformer-based speech recognition model designed for low-latency, on-device inference. It combines fast transcription with strong accuracy across multiple languages, running efficiently on consumer GPUs or CPUs.

## Contributing

Contributions are welcome!
If you’d like to improve Murmure or report an issue:

0. You need to have install Vs build tools 2022 (with c++ desktop)
1. Fork the repository
2. Create a feature branch (git checkout -b feature/new-feature)
3. Commit your changes (git commit -m "Add new feature")
4. Push and open a pull request

Note that, for some reason, rust will not copy the resources in the right place in dev mode, you need to copy the whole resources folder into `src-tauri/target/debug/_up_/`

## Support Development

If you like Murmure and want to support its continued development: [Support on Tipeee](https://fr.tipeee.com/murmure-al1x-ai/)
