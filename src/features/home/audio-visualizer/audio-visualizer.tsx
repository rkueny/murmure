import { useEffect, useMemo, useRef, useState } from 'react';
import { listen } from '@tauri-apps/api/event';

type Props = {
    bars?: number;
    rows?: number;
    className?: string;
};

export const AudioVisualizer = ({ bars = 16, rows = 20, className }: Props) => {
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
        const v = Math.min(1, displayedRef.current * 10);
        const arr: number[] = [];
        for (let i = 0; i < bars; i++) {
            const bias = Math.abs((i / (bars - 1)) * 2 - 1);
            const h = Math.max(0, v * (1 - bias * 0.6));
            arr.push(h);
        }
        return arr;
    }, [bars, level]);

    const getPixelColor = (distanceFromCenter: number) => {
        if (distanceFromCenter <= 1) {
            return `hsl(239, 84%, 67%)`;
        } else if (distanceFromCenter <= 2.5) {
            return `hsl(199, 89%, 48%)`;
        } else {
            return `hsl(180, 100%, 50%)`;
        }
    };

    return (
        <div className={`flex gap-[2px] w-full ${className ?? ''}`}>
            {heights.map((h, colIdx) => {
                const halfRows = Math.floor(rows / 2);
                const litHalfRows = Math.floor(h * halfRows);
                return (
                    <div
                        key={colIdx}
                        className="flex flex-col gap-[2px] flex-1"
                    >
                        {Array.from({ length: rows }).map((_, rowIdx) => {
                            const distanceFromCenter = Math.abs(
                                rowIdx - halfRows + 0.5
                            );
                            const isLit =
                                distanceFromCenter <= Math.max(litHalfRows, 1);
                            return (
                                <div
                                    key={rowIdx}
                                    className="w-full transition-opacity duration-100"
                                    style={{
                                        height: '10px',
                                        backgroundColor: isLit
                                            ? getPixelColor(distanceFromCenter)
                                            : 'transparent',
                                        opacity: isLit ? 0.9 : 0.15,
                                        border: '0.5px solid rgba(100, 100, 100, 0.2)',
                                    }}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
