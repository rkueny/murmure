import { AudioVisualizer } from './audio-visualizer/audio-visualizer';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

type HistoryEntry = {
    id: number;
    timestamp: number;
    text: string;
};

export const Home = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        loadHistory();

        const unlistenPromise = listen('history-updated', () => {
            loadHistory();
        });

        return () => {
            unlistenPromise.then((unlisten) => unlisten());
        };
    }, []);

    const loadHistory = async () => {
        try {
            const entries = await invoke<HistoryEntry[]>(
                'get_recent_transcriptions'
            );
            setHistory(entries);
        } catch (e) {
            console.error('Failed to load history:', e);
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    return (
        <main className="px-8 py-4 text-white">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-medium">Welcome!</h1>
            </div>

            <div className="mt-6">
                <h2 className="text-sm text-zinc-400">Live input</h2>
                <div className="mt-2 rounded-md border border-zinc-700 p-3 bg-zinc-900/60">
                    <AudioVisualizer bars={18} />
                    <p className="mt-2 text-xs text-zinc-500">
                        Hold Win+Ctrl to record
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-sm text-zinc-400 mb-3">Recent activity</h2>
                {history.length === 0 ? (
                    <p className="text-sm text-zinc-600">
                        No transcriptions yet
                    </p>
                ) : (
                    <div className="space-y-2">
                        {history.map((entry) => (
                            <div
                                key={entry.id}
                                className="rounded-md border border-zinc-700 p-3 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm text-zinc-300 flex-1 line-clamp-2">
                                        {entry.text}
                                    </p>
                                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                                        {formatTime(entry.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};
