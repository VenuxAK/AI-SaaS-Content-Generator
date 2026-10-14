import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Clock,
    Cpu,
    History,
    Key,
    LayoutGrid,
    PenTool,
    Sparkles,
    Zap,
} from 'lucide-react';

import { create as generateCreate } from '@/routes/generate';
import { index as historyIndex, show as historyShow } from '@/routes/history';
import { index as tonesIndex } from '@/routes/tones';

interface Tone {
    id: number;
    name: string;
}

interface Option {
    value: string;
    label: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    ai_content: string | null;
    status: string;
    created_at: string;
    ai_provider?: string | null;
    ai_model?: string | null;
    tone?: Tone | null;
}

interface DashboardProps {
    aiProvider: string;
    aiModel: string;
    hasApiKey: boolean;
    tones: Tone[];
    contentTypes: Option[];
    outputLanguages: Option[];
    recentGenerations: Generation[];
}

export default function Dashboard({
    aiProvider = 'gemini',
    aiModel = 'gemini-2.5-flash',
    hasApiKey = false,
    tones = [],
    recentGenerations = [],
}: DashboardProps) {
    const providerNameMap: Record<string, string> = {
        gemini: 'Google Gemini',
        openai: 'OpenAI',
        openrouter: 'OpenRouter',
    };

    return (
        <>
            <Head title="Dashboard Overview" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6 p-6">
                {/* Header Title */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">
                            <LayoutGrid className="size-6 text-indigo-600 dark:text-indigo-400" />
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Bring your own API key to generate high-converting copy across platforms with customized voice personas.
                        </p>
                    </div>
                    <Link
                        href={generateCreate.url()}
                        className="inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-xs shadow-indigo-600/10 transition hover:bg-indigo-500"
                    >
                        <PenTool className="size-4" />
                        Create New Copy
                    </Link>
                </div>

                {/* API Key Missing Alert */}
                {!hasApiKey && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-amber-500/20 p-2 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">API Key Required</h4>
                                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                                    You need an active {providerNameMap[aiProvider] || 'AI'} API key to start generating content.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/settings/api-keys"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition shrink-0"
                        >
                            <Key className="size-3.5" />
                            Set Up API Key
                        </Link>
                    </div>
                )}

                {/* Header Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                Active AI Engine
                            </p>
                            <h3 className="mt-1 text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">
                                {providerNameMap[aiProvider] || aiProvider}
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                                {aiModel}
                            </p>
                        </div>
                        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                            {aiProvider === 'gemini' && <Sparkles className="size-6" />}
                            {aiProvider === 'openai' && <Cpu className="size-6" />}
                            {aiProvider === 'openrouter' && <Zap className="size-6" />}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                Custom Personas
                            </p>
                            <h3 className="mt-1 text-3xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">
                                {tones.length}
                            </h3>
                            <Link
                                href={tonesIndex.url()}
                                className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 mt-0.5 inline-block"
                            >
                                Manage tones →
                            </Link>
                        </div>
                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <Sparkles className="size-6" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                BYOK Key Status
                            </p>
                            <h3 className="mt-1 text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">
                                {hasApiKey ? (
                                    <span className="text-emerald-600 dark:text-emerald-400">Connected</span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">Key Needed</span>
                                )}
                            </h3>
                            <Link
                                href="/settings/api-keys"
                                className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 mt-0.5 inline-block"
                            >
                                Configure keys →
                            </Link>
                        </div>
                        <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                            <Key className="size-6" />
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href={generateCreate.url()}
                        className="group flex min-h-[120px] flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-indigo-500/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-500/40"
                    >
                        <PenTool className="size-5 text-indigo-600 dark:text-indigo-400" />
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 transition group-hover:text-indigo-600 dark:text-neutral-50 dark:group-hover:text-indigo-400">
                                Write Copy
                            </h4>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                Start a new AI content stream
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={tonesIndex.url()}
                        className="group flex min-h-[120px] flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-emerald-500/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-500/40"
                    >
                        <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 transition group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">
                                Tone Personas
                            </h4>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                Define customized voice personas
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={historyIndex.url()}
                        className="group flex min-h-[120px] flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-amber-500/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-500/40"
                    >
                        <History className="size-5 text-amber-600 dark:text-amber-400" />
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 transition group-hover:text-amber-600 dark:text-neutral-50 dark:group-hover:text-amber-400">
                                History Log
                            </h4>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                Browse all generated copywriting
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/settings/api-keys"
                        className="group flex min-h-[120px] flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-purple-500/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-purple-500/40"
                    >
                        <Key className="size-5 text-purple-600 dark:text-purple-400" />
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 transition group-hover:text-purple-600 dark:text-neutral-50 dark:group-hover:text-purple-400">
                                AI & API Keys
                            </h4>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                Configure BYOK keys & default models
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Detailed Recent History Grid */}
                <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                            <Clock className="size-5 text-indigo-600 dark:text-indigo-400" />
                            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                                Recent Activity Logs
                            </h2>
                        </div>
                        <Link
                            href={historyIndex.url()}
                            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                            View All History →
                        </Link>
                    </div>

                    {recentGenerations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-neutral-100 text-[10px] font-bold uppercase text-neutral-400 dark:border-neutral-800">
                                        <th className="px-4 py-3">Content Type</th>
                                        <th className="px-4 py-3">Prompt</th>
                                        <th className="px-4 py-3">Engine</th>
                                        <th className="px-4 py-3">Language</th>
                                        <th className="px-4 py-3">Writing Tone</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentGenerations.map((gen) => (
                                        <tr
                                            key={gen.id}
                                            className="border-b border-neutral-100 text-sm transition hover:bg-neutral-50/50 dark:border-neutral-800/60 dark:hover:bg-neutral-950/20"
                                        >
                                            <td className="px-4 py-3.5 font-bold capitalize text-neutral-900 dark:text-neutral-100">
                                                {gen.content_type.replace('_', ' ')}
                                            </td>
                                            <td className="max-w-[240px] truncate px-4 py-3.5 text-xs text-neutral-500 dark:text-neutral-400">
                                                {gen.user_prompt}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                                                <span className="capitalize">{gen.ai_provider || 'Gemini'}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                                                {gen.output_language}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-neutral-500 dark:text-neutral-400">
                                                {gen.tone ? gen.tone.name : 'Standard Default'}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-neutral-400">
                                                {new Date(gen.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        gen.status === 'completed'
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-950/30 dark:bg-emerald-950/20 dark:text-emerald-400'
                                                            : gen.status === 'failed'
                                                            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-950/30 dark:bg-rose-950/20 dark:text-rose-400'
                                                            : 'animate-pulse border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-950/30 dark:bg-indigo-950/20 dark:text-indigo-400'
                                                    }`}
                                                >
                                                    {gen.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <Link
                                                    href={historyShow.url(gen.id)}
                                                    className="group/btn inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    View Details
                                                    <ArrowRight className="size-3.5 transition group-hover/btn:translate-x-0.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-sm text-neutral-400 dark:text-neutral-500">
                            <Clock className="mx-auto mb-2 size-8 text-neutral-300 dark:text-neutral-700" />
                            <span>No generations made yet. Click &quot;Create New Copy&quot; to get started!</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
