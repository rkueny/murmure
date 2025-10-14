import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export const useOverlayState = () => {
    const [overlayMode, setOverlayMode] = useState<
        'hidden' | 'recording' | 'always'
    >('recording');
    const [overlayPosition, setOverlayPosition] = useState<'top' | 'bottom'>(
        'bottom'
    );
    const [disableOverlaySettings, setDisableOverlaySettings] = useState(false);

    useEffect(() => {
        invoke<string>('get_overlay_mode').then((m) => {
            if (m === 'hidden' || m === 'recording' || m === 'always')
                setOverlayMode(m);
        });
        invoke<string>('get_overlay_position').then((p) => {
            if (p === 'top' || p === 'bottom') setOverlayPosition(p);
        });
    }, []);

    useEffect(() => {
        const fetchPlatform = async () => {
            const platform = await invoke<string>('plugin:os|platform');
            if (platform === 'linux') {
                setDisableOverlaySettings(true);
            }
        };

        fetchPlatform();
    }, []);

    return {
        setOverlayMode: (m: 'hidden' | 'recording' | 'always') => {
            setOverlayMode(m);
            invoke('set_overlay_mode', { mode: m });
        },
        setOverlayPosition: (p: 'top' | 'bottom') => {
            setOverlayPosition(p);
            invoke('set_overlay_position', { position: p });
        },
        overlayMode,
        overlayPosition,
        disableOverlaySettings,
    };
};
