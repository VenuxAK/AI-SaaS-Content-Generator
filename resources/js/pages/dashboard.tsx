import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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
    Mail,
    Megaphone,
    MessageSquare,
    PenTool,
    Share2,
    Sparkles,
    Twitter,
    Video,
    Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { create as generateCreate } from '@/routes/generate';
import { index as historyIndex, show as historyShow } from '@/routes/history';
import { index as tonesIndex } from '@/routes/tones';

interface Tone {
    id: number;
    name: string;
    description?: string;
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
    title?: string;
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

interface QuickStartItem {
    type: string;
    label: string;
    tag: string;
    category: 'social' | 'marketing' | 'longform';
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
}

const QUICK_STARTS: QuickStartItem[] = [
    {
        type: 'linkedin_post',
        label: 'LinkedIn Post',
        tag: 'Thought Leadership',
        category: 'social',
        description: 'Dwell-time hooks, founder stories & industry insights',
        icon: Linkedin,
        iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    },
    {
        type: 'twitter_thread',
        label: 'Twitter / X Thread',
        tag: 'Viral Hooks',
        category: 'social',
        description: 'Punchy multi-tweet narrative threads with curiosity gaps',
        icon: Twitter,
        iconBg: 'bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 dark:text-sky-400',
    },
    {
        type: 'carousel_slides',
        label: 'Carousel Slides',
        tag: 'Visual Decks',
        category: 'longform',
        description: 'Multi-slide decks with clear visual cues & notes',
        icon: Layers,
        iconBg: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    },
    {
        type: 'ad_copy',
        label: 'Ad Copy (Paid Media)',
        tag: 'High-Intent Ads',
        category: 'marketing',
        description: 'Direct-response Meta & Google Search ad copy',
        icon: Megaphone,
        iconBg: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
    },
    {
        type: 'cold_email',
        label: 'Cold Email / Outreach',
        tag: 'High Reply Rate',
        category: 'marketing',
        description: 'B2B sales pitches, follow-ups & joint venture proposals',
        icon: Mail,
        iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
        type: 'blog_post',
        label: 'SEO Blog Article',
        tag: 'Deep-Dive Guide',
        category: 'longform',
        description: 'In-depth outlines, guides & SEO meta tags',
        icon: FileText,
        iconBg: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
    },
    {
        type: 'youtube_script',
        label: 'YouTube Script',
        tag: 'Video Growth',
        category: 'longform',
        description: 'Retention hooks, section body breakdown & timestamps',
        icon: Video,
        iconBg: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400',
    },
    {
        type: 'tiktok_script',
        label: 'TikTok Script',
        tag: 'Short-Form Video',
        category: 'longform',
        description: '3-second visual hooks & high-retention pacing',
        icon: Video,
        iconBg: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400',
    },
    {
        type: 'facebook_post',
        label: 'Facebook Post',
        tag: 'Community Reach',
        category: 'social',
        description: 'Discussion-starting questions & customer win stories',
        icon: Share2,
        iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    },
    {
        type: 'caption',
        label: 'Social Caption',
        tag: 'Micro-Copy',
        category: 'social',
        description: 'Snappy Instagram reel captions, quotes & link-in-bio CTAs',
        icon: MessageSquare,
        iconBg: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400',
    },
    {
        type: 'marketing_copy',
        label: 'Marketing Copy',
        tag: 'Website & Landing',
        category: 'marketing',
        description: 'High-converting hero copy, value props & benefits',
        icon: Sparkles,
        iconBg: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400',
    },
];

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    linkedin_post: Linkedin,
    twitter_thread: Twitter,
    carousel_slides: Layers,
    ad_copy: Megaphone,
    cold_email: Mail,
    blog_post: FileText,
    youtube_script: Video,
    tiktok_script: Video,
    facebook_post: Share2,
    caption: MessageSquare,
    marketing_copy: Sparkles,
};

export default function Dashboard({
    aiProvider = 'gemini',
    aiModel = 'gemini-2.5-flash',
    hasApiKey = false,
    tones = [],
    recentGenerations = [],
}: DashboardProps) {
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [quickCategory, setQuickCategory] = useState<'all' | 'social' | 'marketing' | 'longform'>('all');

    const providerNameMap: Record<string, string> = {
        gemini: 'Google Gemini',
        openai: 'OpenAI',
        openrouter: 'OpenRouter',
    };

    const handleCopyText = (id: number, text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Copy saved to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredQuickStarts = QUICK_STARTS.filter((item) => {
        if (quickCategory === 'all') return true;
        return item.category === quickCategory;
    });

    return (
        <>
            <Head title="Executive Cockpit - Nexus AI" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6 sm:gap-8 p-3.5 sm:p-6 lg:p-8">
                {/* 1. Cockpit Header Bar */}
                <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:pb-6 dark:border-slate-800/80 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            <div className="flex size-9 sm:size-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <LayoutGrid className="size-5" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                Executive Cockpit
                            </h1>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                BYOK 0% Markup
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Monitor calibrated credentials, launch targeted copy campaigns, and inspect recent generations.
                        </p>
                    </div>

                    <Link
                        href={generateCreate.url()}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-indigo-600/20 hover:opacity-95 transition active:scale-95 shrink-0"
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

                {/* 2. Platform Quick-Starts with Category Filters */}
                <div className="space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-indigo-500" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Launch Platform Quick-Starts
                            </h3>
                        </div>

                        {/* Category Segmented Controls */}
                        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
                            <button
                                type="button"
                                onClick={() => setQuickCategory('all')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                    quickCategory === 'all'
                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                All (11)
                            </button>
                            <button
                                type="button"
                                onClick={() => setQuickCategory('social')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                    quickCategory === 'social'
                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                Social
                            </button>
                            <button
                                type="button"
                                onClick={() => setQuickCategory('marketing')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                    quickCategory === 'marketing'
                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                Marketing & Ads
                            </button>
                            <button
                                type="button"
                                onClick={() => setQuickCategory('longform')}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                    quickCategory === 'longform'
                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                Editorial & Video
                            </button>
                        </div>
                    </div>

                    {/* Quick-Starts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {filteredQuickStarts.map((item) => {
                            const IconComp = item.icon;
                            return (
                                <Link
                                    key={item.type}
                                    href={generateCreate.url({ query: { type: item.type } })}
                                    className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-4 sm:p-5 shadow-sm backdrop-blur-xl transition-all hover:border-indigo-500 hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 dark:hover:border-indigo-500/50 active:scale-[0.98]"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`flex size-10 items-center justify-center rounded-2xl ${item.iconBg}`}>
                                            <IconComp className="size-5" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {item.tag}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                                                {item.label}
                                            </h4>
                                            <ArrowRight className="size-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Telemetry Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
                    {/* Active AI Engine Card */}
                    <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-4.5 sm:p-6 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 glow-indigo">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Active Generation Engine
                            </span>
                            <h3 className="mt-1 text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                {providerNameMap[aiProvider] || aiProvider}
                            </h3>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono font-semibold">
                                {aiModel}
                            </p>
                        </div>
                        <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                            {aiProvider === 'gemini' && <Zap className="size-5 sm:size-6" />}
                            {aiProvider === 'openai' && <Cpu className="size-5 sm:size-6" />}
                            {aiProvider === 'openrouter' && <Layers className="size-5 sm:size-6" />}
                        </div>
                    </div>

                    {/* Brand Tones Card */}
                    <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-4.5 sm:p-6 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Calibrated Personas
                            </span>
                            <h3 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                {tones.length}
                            </h3>
                            <Link
                                href={tonesIndex.url()}
                                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400 mt-0.5 inline-block"
                            >
                                Configure personas →
                            </Link>
                        </div>
                        <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                            <Sparkles className="size-5 sm:size-6" />
                        </div>
                    </div>

                    {/* Key Status Card */}
                    <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-4.5 sm:p-6 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                BYOK Key Security
                            </span>
                            <h3 className="mt-1 text-base sm:text-lg font-black tracking-tight">
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
                        <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Key className="size-5 sm:size-6" />
                        </div>
                    </div>
                </div>

                {/* 4. Recent Activity Section with Direct Humanizer & Copy Actions */}
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
                            {/* Mobile Cards View */}
                            <div className="block md:hidden space-y-3">
                                {recentGenerations.map((gen) => {
                                    const IconComp = PLATFORM_ICONS[gen.content_type] || FileText;
                                    return (
                                        <div
                                            key={gen.id}
                                            className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-[#080911]/60 shadow-xs space-y-2.5"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                        <IconComp className="size-3.5" />
                                                    </div>
                                                    <span className="text-xs font-extrabold capitalize text-slate-900 dark:text-white">
                                                        {gen.content_type.replace('_', ' ')}
                                                    </span>
                                                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono uppercase text-slate-600 dark:text-slate-300">
                                                        {gen.output_language === 'my' ? '🇲🇲 MY' : '🇺🇸 EN'}
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

                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                                                {gen.title || gen.user_prompt}
                                            </p>

                                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                                                <span>{new Date(gen.created_at).toLocaleDateString()}</span>
                                                <span className="capitalize">{gen.tone ? gen.tone.name : 'Standard'}</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-1 gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    {gen.ai_content && (
                                                        <button
                                                            onClick={() => handleCopyText(gen.id, gen.ai_content)}
                                                            className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300 shadow-2xs active:scale-95"
                                                        >
                                                            {copiedId === gen.id ? (
                                                                <>
                                                                    <Check className="size-3.5 text-emerald-500" />
                                                                    <span className="text-emerald-500 font-bold">Copied</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="size-3.5 text-indigo-500" />
                                                                    <span>Copy</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                    {gen.ai_content && (
                                                        <Link
                                                            href={historyShow.url(gen.id) + '?humanize=1'}
                                                            className="inline-flex min-h-[36px] items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-50/60 dark:bg-purple-950/20 px-2.5 py-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/40"
                                                        >
                                                            <Sparkles className="size-3" />
                                                            Humanize
                                                        </Link>
                                                    )}
                                                </div>
                                                <Link
                                                    href={historyShow.url(gen.id)}
                                                    className="inline-flex min-h-[36px] items-center gap-1 rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400"
                                                >
                                                    Detail <ArrowRight className="size-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Desktop Data Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 dark:border-slate-800/60">
                                            <th className="px-4 py-3">Platform</th>
                                            <th className="px-4 py-3">Prompt / Topic</th>
                                            <th className="px-4 py-3">Engine</th>
                                            <th className="px-4 py-3">Lang</th>
                                            <th className="px-4 py-3">Tone Persona</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentGenerations.map((gen) => {
                                            const IconComp = PLATFORM_ICONS[gen.content_type] || FileText;
                                            return (
                                                <tr
                                                    key={gen.id}
                                                    className="border-b border-slate-100 text-sm transition hover:bg-slate-50/70 dark:border-slate-800/40 dark:hover:bg-slate-900/30"
                                                >
                                                    <td className="px-4 py-3.5 font-bold capitalize text-slate-900 dark:text-white">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                                <IconComp className="size-3.5" />
                                                            </div>
                                                            <span>{gen.content_type.replace('_', ' ')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="max-w-[240px] truncate px-4 py-3.5 text-xs text-slate-700 dark:text-slate-300 font-medium" title={gen.title || gen.user_prompt}>
                                                        {gen.title || gen.user_prompt}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                        <span className="capitalize">{gen.ai_provider || 'Gemini'}</span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-xs font-bold uppercase text-slate-700 dark:text-slate-300 font-mono">
                                                        {gen.output_language === 'my' ? '🇲🇲 MY' : '🇺🇸 EN'}
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
                                                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                                                        {gen.ai_content && (
                                                            <button
                                                                onClick={() => handleCopyText(gen.id, gen.ai_content)}
                                                                title="Copy AI output"
                                                                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300 dark:hover:border-indigo-500/50 shadow-2xs"
                                                            >
                                                                {copiedId === gen.id ? (
                                                                    <>
                                                                        <Check className="size-3 text-emerald-500" />
                                                                        <span className="text-emerald-500 font-bold">Copied</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy className="size-3 text-indigo-500" />
                                                                        <span>Copy</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                        {gen.ai_content && (
                                                            <Link
                                                                href={historyShow.url(gen.id) + '?humanize=1'}
                                                                title="Humanize this copy"
                                                                className="inline-flex items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-50/60 dark:bg-purple-950/20 px-2.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/40"
                                                            >
                                                                <Sparkles className="size-3" />
                                                                Humanize
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href={historyShow.url(gen.id)}
                                                            className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                                                        >
                                                            Detail
                                                            <ArrowRight className="size-3" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                            <Clock className="mx-auto mb-2 size-8 text-slate-300 dark:text-slate-700" />
                            <span>No generations made yet. Select a platform above to start generating!</span>
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
