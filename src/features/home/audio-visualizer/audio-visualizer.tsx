import { useEffect, useMemo, useRef, useState } from 'react';
import { listen } from '@tauri-apps/api/event';

type Props = {
    bars?: number;
    className?: string;
};

export const AudioVisualizer = ({ bars = 16, className }: Props) => {
    const [level, setLevel] = useState(0);
    const rafRef = useRef<number | null>(null);
    const displayedRef = useRef(0);

    useEffect(() => {
        const unlistenPromise = listen<number>('mic-level', (e) => {
            const value = Math.max(0, Math.min(1, Number(e.payload ?? 0)));
            setLevel(value);
        });
        return () => {
            unlistenPromise.then((un) => un());
        };
    }, []);

    useEffect(() => {
        const tick = () => {
            const current = displayedRef.current;
            const target = level;
            const diff = target - current;
            const step = Math.sign(diff) * Math.min(Math.abs(diff), 0.05);
            displayedRef.current = current + step;
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [level]);

    const heights = useMemo(() => {
        const v = displayedRef.current;
        const arr: number[] = [];
        for (let i = 0; i < bars; i++) {
            const bias = Math.abs((i / (bars - 1)) * 2 - 1); // center-low edges-low
            const h = Math.max(0, v * (1 - bias * 0.6));
            arr.push(h);
        }
        return arr;
    }, [bars, level]);

    return (
        <div
            className={
                'flex items-end gap-1 w-full h-16 [&_*]:transition-[height] [&_*]:duration-50 ' +
                (className ?? '')
            }
        >
            {heights.map((h, idx) => (
                <div
                    key={idx}
                    className="flex-1 rounded-sm bg-zinc-600/60 dark:bg-zinc-200/60"
                    style={{ height: `${Math.round(h * 1000)}%` }}
                />
            ))}
        </div>
    );
};
