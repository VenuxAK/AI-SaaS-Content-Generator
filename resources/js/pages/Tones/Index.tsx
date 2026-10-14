import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Sparkles, Plus, Edit2, Trash2, X, Check, Zap } from 'lucide-react';
import {
    index as tonesIndex,
    store as tonesStore,
    update as tonesUpdate,
    destroy as tonesDestroy,
} from '@/routes/tones';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

interface Tone {
    id: number;
    name: string;
    description: string;
    created_at: string;
    is_system?: boolean;
}

interface TonesIndexProps {
    tones: Tone[];
}

const TONE_TEMPLATES = [
    {
        name: 'Visionary Tech Founder',
        description:
            'Write with intense conviction, high energy, and strategic insight. Use short, punchy paragraphs and rhetorical questions. Maintain an inspiring, bold, future-focused voice with 0 buzzwords.',
    },
    {
        name: 'Direct Response Copywriter',
        description:
            'Focus ruthlessly on pain points, urgency, and compelling calls to action. Use high-converting marketing frameworks like PAS (Problem, Agitation, Solution). Keep sentences conversational and readable at an 8th-grade level.',
    },
    {
        name: 'Casual & Relatable Friend',
        description:
            'Warm, witty, and approachable. Speak like a trusted peer over coffee. Use light humor, casual transitions, and relatable everyday metaphors without losing authority.',
    },
];

export default function TonesIndex({ tones }: TonesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTone, setEditingTone] = useState<Tone | null>(null);

    const createForm = useForm({
        name: '',
        description: '',
    });

    const editForm = useForm({
        name: '',
        description: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(tonesStore.url(), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTone) return;

        editForm.put(tonesUpdate.url({ tone: editingTone.id }), {
            onSuccess: () => {
                setEditingTone(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (
            confirm(
                'Are you sure you want to delete this custom writing tone? Existing generated copy will preserve its tone snapshot, but the tone itself will be removed.'
            )
        ) {
            router.delete(tonesDestroy.url({ tone: id }));
        }
    };

    const openEdit = (tone: Tone) => {
        setEditingTone(tone);
        editForm.setData({
            name: tone.name,
            description: tone.description,
        });
    };

    const handleApplyTemplate = (tpl: { name: string; description: string }) => {
        createForm.setData({
            name: tpl.name,
            description: tpl.description,
        });
        setIsCreateOpen(true);
    };

    return (
        <>
            <Head title="Voice Personas - Nexus AI" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800/80">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <Sparkles className="size-5" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                                Voice Personas & Tones
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Define your unique vocabulary, tone, and brand persona to personalize generated AI copy.
                        </p>
                    </div>

                    {!isCreateOpen && !editingTone && (
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center gap-2 cursor-pointer shadow-xl shadow-indigo-600/20 h-11 px-5 transition active:scale-95 self-start sm:self-auto"
                        >
                            <Plus className="size-4" />
                            Create Persona
                        </Button>
                    )}
                </div>

                {/* Form: Create Tone Form Card */}
                {isCreateOpen && (
                    <Card className="border border-indigo-500/30 shadow-xl bg-white/90 dark:bg-[#0c0e1a]/90 backdrop-blur-2xl rounded-3xl p-6 glow-indigo">
                        <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-5">
                            <div>
                                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Sparkles className="size-4 text-indigo-600 dark:text-indigo-400" />
                                    Create New Voice Persona
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Instruct the AI on word choice, formality, sentence structure, and slang.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="create_name"
                                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
                                >
                                    Persona Name
                                </label>
                                <input
                                    id="create_name"
                                    type="text"
                                    placeholder="e.g. Visionary Tech Founder, High-Converting Direct Sales, Chill Gen-Z Creator"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07080e] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                {createForm.errors.name && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {createForm.errors.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="create_description"
                                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
                                >
                                    Voice Guidelines & Rules
                                </label>
                                <textarea
                                    id="create_description"
                                    rows={4}
                                    placeholder="Describe the style. e.g. 'Write with intense confidence and directness. Avoid corporate jargon like synergy or leverage. Use bullet points and 1-line paragraphs.'"
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07080e] p-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    required
                                />
                                {createForm.errors.description && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {createForm.errors.description}
                                    </span>
                                )}
                            </div>

                            {/* Preset Templates */}
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-semibold text-slate-400">
                                    Load Preset Idea:
                                </span>
                                {TONE_TEMPLATES.map((tpl, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleApplyTemplate(tpl)}
                                        className="cursor-pointer rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-300"
                                    >
                                        + {tpl.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-md"
                                >
                                    {createForm.processing ? 'Saving...' : 'Save Voice Persona'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Form: Edit Tone Form Card */}
                {editingTone && (
                    <Card className="border border-indigo-500/30 shadow-xl bg-white/90 dark:bg-[#0c0e1a]/90 backdrop-blur-2xl rounded-3xl p-6 glow-indigo">
                        <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-5">
                            <div>
                                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Edit2 className="size-4 text-indigo-600 dark:text-indigo-400" />
                                    Edit Persona: {editingTone.name}
                                </h2>
                            </div>
                            <button
                                onClick={() => setEditingTone(null)}
                                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="edit_name"
                                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
                                >
                                    Persona Name
                                </label>
                                <input
                                    id="edit_name"
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07080e] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                {editForm.errors.name && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {editForm.errors.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="edit_description"
                                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
                                >
                                    Voice Guidelines & Rules
                                </label>
                                <textarea
                                    id="edit_description"
                                    rows={4}
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07080e] p-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    required
                                />
                                {editForm.errors.description && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {editForm.errors.description}
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingTone(null)}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-md"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Tone Cards Grid */}
                {tones.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tones.map((tone) => (
                            <Card
                                key={tone.id}
                                className="group rounded-3xl border border-slate-200/80 bg-white/80 shadow-md backdrop-blur-xl transition duration-200 hover:shadow-xl hover:border-indigo-400 dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 dark:hover:border-indigo-500/40 flex flex-col justify-between overflow-hidden"
                            >
                                <CardHeader className="pb-3 pt-5 px-6 bg-slate-50/50 dark:bg-[#080911]/60 border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <CardTitle className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span className={`flex size-2 rounded-full ${tone.is_system ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`} />
                                                {tone.name}
                                            </CardTitle>
                                            {tone.is_system && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-500/20 dark:text-indigo-400">
                                                    <Sparkles className="size-2.5" /> Preset
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            {tone.is_system ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleApplyTemplate({
                                                            name: `${tone.name} (Custom)`,
                                                            description: tone.description,
                                                        })
                                                    }
                                                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition cursor-pointer flex items-center gap-1 border border-indigo-500/20 shadow-2xs"
                                                    title="Duplicate as customizable template"
                                                >
                                                    <Plus className="size-3" /> Duplicate
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => openEdit(tone)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                                        title="Edit tone"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tone.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                                        title="Delete tone"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 pb-5 px-6 flex-1">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                        {tone.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="py-3 px-6 bg-slate-50/30 dark:bg-[#080911]/40 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                                    <span>
                                        {tone.is_system
                                            ? 'Built-in system preset'
                                            : `Configured on ${new Date(tone.created_at).toLocaleDateString()}`}
                                    </span>
                                    {tone.is_system && (
                                        <span className="text-emerald-500 font-semibold">Active in Generator</span>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center max-w-md mx-auto my-12 w-full bg-white/50 dark:bg-[#0c0e1a]/50">
                        <Sparkles className="size-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Define your first voice persona
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                            Customize how the AI talks to match your voice or your brand identity perfectly.
                        </p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold cursor-pointer shadow-md"
                        >
                            Create Voice Tone
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

TonesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Voice Personas',
            href: tonesIndex.url(),
        },
    ],
};
