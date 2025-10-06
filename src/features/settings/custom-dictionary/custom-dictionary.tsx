import { useState } from 'react';
import { Input } from '../../../components/input';
import { Button } from '../../../components/button';
import { BookText } from 'lucide-react';

export const CustomDictionary = () => {
    const [customWords, setCustomWords] = useState<string[]>([]);
    const [newWord, setNewWord] = useState('');

    const handleAddWord = () => {
        const trimmed = newWord.trim();
        if (trimmed && !customWords.includes(trimmed)) {
            setCustomWords([...customWords, trimmed]);
            setNewWord('');
        }
    };

    const handleRemoveWord = (word: string) => {
        setCustomWords(customWords.filter((w) => w !== word));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddWord();
        }
    };

    return (
        <main className="px-8 py-6 text-white max-w-3xl">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">
                        Custom Dictionary
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Add words for better recognition accuracy
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BookText className="w-4 h-4 text-zinc-400" />
                            <h2 className="text-sm font-medium">
                                Custom Words
                            </h2>
                        </div>
                        <p className="text-xs text-zinc-500">
                            Add technical terms, names, or specialized
                            vocabulary
                        </p>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                value={newWord}
                                onChange={(e) => setNewWord(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add a word"
                                className="max-w-xs bg-zinc-900/40 border-zinc-700 text-white placeholder:text-zinc-600"
                            />
                            <Button
                                onClick={handleAddWord}
                                disabled={!newWord.trim()}
                                className="bg-zinc-700 hover:bg-zinc-600 text-white"
                            >
                                Add
                            </Button>
                        </div>
                        {customWords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {customWords.map((word) => (
                                    <button
                                        key={word}
                                        onClick={() => handleRemoveWord(word)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors"
                                    >
                                        <span>{word}</span>
                                        <span className="text-zinc-500">×</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
