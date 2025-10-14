import { useEffect, useMemo, useRef } from 'react';
import { useLevelState } from './hooks/use-level-state';
import clsx from 'clsx';
import { AudioPixel } from './audio-pixel/audio-pixel';

interface AudioVisualizerProps {
    bars?: number;
    rows?: number;
    audioPixelWidth?: number;
    audioPixelHeight?: number;
    pixelHeight?: number;
    className?: string;
}

export const AudioVisualizer = ({
    bars = 16,
    rows = 20,
    audioPixelWidth = 12,
    audioPixelHeight = 6,
    className,
}: AudioVisualizerProps) => {
    const { level } = useLevelState();
    const rafRef = useRef<number | null>(null);
    const displayedRef = useRef(0);

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

    return (
        <div className={clsx('flex gap-0.5 w-full', className)}>
            {heights.map((h, colIdx) => {
                const halfRows = Math.floor(rows / 2);
                const litHalfRows = Math.floor(h * halfRows);
                const isEdgeColumn = colIdx === 0 || colIdx === bars - 1;
                const centerStart = Math.floor(bars / 2) - 4;
                const centerEnd = Math.floor(bars / 2) + 3;
                const isCenterColumn =
                    colIdx >= centerStart && colIdx <= centerEnd;
                const hasSound = litHalfRows > 1;
                return (
                    <div key={colIdx} className="flex flex-col gap-0.5 flex-1">
                        {Array.from({ length: rows }).map((_, rowIdx) => {
                            const centerIndex = (rows - 1) / 2;
                            const distanceFromCenter = Math.abs(
                                rowIdx - centerIndex
                            );
                            const minDistance = rows % 2 === 0 ? 0.5 : 0;
                            const isLit =
                                distanceFromCenter <=
                                Math.max(litHalfRows, minDistance);
                            return (
                                <AudioPixel
                                    key={rowIdx}
                                    isLit={isLit}
                                    distanceFromCenter={distanceFromCenter}
                                    isEdgeColumn={isEdgeColumn}
                                    isCenterColumn={isCenterColumn}
                                    hasSound={hasSound}
                                    width={audioPixelWidth}
                                    height={audioPixelHeight}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
