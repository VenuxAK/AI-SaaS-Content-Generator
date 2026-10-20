import { useState, useMemo } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
    const sortedTones = useMemo(() => {
        return [...tones].sort((a, b) => {
            const aIsSystem = Boolean(a.is_system);
            const bIsSystem = Boolean(b.is_system);
            if (aIsSystem === bIsSystem) {
                return a.name.localeCompare(b.name);
            }
            return aIsSystem ? 1 : -1;
        });
    }, [tones]);

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

    const [deletingToneId, setDeletingToneId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setDeletingToneId(id);
    };

    const confirmDeleteTone = () => {
        if (!deletingToneId) return;
        router.delete(tonesDestroy.url({ tone: deletingToneId }), {
            onSuccess: () => {
                setDeletingToneId(null);
            },
        });
    };

    const openEdit = (tone: Tone) => {
        setEditingTone(tone);
        editForm.setData({
            name: tone.name,
            description: tone.description,
        });
    };

    const handleApplyTemplate = (tpl: {
        name: string;
        description: string;
    }) => {
        createForm.setData({
            name: tpl.name,
            description: tpl.description,
        });
        setIsCreateOpen(true);
    };

    return (
        <>
            <Head title="Voice Personas - Nexus AI" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-5 p-3.5 sm:gap-6 sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:pb-5 dark:border-slate-800/80">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <Sparkles className="size-5" />
                            </div>
                            <h1 className="text-xl font-black text-slate-900 sm:text-2xl sm:text-3xl dark:text-white">
                                Voice Personas & Tones
                            </h1>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                            Define your unique vocabulary, tone, and brand
                            persona to personalize generated AI copy.
                        </p>
                    </div>

                    {!isCreateOpen && !editingTone && (
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 font-bold text-white shadow-xl shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 sm:w-auto"
                        >
                            <Plus className="size-4" />
                            Create Persona
                        </Button>
                    )}
                </div>

                {/* Form: Create Tone Form Card */}
                {isCreateOpen && (
                    <Card className="glow-indigo rounded-3xl border border-indigo-500/30 bg-white/90 p-4 shadow-xl backdrop-blur-2xl sm:p-6 dark:bg-[#0c0e1a]/90">
                        <div className="mb-4 flex items-start justify-between border-b border-slate-100 pb-3 sm:mb-5 sm:pb-4 dark:border-slate-800/60">
                            <div>
                                <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 sm:text-base dark:text-white">
                                    <Sparkles className="size-4 text-indigo-600 dark:text-indigo-400" />
                                    Create New Voice Persona
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    Instruct the AI on word choice, formality,
                                    sentence structure, and slang.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="cursor-pointer rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="create_name"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
                                >
                                    Persona Name
                                </label>
                                <input
                                    id="create_name"
                                    type="text"
                                    placeholder="e.g. Visionary Tech Founder, High-Converting Direct Sales, Chill Gen-Z Creator"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:px-4 sm:py-3 sm:text-sm dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100"
                                    required
                                />
                                {createForm.errors.name && (
                                    <span className="mt-1 block text-xs text-rose-500">
                                        {createForm.errors.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="create_description"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
                                >
                                    Voice Guidelines & Rules
                                </label>
                                <textarea
                                    id="create_description"
                                    rows={4}
                                    placeholder="Describe the style. e.g. 'Write with intense confidence and directness. Avoid corporate jargon like synergy or leverage. Use bullet points and 1-line paragraphs.'"
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100"
                                    required
                                />
                                {createForm.errors.description && (
                                    <span className="mt-1 block text-xs text-rose-500">
                                        {createForm.errors.description}
                                    </span>
                                )}
                            </div>

                            {/* Preset Templates */}
                            <div className="flex flex-wrap items-center gap-2 pt-2">
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

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/60">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="cursor-pointer rounded-xl bg-indigo-600 font-bold text-white shadow-md hover:bg-indigo-500"
                                >
                                    {createForm.processing
                                        ? 'Saving...'
                                        : 'Save Voice Persona'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Form: Edit Tone Form Card */}
                {editingTone && (
                    <Card className="glow-indigo rounded-3xl border border-indigo-500/30 bg-white/90 p-4 shadow-xl backdrop-blur-2xl sm:p-6 dark:bg-[#0c0e1a]/90">
                        <div className="mb-4 flex items-start justify-between border-b border-slate-100 pb-3 sm:mb-5 sm:pb-4 dark:border-slate-800/60">
                            <div>
                                <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 sm:text-base dark:text-white">
                                    <Edit2 className="size-4 text-indigo-600 dark:text-indigo-400" />
                                    Edit Persona: {editingTone.name}
                                </h2>
                            </div>
                            <button
                                onClick={() => setEditingTone(null)}
                                className="cursor-pointer rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="edit_name"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
                                >
                                    Persona Name
                                </label>
                                <input
                                    id="edit_name"
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:px-4 sm:py-3 sm:text-sm dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100"
                                    required
                                />
                                {editForm.errors.name && (
                                    <span className="mt-1 block text-xs text-rose-500">
                                        {editForm.errors.name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="edit_description"
                                    className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
                                >
                                    Voice Guidelines & Rules
                                </label>
                                <textarea
                                    id="edit_description"
                                    rows={4}
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-3.5 text-base text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:p-4 sm:text-sm dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100"
                                    required
                                />
                                {editForm.errors.description && (
                                    <span className="mt-1 block text-xs text-rose-500">
                                        {editForm.errors.description}
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-3 dark:border-slate-800/60">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingTone(null)}
                                    className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="cursor-pointer rounded-xl bg-indigo-600 font-bold text-white shadow-md hover:bg-indigo-500"
                                >
                                    {editForm.processing
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Tone Cards Grid */}
                {sortedTones.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        {sortedTones.map((tone) => (
                            <Card
                                key={tone.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-md backdrop-blur-xl transition duration-200 hover:border-indigo-400 hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 dark:hover:border-indigo-500/40"
                            >
                                <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-4 pt-4 pb-3 sm:px-6 sm:pt-5 dark:border-slate-800/60 dark:bg-[#080911]/60">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                                                <span
                                                    className={`flex size-2 rounded-full ${tone.is_system ? 'animate-pulse bg-indigo-500' : 'bg-emerald-500'}`}
                                                />
                                                {tone.name}
                                            </CardTitle>
                                            {tone.is_system && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                                    <Sparkles className="size-2.5" />{' '}
                                                    Preset
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
                                                            description:
                                                                tone.description,
                                                        })
                                                    }
                                                    className="flex min-h-[30px] cursor-pointer items-center gap-1 rounded-xl border border-indigo-500/20 px-2.5 py-1 text-[11px] font-bold text-indigo-600 shadow-2xs transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                                                    title="Duplicate as customizable template"
                                                >
                                                    <Plus className="size-3" />{' '}
                                                    Duplicate
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(tone)
                                                        }
                                                        className="flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                                                        title="Edit tone"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                tone.id,
                                                            )
                                                        }
                                                        className="flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                                                        title="Delete tone"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 px-4 pt-3.5 pb-4 sm:px-6 sm:pt-4 sm:pb-5">
                                    <p className="text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-400">
                                        {tone.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-4 py-2.5 font-mono text-[10px] text-slate-400 sm:px-6 sm:py-3 dark:border-slate-800/60 dark:bg-[#080911]/40">
                                    <span>
                                        {tone.is_system
                                            ? 'Built-in system preset'
                                            : `Configured on ${new Date(tone.created_at).toLocaleDateString()}`}
                                    </span>
                                    {tone.is_system && (
                                        <span className="font-semibold text-emerald-500">
                                            Active in Generator
                                        </span>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="mx-auto my-12 w-full max-w-md rounded-3xl border border-dashed border-slate-200 bg-white/50 p-16 text-center dark:border-slate-800 dark:bg-[#0c0e1a]/50">
                        <Sparkles className="mx-auto mb-3 size-10 text-slate-300 dark:text-slate-700" />
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Define your first voice persona
                        </h3>
                        <p className="mt-1 mb-6 text-xs text-slate-500 dark:text-slate-400">
                            Customize how the AI talks to match your voice or
                            your brand identity perfectly.
                        </p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="cursor-pointer rounded-2xl bg-indigo-600 font-bold text-white shadow-md hover:bg-indigo-500"
                        >
                            Create Voice Tone
                        </Button>
                    </div>
                )}

                {/* Delete Tone Confirmation Dialog */}
                <Dialog
                    open={deletingToneId !== null}
                    onOpenChange={(open) => !open && setDeletingToneId(null)}
                >
                    <DialogContent className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl sm:max-w-md dark:border-slate-800 dark:bg-[#0c0e1a]/95">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base font-extrabold text-rose-600 dark:text-rose-400">
                                <Trash2 className="size-5" />
                                Delete Voice Persona
                            </DialogTitle>
                            <DialogDescription className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                Are you sure you want to delete this custom
                                writing tone? Existing generated copy will
                                preserve its tone snapshot, but the persona
                                itself will be permanently removed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-3 flex flex-row items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800/60">
                            <Button
                                variant="outline"
                                onClick={() => setDeletingToneId(null)}
                                className="cursor-pointer rounded-xl border border-slate-200 text-xs font-semibold dark:border-slate-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDeleteTone}
                                className="cursor-pointer rounded-xl bg-rose-600 text-xs font-bold text-white shadow-md hover:bg-rose-500"
                            >
                                Delete Persona
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
