import { Button } from '@/components/button';
import { ResetButton } from '@/components/reset-button';
import { useState, useEffect, useRef } from 'react';
import { RenderKeys } from '../../../../components/render-keys';

const KEY_MAP: Record<string, string> = {
    Meta: 'win',
    Control: 'ctrl',
    Alt: 'alt',
    Shift: 'shift',
    ' ': 'space',
    Enter: 'enter',
    Escape: 'escape',
    Tab: 'tab',
    Backspace: 'backspace',
    Delete: 'delete',
    Insert: 'insert',
    Home: 'home',
    End: 'end',
    PageUp: 'pageup',
    PageDown: 'pagedown',
    ArrowUp: 'arrowup',
    ArrowDown: 'arrowdown',
    ArrowLeft: 'arrowleft',
    ArrowRight: 'arrowright',
};

export const ShortcutButton = ({
    shortcut,
    saveShortcut,
    resetShortcut,
}: {
    shortcut: string;
    saveShortcut: (shortcut: string) => void;
    resetShortcut: () => void;
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [binding, setBinding] = useState(shortcut);
    const currentBindingRef = useRef('');
    const pressedKeysRef = useRef<Set<string>>(new Set());

    const normalizeKey = (key: string): string => {
        if (KEY_MAP[key]) return KEY_MAP[key];
        if (key.length === 1) return key.toLowerCase();
        if (key.startsWith('F') && key.length <= 3) return key.toLowerCase();
        if (key.startsWith('Digit')) return key.replace('Digit', '');
        if (key.startsWith('Key')) return key.replace('Key', '').toLowerCase();
        return key.toLowerCase();
    };

    const updateBinding = () => {
        const keys = Array.from(pressedKeysRef.current);
        const modifierOrder = ['win', 'ctrl', 'alt', 'shift'];
        const sorted = keys.sort((a, b) => {
            const aIdx = modifierOrder.indexOf(a);
            const bIdx = modifierOrder.indexOf(b);
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            return a.localeCompare(b);
        });
        const newBinding = sorted.join('+');
        currentBindingRef.current = newBinding;
        setBinding(newBinding || '');
    };

    const onKeyDown = (e: KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const normalizedKey = normalizeKey(e.key);
        if (normalizedKey && !pressedKeysRef.current.has(normalizedKey)) {
            pressedKeysRef.current.add(normalizedKey);
            updateBinding();
        }
    };

    const onKeyUp = (e: KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        finishRecording();
    };

    const onMouseDown = (e: MouseEvent) => {
        // Left click is not allowed
        if (e.button === 0) {
            finishRecording();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        let mouseKey = '';
        if (e.button === 1) mouseKey = 'mousebutton3';
        else if (e.button === 2) mouseKey = 'mousebutton2';
        else if (e.button === 3) mouseKey = 'mousebutton4';
        else if (e.button === 4) mouseKey = 'mousebutton5';

        if (mouseKey && !pressedKeysRef.current.has(mouseKey)) {
            pressedKeysRef.current.add(mouseKey);
            updateBinding();
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        finishRecording();
    };

    const finishRecording = () => {
        setIsRecording(false);
        if (currentBindingRef.current) {
            saveShortcut(currentBindingRef.current);
        }
        pressedKeysRef.current.clear();
    };

    useEffect(() => {
        if (!isRecording) return;

        window.addEventListener('keydown', onKeyDown, { capture: true });
        window.addEventListener('keyup', onKeyUp, { capture: true });
        window.addEventListener('mousedown', onMouseDown, { capture: true });
        window.addEventListener('mouseup', onMouseUp, { capture: true });

        const timeout = setTimeout(finishRecording, 5000);

        return () => {
            window.removeEventListener('keydown', onKeyDown, { capture: true });
            window.removeEventListener('keyup', onKeyUp, { capture: true });
            window.removeEventListener('mousedown', onMouseDown, {
                capture: true,
            });
            window.removeEventListener('mouseup', onMouseUp, { capture: true });
            clearTimeout(timeout);
        };
    }, [isRecording]);

    let label: React.ReactNode;
    if (isRecording && binding.length > 0) {
        label = <RenderKeys keyString={binding} />;
    } else if (isRecording) {
        label = <span className="text-zinc-500">Press keys...</span>;
    } else {
        label = <RenderKeys keyString={shortcut} />;
    }

    return (
        <div className="flex flex-row gap-1">
            <Button
                variant="outline"
                className="px-2"
                onClick={() => {
                    setIsRecording(!isRecording);
                    setBinding('');
                    currentBindingRef.current = '';
                }}
            >
                {label}
            </Button>
            <ResetButton
                onClick={() => {
                    resetShortcut();
                    setIsRecording(false);
                }}
            />
        </div>
    );
};
