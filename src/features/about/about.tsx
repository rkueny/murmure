import { Shield, Lock, Code, Cpu, Github } from 'lucide-react';
import { Separator } from '../../components/separator';

export const About = () => {
    const features = [
        {
            icon: Lock,
            title: 'Privacy First',
            description:
                'All processing happens locally on your device. No data ever leaves your computer.',
        },
        {
            icon: Shield,
            title: 'No Telemetry',
            description:
                'Zero tracking, zero analytics. Your data stays yours, always.',
        },
        {
            icon: Code,
            title: 'Open Source',
            description:
                'Free and open source software. Inspect, modify, and contribute.',
        },
        {
            icon: Cpu,
            title: 'Powered by Parakeet',
            description:
                "NVIDIA's state-of-the-art speech recognition model runs entirely on-device.",
        },
    ];

    return (
        <main className="px-8 py-6 text-white max-w-3xl">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-semibold mb-2">Murmure</h1>
                    <p className="text-zinc-400 text-sm">
                        Privacy-first speech-to-text, running entirely on your
                        machine
                    </p>
                </div>

                <Separator className="bg-zinc-700" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-lg border border-zinc-700 p-5 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors"
                        >
                            <feature.icon className="w-5 h-5 text-zinc-400 mb-3" />
                            <h3 className="text-sm font-medium mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-medium text-zinc-400 mb-2">
                            Technology
                        </h2>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Murmure uses NVIDIA's Parakeet TDT model, a highly
                            optimized transformer-based speech recognition
                            system designed for low-latency on-device inference.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-zinc-400 mb-2">
                            License
                        </h2>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            Free and open source under MIT License.
                        </p>
                    </div>
                </div>

                <Separator className="bg-zinc-700 my-4" />

                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                        <Github className="w-4 h-4" />
                        <span>View on GitHub</span>
                    </a>
                    <span className="text-zinc-700">•</span>
                    <p className="text-sm text-zinc-500">Version 0.1.0</p>
                </div>
            </div>
        </main>
    );
};
