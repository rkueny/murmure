import { Kbd } from '@/components/kbd';
import { Typography } from '@/components/typography';
import { ShortcutButton } from './shortcut-button/shortcut-button';
import { RenderKeys } from '../../../components/render-keys';
import { SettingsUI } from '@/components/settings-ui';
import { useRecordShortcutState } from './hooks/use-record-shortcut-state';

interface ShortcutsProps {}

export const Shortcuts = ({}: ShortcutsProps) => {
    const { recordShortcut, setRecordShortcut, resetRecordShortcut } =
        useRecordShortcutState();

    return (
        <main className="px-8 py-6 text-white">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Shortcuts</h1>
                    <p className="text-sm text-zinc-400">
                        Configure keyboard shortcuts for recording
                    </p>
                </div>

                <div className="space-y-6 flex flex-col items-center">
                    <SettingsUI.Container>
                        <SettingsUI.Item>
                            <SettingsUI.Description>
                                <Typography.Title>
                                    Push to talk
                                </Typography.Title>
                                <Typography.Paragraph>
                                    Hold{' '}
                                    <RenderKeys keyString={recordShortcut} /> to
                                    record, release to transcribe.
                                </Typography.Paragraph>
                            </SettingsUI.Description>
                            <ShortcutButton
                                shortcut={recordShortcut}
                                saveShortcut={setRecordShortcut}
                                resetShortcut={resetRecordShortcut}
                            />
                        </SettingsUI.Item>
                        <SettingsUI.Separator />
                        <SettingsUI.Item>
                            <SettingsUI.Description>
                                <Typography.Title>
                                    Past last transcript
                                </Typography.Title>
                                <Typography.Paragraph>
                                    Press <Kbd>Not available yet</Kbd> to paste
                                    the last transcript.
                                </Typography.Paragraph>
                            </SettingsUI.Description>
                            <ShortcutButton
                                shortcut={'Not available yet'}
                                saveShortcut={() => {}}
                                resetShortcut={() => {}}
                            />
                        </SettingsUI.Item>
                    </SettingsUI.Container>
                </div>
            </div>
        </main>
    );
};
