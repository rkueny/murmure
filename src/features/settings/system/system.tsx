import { Switch } from '../../../components/switch';
import { Power } from 'lucide-react';
import { Typography } from '@/components/typography';
import { SettingsUI } from '@/components/settings-ui';
import { useStartOnBootState } from './hooks/use-auto-start-state';
import { Page } from '@/components/page';

export const System = () => {
    const { startOnBoot, setStartOnBoot } = useStartOnBootState();

    return (
        <main>
            <div className="space-y-8">
                <Page.Header>
                    <Typography.MainTitle>System</Typography.MainTitle>
                    <Typography.Paragraph className="text-zinc-400">
                        Adjust system preferences to control Murmure's behavior
                        at startup and more. Murmure only operates based on your
                        explicit configuration.
                    </Typography.Paragraph>
                </Page.Header>

                <div className="flex justify-center">
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
            </div>
        </main>
    );
};
