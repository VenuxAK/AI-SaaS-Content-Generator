import { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    Check,
    CheckCircle2,
    Copy,
    Cpu,
    FileText,
    History,
    Key,
    Layers,
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
    RotateCcw,
    SlidersHorizontal,
    Globe2,
} from 'lucide-react';
import { toast } from 'sonner';

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

interface FormatMeta {
    value: string;
    label: string;
    category: 'social' | 'marketing' | 'longform';
    tag: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    iconBg: string;
    badgeStyle: string;
}

const FORMAT_REGISTRY: Record<string, FormatMeta> = {
    linkedin_post: {
        value: 'linkedin_post',
        label: 'LinkedIn Post',
        category: 'social',
        tag: 'Dwell-Time Hook',
        description: 'Thought leadership, founder stories & industry breakdown',
        icon: Linkedin,
        accentColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        badgeStyle: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    twitter_thread: {
        value: 'twitter_thread',
        label: 'Twitter / X Thread',
        category: 'social',
        tag: 'Viral Narrative',
        description: 'Punchy multi-tweet narrative threads with curiosity gaps',
        icon: Twitter,
        accentColor: 'text-sky-500 dark:text-sky-400',
        iconBg: 'bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 dark:text-sky-400',
        badgeStyle: 'bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/20',
    },
    carousel_slides: {
        value: 'carousel_slides',
        label: 'Carousel Slides',
        category: 'longform',
        tag: 'Visual Decks',
        description: 'Multi-slide educational decks with visual cues & notes',
        icon: Layers,
        accentColor: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
        badgeStyle: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
    ad_copy: {
        value: 'ad_copy',
        label: 'Ad Copy (Paid Media)',
        category: 'marketing',
        tag: 'Direct Response',
        description: 'High-converting Meta Ads, Google Search & offer angles',
        icon: Megaphone,
        accentColor: 'text-amber-500 dark:text-amber-400',
        iconBg: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
        badgeStyle: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    cold_email: {
        value: 'cold_email',
        label: 'Cold Email / Outreach',
        category: 'marketing',
        tag: 'High-Reply Outreach',
        description: 'High-reply B2B sales pitches, follow-ups & partnerships',
        icon: Mail,
        accentColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        badgeStyle: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    blog_post: {
        value: 'blog_post',
        label: 'SEO Blog Article',
        category: 'longform',
        tag: 'Deep-Dive Guide',
        description: 'Comprehensive guides, outlines & SEO meta descriptions',
        icon: FileText,
        accentColor: 'text-indigo-600 dark:text-indigo-400',
        iconBg: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
        badgeStyle: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
    youtube_script: {
        value: 'youtube_script',
        label: 'YouTube Script',
        category: 'longform',
        tag: 'Video Growth',
        description: 'Retention hooks, section breakdown & timestamps',
        icon: Video,
        accentColor: 'text-rose-500 dark:text-rose-400',
        iconBg: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400',
        badgeStyle: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20',
    },
    tiktok_script: {
        value: 'tiktok_script',
        label: 'TikTok Script',
        category: 'longform',
        tag: 'Short-Form Video',
        description: '3-second visual hooks, rapid pacing & viral retention',
        icon: Video,
        accentColor: 'text-pink-500 dark:text-pink-400',
        iconBg: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400',
        badgeStyle: 'bg-pink-500/10 text-pink-500 dark:text-pink-400 border-pink-500/20',
    },
    facebook_post: {
        value: 'facebook_post',
        label: 'Facebook Post',
        category: 'social',
        tag: 'Community Post',
        description: 'Discussion-starting questions, customer stories & launches',
        icon: Share2,
        accentColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        badgeStyle: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    caption: {
        value: 'caption',
        label: 'Social Caption',
        category: 'social',
        tag: 'Micro-Copy',
        description: 'Short Instagram reel captions, quotes & link-in-bio CTAs',
        icon: MessageSquare,
        accentColor: 'text-violet-600 dark:text-violet-400',
        iconBg: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400',
        badgeStyle: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    },
    marketing_copy: {
        value: 'marketing_copy',
        label: 'Marketing Copy',
        category: 'marketing',
        tag: 'Landing Page Hero',
        description: 'High-converting value props, website hero copy & slogans',
        icon: Sparkles,
        accentColor: 'text-orange-500 dark:text-orange-400',
        iconBg: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400',
        badgeStyle: 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20',
    },
};

const FORMAT_SUGGESTIONS: Record<string, Array<{ title: string; prompt: string }>> = {
    linkedin_post: [
        {
            title: 'Founder Hard Truth',
            prompt: 'Share an honest lesson from failing our first product launch and the 3 counter-intuitive principles that transformed our user retention.',
        },
        {
            title: 'Contrarian Take',
            prompt: 'Why most software teams waste 80% of their marketing budget on vanity metrics instead of distribution velocity, with 3 real-world examples.',
        },
        {
            title: 'Zero-to-One Growth',
            prompt: 'Deconstruct how we acquired our first 500 paying users in 60 days without spending a single dollar on paid advertisements.',
        },
    ],
    twitter_thread: [
        {
            title: '10 Curated AI Tools',
            prompt: 'Write a viral 7-tweet thread curating 10 under-the-radar developer tools that save 15+ hours per week, with specific use-cases for each.',
        },
        {
            title: 'Bootstrapped SaaS Autopsy',
            prompt: 'How a solo bootstrapped developer scaled a micro-SaaS from $0 to $15k MRR in 6 months: mistakes, pivots, and distribution tactics.',
        },
        {
            title: 'Mental Models for Builders',
            prompt: '5 mental models high-velocity founders use to make decisions with imperfect information and maintain extreme speed.',
        },
    ],
    carousel_slides: [
        {
            title: '5-Slide Educational Framework',
            prompt: 'Create a 6-slide carousel breakdown teaching non-technical founders how to write copy that converts in under 3 seconds, including slide visuals.',
        },
        {
            title: 'Myth vs Reality Breakdown',
            prompt: '5 common myths about scaling B2B SaaS vs what actually moves the needle in 2026. Include clear visual notes and takeaways for each slide.',
        },
        {
            title: 'Step-by-Step Launch Blueprint',
            prompt: 'A 7-slide step-by-step visual blueprint for testing product-market fit before writing a single line of production code.',
        },
    ],
    ad_copy: [
        {
            title: 'Problem-Agitate-Solve Meta Ad',
            prompt: 'Direct response Facebook/Instagram ad targeting busy marketing leads who are frustrated with slow turnaround and generic freelance copy.',
        },
        {
            title: 'High-Intent Google Search Ad',
            prompt: 'Google Search ad headlines and descriptions highlighting 0% markup BYOK AI generation, privacy encryption, and instant streaming.',
        },
        {
            title: 'Urgent Limited-Offer Hook',
            prompt: 'High-urgency promotional ad copy for a 48-hour flash sale with a 30-day money-back guarantee and clear social proof metrics.',
        },
    ],
    cold_email: [
        {
            title: 'B2B Founder Cold Outreach',
            prompt: 'Write a personalized 75-word cold email to a VP of Marketing offering a free 3-minute audit of their highest-traffic landing page.',
        },
        {
            title: 'Co-Marketing Partnership',
            prompt: 'Pitch a strategic co-marketing webinar or joint case study to a complementary SaaS company with 10k shared target customers.',
        },
        {
            title: 'Gentle Value Follow-Up',
            prompt: 'A warm, zero-guilt follow-up email 4 days after an initial outreach, sharing a practical 1-page cheatsheet relevant to their team.',
        },
    ],
    youtube_script: [
        {
            title: 'Tech Tool Review & Benchmark',
            prompt: 'Create an engaging 8-minute YouTube video script comparing 3 AI coding assistants with retention hooks, chapter timestamps, and B-roll notes.',
        },
        {
            title: 'Step-by-Step Hands-On Tutorial',
            prompt: 'Beginner-friendly tutorial script teaching viewers how to build and deploy an AI web app in a single weekend without complex setups.',
        },
        {
            title: 'Story-Driven Case Study',
            prompt: 'A documentary-style deep dive exploring how a solo engineer built a multi-million dollar software company from their bedroom.',
        },
    ],
    blog_post: [
        {
            title: 'Ultimate Comprehensive Guide',
            prompt: 'The definitive guide to BYOK AI SaaS architectures in 2026: cost optimization, security boundaries, and high-throughput streaming.',
        },
        {
            title: 'Comparison & Buyer\'s Guide',
            prompt: 'Self-hosted AI solutions vs managed APIs: A realistic cost, privacy compliance, and latency benchmark for growing engineering teams.',
        },
        {
            title: 'Problem-Solving How-To',
            prompt: 'How to reduce customer churn by 35% with behavioral onboarding sequences: A tactical implementation guide with concrete templates.',
        },
    ],
    tiktok_script: [
        {
            title: '3-Second Visual Hook & Lifehack',
            prompt: 'Create a 45-second TikTok script starting with a visual hook exposing a common daily mistake, followed by a 10x faster shortcut.',
        },
        {
            title: 'Behind-the-Scenes Workflow',
            prompt: 'Authentic 60-second video script walking through my exact morning routine and the 3 tools that run my online business on autopilot.',
        },
    ],
    facebook_post: [
        {
            title: 'Community Discussion Prompt',
            prompt: 'A thought-provoking community question asking founders about their single biggest operational bottleneck this quarter, with our internal checklist.',
        },
        {
            title: 'Customer Win Case Study',
            prompt: 'Share a real transformation story of how a marketing agency cut client content turnaround from 4 days to 45 minutes using calibrated AI.',
        },
    ],
    caption: [
        {
            title: 'Punchy Instagram Reel Caption',
            prompt: 'A snappy 3-line hook caption for an Instagram Reel about developer productivity, complete with bulleted takeaways and a save-for-later CTA.',
        },
        {
            title: 'Quote & Perspective Reflection',
            prompt: 'A candid reflection on building products in public, balancing perfectionism with shipping velocity, and a question to prompt comments.',
        },
    ],
    marketing_copy: [
        {
            title: 'High-Converting Landing Page Hero',
            prompt: 'Write an irresistible hero section (headline, subhead, primary CTA, and trust badge) for an AI developer platform that eliminates markup.',
        },
        {
            title: '3 Feature ROI Value Props',
            prompt: 'Transform 3 technical capabilities (streaming responses, encrypted BYOK vault, custom personas) into tangible customer business outcomes.',
        },
    ],
};

const DEFAULT_SUGGESTIONS = [
    {
        title: 'Product Feature Launch',
        prompt: 'Announce our new product feature. Emphasize speed, simplicity, and a 30-day money-back guarantee with a bold call to action.',
    },
    {
        title: 'Thought Leadership Take',
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

    const [activeCategory, setActiveCategory] = useState<'all' | 'social' | 'marketing' | 'longform'>('all');
    const [copiedRecentId, setCopiedRecentId] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        content_type: contentTypes[0]?.value || 'linkedin_post',
        output_language: 'en',
        tone_id: '',
        user_prompt: '',
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const typeParam = params.get('type') || params.get('content_type');
            if (typeParam && contentTypes.some((ct) => ct.value === typeParam)) {
                setData('content_type', typeParam);
                const meta = FORMAT_REGISTRY[typeParam];
                if (meta) {
                    setActiveCategory(meta.category);
                }
            }
        }
    }, [contentTypes]);

    const [mobileTab, setMobileTab] = useState<'create' | 'recent'>('create');

    const systemTones = tones.filter((t) => t.is_system);
    const customTones = tones.filter((t) => !t.is_system);

    const activeTone = tones.find((t) => String(t.id) === String(data.tone_id));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(generateStore.url());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!processing && hasApiKey && data.user_prompt.trim()) {
                post(generateStore.url());
            }
        }
    };

    const handleApplySuggestion = (promptText: string) => {
        setData('user_prompt', promptText);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
        toast.info('Quick template applied! Customize to match your campaign.');
    };

    const handleCopyRecent = (id: number, text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedRecentId(id);
        toast.success('Copy saved to clipboard!');
        setTimeout(() => setCopiedRecentId(null), 2000);
    };

    // Filter formats based on category
    const visibleFormats = contentTypes.filter((type) => {
        if (activeCategory === 'all') return true;
        const meta = FORMAT_REGISTRY[type.value];
        return meta?.category === activeCategory;
    });

    const activeMeta = FORMAT_REGISTRY[data.content_type] || FORMAT_REGISTRY['linkedin_post'];
    const currentSuggestions = FORMAT_SUGGESTIONS[data.content_type] || DEFAULT_SUGGESTIONS;

    return (
        <>
            <Head title="AI Studio - Generate Copy" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-x-hidden pb-24 sm:pb-8">
                {/* Studio Header */}
                <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:pb-5 dark:border-slate-800/80 md:flex-row md:items-center md:justify-between min-w-0">
                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                            <div className="flex size-9 sm:size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
                                <PenTool className="size-4.5 sm:size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white shrink-0 whitespace-nowrap">
                                AI Copy Studio
                            </h1>
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 whitespace-nowrap">
                                BYOK 0% Markup
                            </span>
                        </div>
                        <p className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Stream high-converting marketing copy, viral social threads, and blogs directly through your calibrated AI keys.
                        </p>
                    </div>

                    {/* Active Model Quick Badge */}
                    <div className="flex items-center min-w-0">
                        <Link
                            href="/settings/api-keys"
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300 dark:hover:border-indigo-500/50 max-w-full"
                        >
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span className="font-mono text-xs truncate">
                                {providerNames[aiProvider] || 'AI'}: <strong className="font-bold text-slate-900 dark:text-white">{aiModel}</strong>
                            </span>
                            <span className="text-indigo-500 text-[11px] font-bold shrink-0 ml-1">Settings →</span>
                        </Link>
                    </div>
                </div>

                {/* API Key Missing Alert */}
                {(!hasApiKey || pageErrors?.api_key) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-900 dark:text-amber-200 backdrop-blur-md min-w-0"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="rounded-2xl bg-amber-500/20 p-2.5 text-amber-600 dark:text-amber-400 shrink-0">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold">BYOK API Key Required</h4>
                                <p className="text-[11px] sm:text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
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
                <div className="flex lg:hidden items-center p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800 text-xs font-bold shadow-2xs min-w-0">
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
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 min-w-0">
                    {/* Left Studio Input Pane */}
                    <div className={`${mobileTab === 'create' ? 'block' : 'hidden'} lg:block lg:col-span-8 space-y-6 min-w-0`}>
                        <Card className="rounded-3xl border border-slate-200/90 bg-white/95 p-4 sm:p-7 shadow-xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-[#0c0e1a]/95 glow-indigo min-w-0 w-full overflow-hidden">
                            <form onSubmit={submit} className="space-y-6 min-w-0">
                                {/* 1. Target Format Selection with Category Filter Tabs */}
                                <div className="min-w-0 w-full space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                1. Select Target Format
                                            </label>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
                                                Choose the platform format calibrated with specialized anti-cliché prompts
                                            </p>
                                        </div>

                                        {/* Category Tabs */}
                                        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
                                            <button
                                                type="button"
                                                onClick={() => setActiveCategory('all')}
                                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                                    activeCategory === 'all'
                                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                }`}
                                            >
                                                All ({contentTypes.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveCategory('social')}
                                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                                    activeCategory === 'social'
                                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                }`}
                                            >
                                                Social
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveCategory('marketing')}
                                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                                    activeCategory === 'marketing'
                                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                }`}
                                            >
                                                Marketing & Ads
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveCategory('longform')}
                                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                                    activeCategory === 'longform'
                                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                }`}
                                            >
                                                Long-Form & Scripts
                                            </button>
                                        </div>
                                    </div>

                                    {/* Responsive Format Cards Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 max-h-[340px] overflow-y-auto pr-1">
                                        {visibleFormats.map((type) => {
                                            const meta = FORMAT_REGISTRY[type.value] || {
                                                label: type.label,
                                                tag: 'Content',
                                                description: 'Direct AI prompt structure',
                                                icon: FileText,
                                                iconBg: 'bg-indigo-500/10 text-indigo-600',
                                                badgeStyle: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
                                            };
                                            const IconComponent = meta.icon;
                                            const isSelected = data.content_type === type.value;

                                            return (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => setData('content_type', type.value)}
                                                    className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-[0.98] ${
                                                        isSelected
                                                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-100 ring-2 ring-indigo-500/30'
                                                            : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/30 dark:hover:bg-slate-900/60 dark:hover:border-slate-700'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div
                                                            className={`flex size-8 items-center justify-center rounded-xl transition-all ${
                                                                isSelected
                                                                    ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-sm'
                                                                    : meta.iconBg
                                                            }`}
                                                        >
                                                            <IconComponent className="size-4" />
                                                        </div>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold border uppercase tracking-wider ${
                                                                isSelected
                                                                    ? 'bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30'
                                                                    : meta.badgeStyle
                                                            }`}
                                                        >
                                                            {meta.tag}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-xs font-extrabold tracking-tight text-slate-900 dark:text-white">
                                                                {meta.label}
                                                            </h4>
                                                            {isSelected && (
                                                                <Check className="size-3.5 text-indigo-600 dark:text-indigo-400 font-bold" />
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                                            {meta.description}
                                                        </p>
                                                    </div>
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

                                {/* 2. Tone and 3. Language Controls */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                                    {/* Tone Selector with Live Tone Preview */}
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="tone_id"
                                                className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            >
                                                2. Voice Persona & Tone
                                            </label>
                                            <Link
                                                href={tonesIndex.url()}
                                                className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400 inline-flex items-center gap-1 shrink-0"
                                            >
                                                <Sparkles className="size-3" />
                                                Manage Tones →
                                            </Link>
                                        </div>

                                        <Select
                                            value={data.tone_id ? String(data.tone_id) : 'none'}
                                            onValueChange={(val) =>
                                                setData('tone_id', val === 'none' ? '' : val)
                                            }
                                        >
                                            <SelectTrigger className="h-11 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-900 shadow-xs hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100">
                                                <SelectValue placeholder="Select tone..." />
                                            </SelectTrigger>
                                            <SelectContent className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#07080e] rounded-2xl">
                                                <SelectItem value="none">
                                                    Neutral & Natural (Standard Default)
                                                </SelectItem>
                                                {systemTones.length > 0 && (
                                                    <SelectGroup>
                                                        <SelectSeparator className="my-1 border-slate-200/60 dark:border-slate-800/60" />
                                                        <SelectLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
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
                                                        <SelectLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                                                            <Layers className="size-3 text-emerald-500" />
                                                            My Custom Personas
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

                                        {/* Dynamic Tone Description Preview */}
                                        <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 p-2.5 border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400">
                                            {activeTone ? (
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                                                        <span className="size-1.5 rounded-full bg-indigo-500" />
                                                        <span>{activeTone.name}</span>
                                                        <span className="text-[10px] text-slate-400 font-normal">
                                                            ({activeTone.is_system ? 'Built-in' : 'Custom'})
                                                        </span>
                                                    </div>
                                                    <p className="line-clamp-2 text-[10.5px] leading-relaxed">
                                                        {activeTone.description || 'Custom calibrated brand tone persona.'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <span className="size-1.5 rounded-full bg-slate-400" />
                                                    <span>Standard neutral tone with authentic conversational flow.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Instant 2-Pill Output Language Selector */}
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                3. Output Language
                                            </label>
                                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                <Globe2 className="size-3 text-indigo-500" />
                                                Instant 1-Click
                                            </span>
                                        </div>

                                        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#07080e] border border-slate-200 dark:border-slate-800 h-11">
                                            <button
                                                type="button"
                                                onClick={() => setData('output_language', 'en')}
                                                className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                    data.output_language === 'en'
                                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                            >
                                                <span className="text-sm">🇺🇸</span>
                                                <span>English</span>
                                                {data.output_language === 'en' && (
                                                    <Check className="size-3 text-indigo-500 shrink-0 font-bold" />
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('output_language', 'my')}
                                                className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                    data.output_language === 'my'
                                                        ? 'bg-white dark:bg-[#141728] text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                            >
                                                <span className="text-sm">🇲🇲</span>
                                                <span>မြန်မာ (Unicode)</span>
                                                {data.output_language === 'my' && (
                                                    <Check className="size-3 text-indigo-500 shrink-0 font-bold" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/40 p-2.5 border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500">
                                            {data.output_language === 'my' ? (
                                                <span>✨ Localized natural Myanmar copywriting (no literal robotic translations).</span>
                                            ) : (
                                                <span>✨ Native-level English with high conversational burstiness.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Prompt Input Box with Shortcut Indicator & Clear Button */}
                                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <label
                                                htmlFor="user_prompt"
                                                className="block text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            >
                                                4. Campaign Brief & Instructions
                                            </label>
                                            <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                                                ⌘+Enter to send
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {data.user_prompt.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setData('user_prompt', '')}
                                                    className="text-[11px] font-bold text-slate-400 hover:text-rose-500 transition cursor-pointer flex items-center gap-1"
                                                >
                                                    <RotateCcw className="size-3" />
                                                    Clear
                                                </button>
                                            )}
                                            <span
                                                className={`font-mono text-[10px] sm:text-xs font-semibold ${
                                                    data.user_prompt.length > 1800
                                                        ? 'text-rose-500 font-bold'
                                                        : 'text-slate-400'
                                                }`}
                                            >
                                                {data.user_prompt.length} / 2000
                                            </span>
                                        </div>
                                    </div>

                                    <textarea
                                        ref={textareaRef}
                                        id="user_prompt"
                                        rows={4}
                                        placeholder={`Describe what you want to write for this ${activeMeta.label}...\nInclude target audience, core pain point, unique value proposition, or call to action.`}
                                        value={data.user_prompt}
                                        onChange={(e) => setData('user_prompt', e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full box-border resize-none rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 font-sans text-sm leading-relaxed text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-100"
                                        maxLength={2000}
                                        required
                                    />
                                    {errors.user_prompt && (
                                        <span className="mt-1 block text-xs text-rose-500">
                                            {errors.user_prompt}
                                        </span>
                                    )}

                                    {/* Format-Aware Quick-Start Ideas */}
                                    <div className="pt-2 min-w-0 w-full">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <Sparkles className="size-3.5 text-indigo-500 shrink-0" />
                                                <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                    {activeMeta.label} Quick-Start Templates:
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">Click to apply</span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                                            {currentSuggestions.map((sugg, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => handleApplySuggestion(sugg.prompt)}
                                                    className="group flex flex-col justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-indigo-50/70 hover:border-indigo-300 text-left transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-indigo-500/50 dark:hover:bg-slate-900/80 active:scale-95"
                                                >
                                                    <div className="flex items-center justify-between gap-1 mb-1">
                                                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                            {sugg.title}
                                                        </span>
                                                        <span className="text-indigo-500 font-bold text-sm leading-none">+</span>
                                                    </div>
                                                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                        {sugg.prompt}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Studio Button */}
                                <Button
                                    type="submit"
                                    disabled={processing || !hasApiKey || !data.user_prompt.trim()}
                                    className="relative flex min-h-[50px] sm:min-h-[54px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-sm sm:text-base font-extrabold text-white shadow-xl shadow-indigo-600/25 transition-all hover:opacity-95 hover:shadow-indigo-600/35 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            >
                                                <Sparkles className="size-5" />
                                            </motion.div>
                                            <span>Initializing Neural Stream...</span>
                                        </>
                                    ) : hasApiKey ? (
                                        <>
                                            <Sparkles className="size-5 shrink-0" />
                                            <span>Generate {activeMeta.label}</span>
                                            <span className="hidden sm:inline font-normal text-xs text-indigo-100 opacity-80">
                                                (0% Markup Direct Stream)
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Key className="size-5 shrink-0" />
                                            <span>Connect API Key to Generate</span>
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Right Telemetry & Archive Sidebar */}
                    <div className={`${mobileTab === 'recent' ? 'block' : 'hidden'} lg:block lg:col-span-4 space-y-4 sm:space-y-6 min-w-0`}>
                        <div className="flex flex-col-reverse lg:flex-col gap-4 sm:gap-6 min-w-0">
                            {/* BYOK Status Card */}
                            <Card className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 min-w-0">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60 min-w-0">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Direct AI Engine
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                            hasApiKey
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
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

                                <div className="mt-4 flex items-center gap-3.5 min-w-0">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                                        {aiProvider === 'gemini' && <Zap className="size-6" />}
                                        {aiProvider === 'openai' && <Cpu className="size-6" />}
                                        {aiProvider === 'openrouter' && <Layers className="size-6" />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                                            {providerNames[aiProvider] || aiProvider}
                                        </h4>
                                        <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                                            {aiModel}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">Markup Overhead:</span>
                                    <strong className="font-bold text-emerald-600 dark:text-emerald-400">0% (Pure Direct Cost)</strong>
                                </div>

                                <Link
                                    href="/settings/api-keys"
                                    className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <Key className="size-3.5" />
                                    Manage Provider & Keys →
                                </Link>
                            </Card>

                            {/* Recent Generations Feed with Quick Copy */}
                            <Card className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-md backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 min-w-0">
                                <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2">
                                        <History className="size-4 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                            Recent Copies
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
                                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                                        {recentGenerations.map((gen) => {
                                            const meta = FORMAT_REGISTRY[gen.content_type] || FORMAT_REGISTRY['linkedin_post'];
                                            const IconComp = meta.icon;
                                            return (
                                                <div
                                                    key={gen.id}
                                                    className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/30 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900/70"
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="flex size-5 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                                <IconComp className="size-3" />
                                                            </div>
                                                            <span className="text-[11px] font-bold capitalize text-slate-900 dark:text-slate-100">
                                                                {meta.label}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {new Date(gen.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <Link
                                                        href={historyShow.url(gen.id)}
                                                        className="block text-xs font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white line-clamp-2 my-1.5 leading-snug"
                                                    >
                                                        {gen.title || gen.user_prompt}
                                                    </Link>

                                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                                                        <span className="text-[10px] font-mono uppercase text-slate-400">
                                                            {gen.output_language === 'my' ? '🇲🇲 Myanmar' : '🇺🇸 English'}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {gen.ai_content && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCopyRecent(gen.id, gen.ai_content)}
                                                                    className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                                                                    title="Copy Content"
                                                                >
                                                                    {copiedRecentId === gen.id ? (
                                                                        <>
                                                                            <Check className="size-3 text-emerald-500" />
                                                                            <span className="text-emerald-500">Copied</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="size-3" />
                                                                            <span>Copy</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                            <Link
                                                                href={historyShow.url(gen.id)}
                                                                className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                                                            >
                                                                View →
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
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

                {/* Sticky Mobile Floating Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/90 dark:bg-[#07080e]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 lg:hidden z-40 shadow-2xl">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0">
                            {(() => {
                                const Icon = activeMeta.icon;
                                return <Icon className="size-4" />;
                            })()}
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                                {activeMeta.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                                {data.output_language === 'my' ? '🇲🇲 မြန်မာ' : '🇺🇸 English'}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={submit}
                        disabled={processing || !hasApiKey || !data.user_prompt.trim()}
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-xs font-extrabold text-white shadow-md active:scale-95 shrink-0 min-h-[40px]"
                    >
                        {processing ? (
                            <span>Streaming...</span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="size-3.5" />
                                Generate Now
                            </span>
                        )}
                    </Button>
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
