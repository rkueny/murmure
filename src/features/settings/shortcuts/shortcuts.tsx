import { Kbd } from '@/components/kbd';
import { Typography } from '@/components/typography';
import { ShortcutButton } from './shortcut-button/shortcut-button';
import { RenderKeys } from '../../../components/render-keys';
import { SettingsUI } from '@/components/settings-ui';
import { useRecordShortcutState } from './hooks/use-record-shortcut-state';
import { Page } from '@/components/page';

interface ShortcutsProps {}

export const Shortcuts = ({}: ShortcutsProps) => {
    const { recordShortcut, setRecordShortcut, resetRecordShortcut } =
        useRecordShortcutState();

    return (
        <main>
            <div className="space-y-8">
                <Page.Header>
                    <Typography.MainTitle>Shortcuts</Typography.MainTitle>
                    <Typography.Paragraph className="text-zinc-400">
                        Set up Murmure's keyboard shortcuts to improve your
                        workflow.
                    </Typography.Paragraph>
                </Page.Header>

                <SettingsUI.Container>
                    <SettingsUI.Item>
                        <SettingsUI.Description>
                            <Typography.Title>Push to talk</Typography.Title>
                            <Typography.Paragraph>
                                Hold <RenderKeys keyString={recordShortcut} />{' '}
                                to record, release to transcribe.
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
                                Press <Kbd>Not available yet</Kbd> to paste the
                                last transcript.
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
        </main>
    );
};
