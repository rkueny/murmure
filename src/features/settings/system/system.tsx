import { Switch } from '../../../components/switch';
import { Power } from 'lucide-react';
import { Typography } from '@/components/typography';
import { SettingsUI } from '@/components/settings-ui';
import { useStartOnBootState } from './hooks/use-auto-start-state';

export const System = () => {
    const { startOnBoot, setStartOnBoot } = useStartOnBootState();

    return (
        <main className="px-8 py-6 text-white max-w-3xl">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">System</h1>
                    <p className="text-sm text-zinc-400">
                        Configure system-level preferences
                    </p>
                </div>

                <SettingsUI.Container>
                    <SettingsUI.Item>
                        <SettingsUI.Description>
                            <Typography.Title className="flex items-center gap-2">
                                <Power className="w-4 h-4 text-zinc-400" />
                                Start on boot
                            </Typography.Title>
                            <Typography.Paragraph>
                                If enabled, Murmure will start automatically
                                when Windows starts.
                            </Typography.Paragraph>
                        </SettingsUI.Description>
                        <Switch
                            checked={startOnBoot}
                            onCheckedChange={setStartOnBoot}
                        />
                    </SettingsUI.Item>
                </SettingsUI.Container>
            </div>
        </main>
    );
};
