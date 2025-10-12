import { RenderKeys } from '@/components/render-keys';
import { useRecordShortcutState } from '../settings/shortcuts/hooks/use-record-shortcut-state';
import { AudioVisualizer } from './audio-visualizer/audio-visualizer';
import { History } from './history/history';
import { Page } from '@/components/page';
import { Typography } from '@/components/typography';

export const Home = () => {
    const { recordShortcut } = useRecordShortcutState();
    return (
        <main className="space-y-8">
            <Page.Header>
                <Typography.MainTitle>Home</Typography.MainTitle>
                <Typography.Paragraph className="text-zinc-400">
                    Murmure use default microphone to record your voice. Try to
                    hold <RenderKeys keyString={recordShortcut} /> to start
                    recording.
                </Typography.Paragraph>
            </Page.Header>

            <div className="space-y-2">
                <Typography.Title>Live input</Typography.Title>
                <div className="rounded-md border border-zinc-700 p-2 space-y-4">
                    <AudioVisualizer bars={18} />
                    <Typography.Paragraph className="text-xs">
                        Hold <RenderKeys keyString={recordShortcut} /> to record
                    </Typography.Paragraph>
                </div>
            </div>

            <div className="flex justify-center">
                <History />
            </div>
        </main>
    );
};
