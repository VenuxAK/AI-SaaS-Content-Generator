import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Cpu,
    FileText,
    History,
    Key,
    Layers,
    Linkedin,
    Megaphone,
    Mail,
    PenTool,
    Share2,
    Sparkles,
    Twitter,
    Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { store as generateStore } from '@/routes/generate';
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
    tone?: Tone | null;
}

interface CreateProps {
    tones: Tone[];
    contentTypes: Option[];
    outputLanguages: Option[];
    recentGenerations?: Generation[];
    aiProvider?: string;
    aiModel?: string;
    hasApiKey?: boolean;
}

const PLATFORM_ICONS: Record<string, typeof Linkedin> = {
    linkedin_post: Linkedin,
    twitter_thread: Twitter,
    facebook_post: Share2,
    blog_post: FileText,
    ad_copy: Megaphone,
    cold_email: Mail,
};

const PROMPT_SUGGESTIONS = [
    {
        title: 'Launch Announcement',
        prompt: 'Announce the launch of our new product feature. Emphasize speed, simplicity, and a 30-day money-back guarantee with a bold call to action.',
    },
    {
        title: 'Thought Leadership',
        prompt: 'Share a contrarian take on why conventional industry wisdom is broken, supported by 3 practical lessons learned from scaling to 10k users.',
    },
    {
        title: 'Direct Response Pitch',
        prompt: 'Write an irresistible hook addressing the #1 frustration of solo founders, followed by our solution and social proof.',
    },
];

export default function Create({
    tones,
    contentTypes,
    outputLanguages,
    recentGenerations = [],
    aiProvider = 'gemini',
    aiModel = 'gemini-2.5-flash',
    hasApiKey = false,
}: CreateProps) {
    const { errors: pageErrors } = usePage().props;

    const providerNames: Record<string, string> = {
        gemini: 'Google Gemini',
        openai: 'OpenAI',
        openrouter: 'OpenRouter',
    };

    const { data, setData, post, processing, errors } = useForm({
        content_type: contentTypes[0]?.value || 'facebook_post',
        output_language: 'en',
        tone_id: '',
        user_prompt: '',
    });

    const [mobileTab, setMobileTab] = useState<'create' | 'recent'>('create');

    const systemTones = tones.filter((t) => t.is_system);
    const customTones = tones.filter((t) => !t.is_system);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(generateStore.url());
    };

    const handleApplySuggestion = (promptText: string) => {
        setData('user_prompt', promptText);
    };

    return (
        <>
            <Head title="AI Studio - Generate Copy" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 sm:gap-6 p-3.5 sm:p-6 lg:p-8">
                {/* Studio Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-4 sm:pb-5 dark:border-slate-800/80">
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <PenTool className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                AI Copy Studio
                            </h1>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                BYOK Active
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Craft high-impact copy, multi-platform threads, and blogs streamed directly through your calibrated AI keys.
                        </p>
                    </div>

                    {/* Active Model Quick Badge */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/settings/api-keys"
                            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-white"
                        >
                            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-mono truncate max-w-[200px] sm:max-w-none">{providerNames[aiProvider] || 'AI'}: {aiModel}</span>
                            <span className="text-slate-400 text-[10px]">Change →</span>
                        </Link>
                    </div>
                </div>

                {/* API Key Missing Alert */}
                {(!hasApiKey || pageErrors?.api_key) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-900 dark:text-amber-200 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-600 dark:text-amber-400 shrink-0">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">BYOK API Key Required</h4>
                                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                                    {pageErrors?.api_key ||
                                        `Connect your ${providerNames[aiProvider] || 'AI'} API key to unlock zero-markup streaming generation.`}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/settings/api-keys"
                            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition shrink-0 active:scale-95"
                        >
                            <Key className="size-4" />
                            Configure Key
                        </Link>
                    </motion.div>
                )}

                {/* Mobile Segmented Switcher (Studio Form vs Recent Copies) */}
                <div className="flex lg:hidden items-center p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800 text-xs font-bold shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setMobileTab('create')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                            mobileTab === 'create'
                                ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <PenTool className="size-3.5" />
                        AI Studio
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileTab('recent')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                            mobileTab === 'recent'
                                ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <History className="size-3.5" />
                        Past Copies ({recentGenerations.length})
                    </button>
                </div>

                {/* Split-Pane Studio Layout */}
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
                    {/* Left Studio Input Pane */}
                    <div className={`${mobileTab === 'create' ? 'block' : 'hidden'} lg:block lg:col-span-8 space-y-6`}>
                        <Card className="rounded-3xl border border-slate-200/90 bg-white/90 p-4 sm:p-8 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-[#0c0e1a]/90 glow-indigo">
                            <form onSubmit={submit} className="space-y-5 sm:space-y-6">
                                {/* 1. Target Platform Selection Pills */}
                                <div>
                                    <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        1. Select Target Format
                                    </label>
                                    <div className="flex sm:grid sm:grid-cols-3 gap-2 sm:gap-2.5 overflow-x-auto sm:overflow-visible no-scrollbar pb-1 sm:pb-0 -mx-1 px-1">
                                        {contentTypes.map((type) => {
                                            const IconComponent = PLATFORM_ICONS[type.value] || FileText;
                                            const isSelected = data.content_type === type.value;
                                            return (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => setData('content_type', type.value)}
                                                    className={`flex shrink-0 sm:shrink cursor-pointer items-center gap-2 sm:gap-2.5 rounded-2xl border p-2.5 sm:p-3 text-left transition-all active:scale-95 ${
                                                        isSelected
                                                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20'
                                                            : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-slate-700'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${
                                                            isSelected
                                                                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                                                : 'bg-slate-200/60 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        <IconComponent className="size-4" />
                                                    </div>
                                                    <span className="text-xs whitespace-nowrap font-semibold">
                                                        {type.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.content_type && (
                                        <span className="mt-1.5 block text-xs text-rose-500">
                                            {errors.content_type}
                                        </span>
                                    )}
                                </div>

                                {/* 2. Tone and Language */}
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* Tone Selector */}
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label
                                                htmlFor="tone_id"
                                                className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            >
                                                2. Voice Tone
                                            </label>
                                            <Link
                                                href={tonesIndex.url()}
                                                className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 inline-flex items-center gap-1"
                                            >
                                                <Sparkles className="size-3" />
                                                Manage Tones
                                            </Link>
                                        </div>

                                        <Select
                                            value={data.tone_id ? String(data.tone_id) : 'none'}
                                            onValueChange={(val) =>
                                                setData('tone_id', val === 'none' ? '' : val)
                                            }
                                        >
                                            <SelectTrigger className="h-11 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-xs hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100">
                                                <SelectValue placeholder="Select writing tone" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#07080e]">
                                                <SelectItem value="none">
                                                    Neutral & Natural (Standard Default)
                                                </SelectItem>
                                                {systemTones.length > 0 && (
                                                    <SelectGroup>
                                                        <SelectSeparator className="my-1 border-slate-200/60 dark:border-slate-800/60" />
                                                        <SelectLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5 flex items-center gap-1.5">
                                                            <Sparkles className="size-3 text-indigo-500" />
                                                            Built-in Presets
                                                        </SelectLabel>
                                                        {systemTones.map((t) => (
                                                            <SelectItem key={t.id} value={String(t.id)}>
                                                                {t.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                )}
                                                {customTones.length > 0 && (
                                                    <SelectGroup>
                                                        <SelectSeparator className="my-1 border-slate-200/60 dark:border-slate-800/60" />
                                                        <SelectLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5 flex items-center gap-1.5">
                                                            <Layers className="size-3 text-emerald-500" />
                                                            My Custom Tones
                                                        </SelectLabel>
                                                        {customTones.map((t) => (
                                                            <SelectItem key={t.id} value={String(t.id)}>
                                                                {t.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.tone_id && (
                                            <span className="mt-1 block text-xs text-rose-500">
                                                {errors.tone_id}
                                            </span>
                                        )}
                                    </div>

                                    {/* Output Language */}
                                    <div>
                                        <label
                                            htmlFor="output_language"
                                            className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                        >
                                            3. Output Language
                                        </label>
                                        <Select
                                            value={data.output_language}
                                            onValueChange={(val) => setData('output_language', val)}
                                        >
                                            <SelectTrigger className="h-11 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 shadow-xs hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#07080e]">
                                                {outputLanguages.map((lang) => (
                                                    <SelectItem key={lang.value} value={lang.value}>
                                                        {lang.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.output_language && (
                                            <span className="mt-1 block text-xs text-rose-500">
                                                {errors.output_language}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 3. Prompt Input Box */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="user_prompt"
                                            className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                        >
                                            4. Topic & Campaign Instructions
                                        </label>
                                        <span className="font-mono text-xs text-slate-400">
                                            {data.user_prompt.length} / 2000
                                        </span>
                                    </div>

                                    <textarea
                                        id="user_prompt"
                                        rows={4}
                                        placeholder="Describe your product, core hook, target persona, and desired takeaway..."
                                        value={data.user_prompt}
                                        onChange={(e) => setData('user_prompt', e.target.value)}
                                        className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 font-sans text-base sm:text-sm leading-relaxed text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100"
                                        maxLength={2000}
                                        required
                                    />
                                    {errors.user_prompt && (
                                        <span className="mt-1 block text-xs text-rose-500">
                                            {errors.user_prompt}
                                        </span>
                                    )}

                                    {/* Quick Prompt Ideas */}
                                    <div className="mt-3">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Sparkles className="size-3 text-indigo-500" />
                                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Quick-Start Ideas:
                                            </span>
                                        </div>
                                        <div className="flex overflow-x-auto sm:flex-wrap no-scrollbar gap-2 pb-1 -mx-1 px-1">
                                            {PROMPT_SUGGESTIONS.map((sugg, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => handleApplySuggestion(sugg.prompt)}
                                                    className="cursor-pointer shrink-0 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-300 active:scale-95 min-h-[38px] flex items-center gap-1"
                                                >
                                                    <span className="text-indigo-500 font-bold">+</span>
                                                    <span>{sugg.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Studio Button */}
                                <Button
                                    type="submit"
                                    disabled={processing || !hasApiKey}
                                    className="flex min-h-[50px] sm:h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm sm:text-base font-black text-white shadow-xl shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-indigo-600/35 active:scale-95 disabled:opacity-50"
                                >
                                    <Sparkles className="size-4.5 sm:size-5" />
                                    {processing
                                        ? 'Initializing Neural Stream...'
                                        : hasApiKey
                                        ? 'Launch Generation Stream'
                                        : 'Connect API Key to Generate'}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Right Telemetry & Archive Sidebar */}
                    <div className={`${mobileTab === 'recent' ? 'block' : 'hidden'} lg:block lg:col-span-4 space-y-5 sm:space-y-6`}>
                        {/* BYOK Status Card */}
                        <Card className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 sm:p-6 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Direct AI Engine
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                        hasApiKey
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    }`}
                                >
                                    <span
                                        className={`size-2 rounded-full ${
                                            hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                                        }`}
                                    />
                                    {hasApiKey ? 'Connected' : 'Missing Key'}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center gap-3.5">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    {aiProvider === 'gemini' && <Zap className="size-6" />}
                                    {aiProvider === 'openai' && <Cpu className="size-6" />}
                                    {aiProvider === 'openrouter' && <Layers className="size-6" />}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                        {providerNames[aiProvider] || aiProvider}
                                    </h4>
                                    <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[180px]">
                                        {aiModel}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-400">Platform Markup:</span>
                                <strong className="font-bold text-emerald-600 dark:text-emerald-400">0% (Pure Direct API)</strong>
                            </div>

                            <Link
                                href="/settings/api-keys"
                                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Key className="size-3.5" />
                                Manage Provider & Keys →
                            </Link>
                        </Card>

                        {/* Recent Generations Feed */}
                        <Card className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80">
                            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60">
                                <div className="flex items-center gap-2">
                                    <History className="size-4 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Recent Generations
                                    </h3>
                                </div>
                                <Link
                                    href={historyIndex.url()}
                                    className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    All ({recentGenerations.length})
                                </Link>
                            </div>

                            {recentGenerations.length > 0 ? (
                                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                                    {recentGenerations.map((gen) => (
                                        <Link
                                            key={gen.id}
                                            href={historyShow.url(gen.id)}
                                            className="group block rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-indigo-200 hover:bg-indigo-50/30 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900/70"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold capitalize text-slate-900 dark:text-slate-100">
                                                    {gen.content_type.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {new Date(gen.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-xs text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200">
                                                {gen.user_prompt}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                                    No copies generated yet. Your past generations will appear here.
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'AI Copy Studio', href: '/generate' },
    ],
};
