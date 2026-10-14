import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    Check,
    Clock,
    Copy,
    Cpu,
    FileText,
    History,
    Key,
    Layers,
    LayoutGrid,
    Linkedin,
    Megaphone,
    PenTool,
    Sparkles,
    Twitter,
    Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { create as generateCreate } from '@/routes/generate';
import { index as historyIndex, show as historyShow } from '@/routes/history';
import { index as tonesIndex } from '@/routes/tones';

interface Tone {
    id: number;
    name: string;
    is_system?: boolean;
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
    const [quickPrompt, setQuickPrompt] = useState('');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const providerNameMap: Record<string, string> = {
        gemini: 'Google Gemini',
        openai: 'OpenAI',
        openrouter: 'OpenRouter',
    };

    const handleQuickLaunch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(generateCreate.url(), {
            data: quickPrompt ? { user_prompt: quickPrompt } : {},
        });
    };

    const handleCopyText = (id: number, text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Copy saved to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <>
            <Head title="Executive Cockpit - Nexus AI" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6 sm:gap-8 p-3.5 sm:p-6 lg:p-8">
                {/* 1. Cockpit Header Bar */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-5 sm:pb-6 dark:border-slate-800/80">
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <LayoutGrid className="size-5" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                Executive Cockpit
                            </h1>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                BYOK 0% Markup
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Monitor active AI credentials, quickly dispatch generation prompts, and access campaigns.
                        </p>
                    </div>

                    <Link
                        href={generateCreate.url()}
                        className="inline-flex h-11 sm:h-12 w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-xl shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95 shrink-0"
                    >
                        <PenTool className="size-4" />
                        Launch AI Studio
                    </Link>
                </div>

                {/* API Key Missing Alert */}
                {!hasApiKey && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-900 dark:text-amber-200 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-amber-500/20 p-2.5 text-amber-600 dark:text-amber-400 shrink-0">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">API Key Connection Required</h4>
                                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                                    You need an active {providerNameMap[aiProvider] || 'AI'} API key to start generating content.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/settings/api-keys"
                            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition shrink-0 active:scale-95"
                        >
                            <Key className="size-4" />
                            Connect Key Now
                        </Link>
                    </motion.div>
                )}

                {/* 2. 1-Click Quick Launch Prompt Bar */}
                <form
                    onSubmit={handleQuickLaunch}
                    className="relative flex items-center rounded-3xl border border-slate-200/90 bg-white/90 p-1.5 sm:p-2 shadow-xl backdrop-blur-2xl dark:border-slate-800/90 dark:bg-[#0c0e1a]/90 glow-indigo"
                >
                    <div className="hidden xs:flex sm:flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 ml-1.5 sm:ml-2">
                        <Sparkles className="size-4 sm:size-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Jump-start prompt (e.g. 'Viral LinkedIn hook about AI agents')..."
                        value={quickPrompt}
                        onChange={(e) => setQuickPrompt(e.target.value)}
                        className="w-full bg-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-500 font-medium"
                    />
                    <button
                        type="submit"
                        className="inline-flex h-10 sm:h-11 shrink-0 cursor-pointer items-center gap-1.5 sm:gap-2 rounded-2xl bg-indigo-600 px-3.5 sm:px-5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95"
                    >
                        <span className="hidden sm:inline">Start in Studio</span>
                        <span className="sm:hidden">Start</span>
                        <ArrowRight className="size-3 sm:size-3.5" />
                    </button>
                </form>

                {/* 3. Platform Quick-Start Grid */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5">
                        Platform Quick-Starts
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href={generateCreate.url()}
                            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-md backdrop-blur-xl transition-all hover:border-indigo-500 hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 dark:hover:border-indigo-500/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Linkedin className="size-5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Thought Leadership
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                                    LinkedIn Post
                                </h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    High-engagement carousel hooks & stories
                                </p>
                            </div>
                        </Link>

                        <Link
                            href={generateCreate.url()}
                            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-md backdrop-blur-xl transition-all hover:border-indigo-500 hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 dark:hover:border-indigo-500/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                                    <Twitter className="size-5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Viral Hooks
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                                    Twitter / X Thread
                                </h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Punchy multi-tweet narrative threads
                                </p>
                            </div>
                        </Link>

                        <Link
                            href={generateCreate.url()}
                            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-md backdrop-blur-xl transition-all hover:border-indigo-500 hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 dark:hover:border-indigo-500/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                                    <Megaphone className="size-5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Paid Media
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                                    Ad Headlines & Body
                                </h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Direct-response Meta & Google Ad copy
                                </p>
                            </div>
                        </Link>

                        <Link
                            href={generateCreate.url()}
                            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-md backdrop-blur-xl transition-all hover:border-indigo-500 hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 dark:hover:border-indigo-500/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                                    <FileText className="size-5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Editorial
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                                    SEO Blog Article
                                </h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    In-depth guides, outlines, and hooks
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 4. Telemetry Status Grid */}
                <div className="grid gap-5 md:grid-cols-3">
                    {/* Active AI Engine Card */}
                    <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 glow-indigo">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Active Generation Engine
                            </span>
                            <h3 className="mt-1.5 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                {providerNameMap[aiProvider] || aiProvider}
                            </h3>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono font-semibold">
                                {aiModel}
                            </p>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            {aiProvider === 'gemini' && <Zap className="size-6" />}
                            {aiProvider === 'openai' && <Cpu className="size-6" />}
                            {aiProvider === 'openrouter' && <Layers className="size-6" />}
                        </div>
                    </div>

                    {/* Brand Tones Card */}
                    <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Calibrated Personas
                            </span>
                            <h3 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                {tones.length}
                            </h3>
                            <Link
                                href={tonesIndex.url()}
                                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400 mt-0.5 inline-block"
                            >
                                Configure personas →
                            </Link>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <Sparkles className="size-6" />
                        </div>
                    </div>

                    {/* Key Status Card */}
                    <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                BYOK Key Security
                            </span>
                            <h3 className="mt-1.5 text-lg font-black tracking-tight">
                                {hasApiKey ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Active & Encrypted
                                    </span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">Key Needed</span>
                                )}
                            </h3>
                            <Link
                                href="/settings/api-keys"
                                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400 mt-0.5 inline-block"
                            >
                                Manage credentials →
                            </Link>
                        </div>
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Key className="size-6" />
                        </div>
                    </div>
                </div>

                {/* 5. Recent Activity Section */}
                <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white/80 p-4 sm:p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80">
                    <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 dark:border-slate-800/60">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                            <Clock className="size-4.5 sm:size-5 text-indigo-600 dark:text-indigo-400" />
                            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                                Recent Activity
                            </h2>
                        </div>
                        <Link
                            href={historyIndex.url()}
                            className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                            View Archive →
                        </Link>
                    </div>

                    {recentGenerations.length > 0 ? (
                        <>
                            {/* Mobile Cards View (sm and smaller) */}
                            <div className="block md:hidden space-y-3">
                                {recentGenerations.map((gen) => (
                                    <div
                                        key={gen.id}
                                        className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-[#080911]/60 shadow-xs space-y-2.5"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-extrabold capitalize text-slate-900 dark:text-white">
                                                    {gen.content_type.replace('_', ' ')}
                                                </span>
                                                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono uppercase text-slate-600 dark:text-slate-300">
                                                    {gen.output_language}
                                                </span>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${
                                                    gen.status === 'completed'
                                                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        : gen.status === 'failed'
                                                        ? 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                        : 'animate-pulse border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                }`}
                                            >
                                                {gen.status}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {gen.user_prompt}
                                        </p>

                                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                                            <span>{new Date(gen.created_at).toLocaleDateString()}</span>
                                            <span className="capitalize">{gen.tone ? gen.tone.name : 'Standard'}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 gap-2">
                                            {gen.ai_content ? (
                                                <button
                                                    onClick={() => handleCopyText(gen.id, gen.ai_content)}
                                                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300 dark:hover:border-indigo-500/50 shadow-2xs active:scale-95"
                                                >
                                                    {copiedId === gen.id ? (
                                                        <>
                                                            <Check className="size-3.5 text-emerald-500" />
                                                            <span className="text-emerald-500 font-bold">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="size-3.5 text-indigo-500" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : <div />}
                                            <Link
                                                href={historyShow.url(gen.id)}
                                                className="inline-flex min-h-[38px] items-center gap-1 rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-950/70"
                                            >
                                                Detail <ArrowRight className="size-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Data Table (md and larger) */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 dark:border-slate-800/60">
                                            <th className="px-4 py-3">Platform</th>
                                            <th className="px-4 py-3">Prompt Given</th>
                                            <th className="px-4 py-3">Engine</th>
                                            <th className="px-4 py-3">Language</th>
                                            <th className="px-4 py-3">Writing Tone</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentGenerations.map((gen) => (
                                            <tr
                                                key={gen.id}
                                                className="border-b border-slate-100 text-sm transition hover:bg-slate-50/70 dark:border-slate-800/40 dark:hover:bg-slate-900/30"
                                            >
                                                <td className="px-4 py-3.5 font-bold capitalize text-slate-900 dark:text-white">
                                                    {gen.content_type.replace('_', ' ')}
                                                </td>
                                                <td className="max-w-[260px] truncate px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                                                    {gen.user_prompt}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                    <span className="capitalize">{gen.ai_provider || 'Gemini'}</span>
                                                </td>
                                                <td className="px-4 py-3.5 text-xs font-bold uppercase text-slate-700 dark:text-slate-300 font-mono">
                                                    {gen.output_language}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                                                    {gen.tone ? gen.tone.name : 'Standard Default'}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">
                                                    {new Date(gen.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                            gen.status === 'completed'
                                                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : gen.status === 'failed'
                                                                ? 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                                : 'animate-pulse border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                        }`}
                                                    >
                                                        {gen.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right space-x-2">
                                                    {gen.ai_content && (
                                                        <button
                                                            onClick={() => handleCopyText(gen.id, gen.ai_content)}
                                                            title="Copy AI output to clipboard"
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-white shadow-2xs"
                                                        >
                                                            {copiedId === gen.id ? (
                                                                <>
                                                                    <Check className="size-3.5 text-emerald-500" />
                                                                    <span className="text-emerald-500 font-bold">Copied!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="size-3.5 text-indigo-500" />
                                                                    <span>Copy</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={historyShow.url(gen.id)}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        Detail
                                                        <ArrowRight className="size-3" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                            <Clock className="mx-auto mb-2 size-8 text-slate-300 dark:text-slate-700" />
                            <span>No generations made yet. Click &quot;Launch AI Studio&quot; to begin!</span>
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
