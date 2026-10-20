import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    Copy,
    Check,
    Cpu,
    Layers,
    Lock,
    Moon,
    PenTool,
    Shield,
    Sparkles,
    Sun,
    TrendingUp,
    Zap,
    Linkedin,
    Twitter,
    FileText,
    Megaphone,
    X as CloseIcon,
    ChevronDown,
    ArrowUp,
    Menu,
} from 'lucide-react';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';

import { GridBackground } from '@/components/ui/grid-background';
import { useAppearance } from '@/hooks/use-appearance';
import { dashboard, login, register } from '@/routes';

interface DemoPreset {
    id: string;
    label: string;
    platform: string;
    icon: typeof Linkedin;
    tone: string;
    model: string;
    prompt: string;
    output: string;
    stats: {
        words: number;
        chars: number;
        latency: string;
    };
}

const DEMO_PRESETS: DemoPreset[] = [
    {
        id: 'linkedin',
        label: 'LinkedIn Post',
        platform: 'LinkedIn',
        icon: Linkedin,
        tone: 'Visionary & Bold',
        model: 'Gemini 3.8 Flash',
        prompt: 'Why bringing your own API keys is replacing traditional AI SaaS subscriptions.',
        output: `Most companies are overpaying for AI copy. Here's the uncomfortable truth:

When you pay $49/mo for an "AI copywriting tool", 90% of that price isn't the AI.
It's SaaS markup on top of raw API tokens.

Here is the new playbook:
1. Grab a direct API key from Google Gemini or OpenAI.
2. Plug it into an open, high-performance generation studio.
3. Pay literal fractions of a cent per 1,000 words.

Zero artificial credit limits.
Zero monthly subscription bloat.
Full ownership of your prompts and brand voice.

The future of software isn't renting tokens—it's owning your pipeline.

Are you still paying credit markups? Drop your thoughts below. 👇`,
        stats: { words: 104, chars: 628, latency: '0.24s' },
    },
    {
        id: 'twitter',
        label: 'Viral X Thread',
        platform: 'Twitter / X',
        icon: Twitter,
        tone: 'Punchy & Engaging',
        model: 'GPT-5 (OpenAI)',
        prompt: 'A viral 4-tweet thread breaking down prompt engineering tips for marketing copy.',
        output: `How the top 1% write AI copy that actually converts (and doesn't sound like a generic robot): 🧵👇

1/ Stop asking for "good copy."
Instead, give the AI a negative constraint:
"Write without buzzwords, no adjectives like 'game-changer' or 'revolutionize', and maintain an 8th-grade reading level."

2/ Anchor your persona:
Instead of "Act as a marketer", specify:
"Act as a direct-response copywriter who has written $10M in B2B SaaS landing pages."

3/ One idea per line:
White space creates momentum. If your readers' eyes feel strained, your bounce rate doubles.

Plug in your keys, iterate rapidly, and let data dictate your headlines. ⚡`,
        stats: { words: 108, chars: 642, latency: '0.31s' },
    },
    {
        id: 'ads',
        label: 'High-Converting Ad',
        platform: 'Meta & Google Ads',
        icon: Megaphone,
        tone: 'High-Converting Sales',
        model: 'Claude 3.7 Sonnet',
        prompt: 'Ad copy for an AI productivity app focused on eliminating busywork for solo founders.',
        output: `🚀 Headline: Stop Trading 14 Hours a Day for 2 Hours of Progress.

Primary Text:
You didn't start a company to spend 6 hours every Tuesday formatting newsletters, responding to cold inquiries, and tweaking social graphics.

Nexus AI is your autonomous copy engine:
• Plug in your Gemini or OpenAI API keys once.
• Generate tailored multi-channel campaigns in under 3 seconds.
• Keep 100% of your margins—no monthly token subscriptions.

👉 Click below to launch your workspace with 0% markups.`,
        stats: { words: 78, chars: 498, latency: '0.28s' },
    },
    {
        id: 'blog',
        label: 'SEO Article Hook',
        platform: 'Blog & Articles',
        icon: FileText,
        tone: 'Authoritative & Inspiring',
        model: 'Gemini 3.5 Flash-Lite',
        prompt: 'An engaging, story-driven blog introduction about the death of software middle-men.',
        output: `In 2023, the easiest way to build a venture-backed startup was wrapping an OpenAI API endpoint in a colorful UI and charging $60/month.

Today, that entire business model is disintegrating.

Developers and creators have realized something fundamental: raw LLM intelligence is cheap, ubiquitous, and compounding weekly. The real leverage isn't the wrapper—it's giving users direct, frictionless control of their own credentials.

Here is what happens when you strip away the middleman.`,
        stats: { words: 68, chars: 472, latency: '0.19s' },
    },
];

export default function Welcome() {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    const [activePreset, setActivePreset] = useState<DemoPreset>(
        DEMO_PRESETS[0],
    );
    const [displayedOutput, setDisplayedOutput] = useState(
        DEMO_PRESETS[0].output,
    );
    const [isTyping, setIsTyping] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (typingTimerRef.current) {
                clearInterval(typingTimerRef.current);
            }
        };
    }, []);

    const handlePresetChange = (preset: DemoPreset) => {
        if (preset.id === activePreset.id) {
            return;
        }

        if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
        }

        setActivePreset(preset);
        setDisplayedOutput('');
        setIsTyping(true);

        let index = 0;
        const text = preset.output;

        typingTimerRef.current = setInterval(() => {
            if (index < text.length) {
                setDisplayedOutput(text.slice(0, index + 3));
                index += 3;
            } else {
                setDisplayedOutput(text);
                setIsTyping(false);

                if (typingTimerRef.current) {
                    clearInterval(typingTimerRef.current);
                    typingTimerRef.current = null;
                }
            }
        }, 16);
    };

    const handleCopy = () => {
        if (!displayedOutput) {
            return;
        }

        navigator.clipboard.writeText(displayedOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const logoTheme = mounted ? resolvedAppearance : 'dark';

    return (
        <>
            <Head title="Nexus AI - Bring Your Own Key AI Content Studio" />

            <div className="min-h-screen scroll-smooth bg-[#f8fafc] text-slate-900 transition-colors duration-300 selection:bg-indigo-500/20 selection:text-indigo-600 dark:bg-[#07080e] dark:text-slate-100 dark:selection:text-indigo-300">
                {/* 1. Header Navigation */}
                <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#07080e]/80">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="group flex items-center gap-2.5"
                        >
                            <img
                                src={`/images/logo/icon-only-${logoTheme}.png`}
                                alt="Nexus AI"
                                className="size-8 object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="flex flex-col">
                                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Nexus
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        AI
                                    </span>
                                </span>
                                <span className="-mt-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    BYOK Studio
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
                            <a
                                href="#playground"
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Live Studio Demo
                            </a>
                            <a
                                href="#models"
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Supported Models
                            </a>
                            <a
                                href="#why-byok"
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Why BYOK?
                            </a>
                            <a
                                href="#features"
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Features
                            </a>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                aria-label="Toggle theme"
                                title="Toggle light and dark mode"
                            >
                                {mounted ? (
                                    resolvedAppearance === 'dark' ? (
                                        <Sun className="size-4 text-amber-400" />
                                    ) : (
                                        <Moon className="size-4 text-slate-700" />
                                    )
                                ) : (
                                    <span className="size-4" />
                                )}
                            </button>

                            {/* Authentication CTAs */}
                            <div className="hidden items-center gap-2 sm:flex">
                                {auth?.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-500 active:scale-[0.98]"
                                    >
                                        Dashboard
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-500 active:scale-[0.98]"
                                        >
                                            Join
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Hamburger Toggle */}
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                aria-label="Toggle mobile menu"
                            >
                                {mobileMenuOpen ? (
                                    <CloseIcon className="size-4.5" />
                                ) : (
                                    <Menu className="size-4.5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Dropdown Navigation */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-b border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-[#0c0e1a]"
                            >
                                <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <a
                                        href="#playground"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="py-1 hover:text-indigo-600 dark:hover:text-white"
                                    >
                                        Live Studio Demo
                                    </a>
                                    <a
                                        href="#models"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="py-1 hover:text-indigo-600 dark:hover:text-white"
                                    >
                                        Supported Models
                                    </a>
                                    <a
                                        href="#why-byok"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="py-1 hover:text-indigo-600 dark:hover:text-white"
                                    >
                                        Why BYOK?
                                    </a>
                                    <a
                                        href="#features"
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="py-1 hover:text-indigo-600 dark:hover:text-white"
                                    >
                                        Features
                                    </a>
                                    <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                        {auth?.user ? (
                                            <Link
                                                href={dashboard()}
                                                className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white"
                                            >
                                                Dashboard
                                                <ArrowRight className="size-3.5" />
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href={login()}
                                                    className="flex h-10 items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                                                >
                                                    Log in
                                                </Link>
                                                <Link
                                                    href={register()}
                                                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white"
                                                >
                                                    Join
                                                    <ArrowRight className="size-3.5" />
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                {/* 2. Hero Section with Grid Background */}
                <GridBackground className="flex min-h-[calc(100dvh-4rem)] min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
                    <div className="mx-auto max-w-5xl text-center">
                        {/* Main Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl leading-[1.1] font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white"
                        >
                            Supercharge Your Copy with{' '}
                            <span className="text-indigo-600 dark:text-indigo-400">
                                Your Own AI Keys
                            </span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mx-auto mt-5 max-w-2xl px-1 text-base leading-relaxed font-normal text-slate-600 sm:mt-6 sm:px-0 sm:text-lg dark:text-slate-400"
                        >
                            Stop renting marked-up AI tokens at $49/month. Nexus
                            AI connects directly to your Google Gemini, OpenAI,
                            or OpenRouter keys—delivering high-converting social
                            copy, viral threads, and SEO blogs with calibrated
                            voice personas.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
                        >
                            <Link
                                href={auth?.user ? dashboard() : register()}
                                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-indigo-500/30 bg-indigo-600 px-7 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 active:scale-[0.98] sm:h-12.5 sm:w-auto"
                            >
                                <Zap className="size-4" />
                                {auth?.user
                                    ? 'Enter AI Studio'
                                    : 'Start Generating Free'}
                            </Link>

                            <a
                                href="#playground"
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98] sm:h-12.5 sm:w-auto dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <Sparkles className="size-4 text-indigo-500" />
                                Live Playground
                            </a>
                        </motion.div>

                        {/* Trust Micro-Metrics */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-500 sm:mt-12 sm:gap-8 sm:text-xs dark:text-slate-400"
                        >
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <CheckCircle2 className="size-3.5 shrink-0 text-slate-400 sm:size-4 dark:text-slate-500" />
                                <span>100% Raw API Direct Cost</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Shield className="size-3.5 shrink-0 text-slate-400 sm:size-4 dark:text-slate-500" />
                                <span>AES-256 Encrypted Keys</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Cpu className="size-3.5 shrink-0 text-slate-400 sm:size-4 dark:text-slate-500" />
                                <span>SSE Sub-Second Streaming</span>
                            </div>
                        </motion.div>

                        {/* Scroll Down Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-10 flex justify-center"
                        >
                            <a
                                href="#playground"
                                aria-label="Scroll to interactive studio demo"
                                className="group inline-flex flex-col items-center gap-1.5 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                            >
                                <span className="text-[11px] font-semibold tracking-wider uppercase opacity-75 group-hover:opacity-100">
                                    Explore Studio Demo
                                </span>
                                <ChevronDown className="size-4 text-slate-400 transition-transform group-hover:translate-y-0.5" />
                            </a>
                        </motion.div>
                    </div>
                </GridBackground>

                {/* 3. Interactive Studio Demo Showcase */}
                <section
                    id="playground"
                    className="relative z-20 mx-auto flex min-h-screen w-full max-w-6xl scroll-mt-16 flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-8 dark:border-slate-800/80 dark:bg-[#0c0e1a]"
                    >
                        {/* Demo Top Bar */}
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-200/70 pb-6 lg:flex-row lg:items-center dark:border-slate-800/70">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-emerald-500" />
                                    <h3 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg dark:text-white">
                                        Interactive Studio Simulation
                                    </h3>
                                    <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                        Live Preview
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Select a target platform preset below to
                                    simulate immediate high-velocity generation.
                                </p>
                            </div>

                            {/* Preset Buttons */}
                            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0">
                                {DEMO_PRESETS.map((preset) => {
                                    const IconComponent = preset.icon;
                                    const isSelected =
                                        activePreset.id === preset.id;

                                    return (
                                        <button
                                            key={preset.id}
                                            onClick={() =>
                                                handlePresetChange(preset)
                                            }
                                            className={`flex min-h-[38px] shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                                                isSelected
                                                    ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-950'
                                                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <IconComponent className="size-3.5 shrink-0" />
                                            <span>{preset.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Workspace View */}
                        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Left Config Card */}
                            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 lg:col-span-4 dark:border-slate-800/80 dark:bg-slate-900/30">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                                        Active Engine
                                    </span>
                                    <span className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                        {activePreset.model}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                                        Voice Tone
                                    </span>
                                    <span className="rounded-md border border-slate-200/80 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                        {activePreset.tone}
                                    </span>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Topic / Prompt Given
                                    </label>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed font-medium text-slate-800 dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-200">
                                        "{activePreset.prompt}"
                                    </div>
                                </div>

                                <div className="mt-auto flex flex-col gap-2 border-t border-slate-200/70 pt-4 dark:border-slate-800/70">
                                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                        <span>
                                            Latency:{' '}
                                            <strong className="text-slate-700 dark:text-slate-200">
                                                {activePreset.stats.latency}
                                            </strong>
                                        </span>
                                        <span>
                                            Words:{' '}
                                            <strong className="text-slate-700 dark:text-slate-200">
                                                {activePreset.stats.words}
                                            </strong>
                                        </span>
                                        <span>
                                            Chars:{' '}
                                            <strong className="text-slate-700 dark:text-slate-200">
                                                {activePreset.stats.chars}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2 rounded-lg border border-slate-200/60 bg-white p-2.5 text-[11px] text-slate-600 dark:border-slate-800/60 dark:bg-[#07080e] dark:text-slate-400">
                                        <Lock className="mt-0.5 size-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                        <span>
                                            Your API key is sent directly to
                                            Google/OpenAI endpoints with 0%
                                            proxy fee.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Output Window */}
                            <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 lg:col-span-8 dark:border-slate-800/80 dark:bg-[#07080e]">
                                <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-indigo-500" />
                                        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Live Generation Canvas
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="size-3.5 text-emerald-500" />
                                                <span className="text-emerald-500">
                                                    Copied!
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-3.5" />
                                                <span>Copy Result</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="max-h-[340px] min-h-[220px] overflow-y-auto pr-2 font-sans text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                                    {displayedOutput}
                                    {isTyping && (
                                        <span className="animate-cursor ml-1 inline-block size-2.5 rounded-xs bg-indigo-500" />
                                    )}
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-900 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Sparkles className="size-3.5 text-slate-400 dark:text-slate-500" />
                                        Formatted Markdown Preview
                                    </span>
                                    <Link
                                        href={
                                            auth?.user
                                                ? dashboard()
                                                : register()
                                        }
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                    >
                                        Customize prompts in Studio{' '}
                                        <ArrowRight className="size-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 4. Supported Models Showcase */}
                <section
                    id="models"
                    className="flex min-h-screen scroll-mt-16 flex-col justify-center border-t border-slate-200/80 bg-slate-50/50 py-16 sm:py-20 dark:border-slate-800/80 dark:bg-[#090b14]/50"
                >
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                Unrestricted Model Access
                            </h2>
                            <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Plug In the Most Powerful AI Models on Earth
                            </p>
                            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                                Switch models on the fly with a single click. No
                                subscription tiers, no paywalled models.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {/* Google Gemini Card */}
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                            <Zap className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                Google Gemini
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Ultra-fast, massive context
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                        Recommended
                                    </span>
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Includes generous free-tier limits directly
                                    from Google AI Studio. Sub-second response
                                    streaming.
                                </p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gemini-3.8-flash
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Fastest
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gemini-3.5-flash-lite
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Lowest Cost
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gemini-2.5-flash
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Battle-Tested
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* OpenAI Card */}
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                            <Cpu className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                OpenAI
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Industry standard reasoning
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                        Flagship
                                    </span>
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Exceptional linguistic tone calibration,
                                    complex instruction following, and
                                    persuasive copywriting.
                                </p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gpt-5 / gpt-4.5
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Next-Gen
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gpt-4o / gpt-4o-mini
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            High Speed
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            o3-mini / o1
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Reasoning
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* OpenRouter Card */}
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                            <Layers className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                OpenRouter
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Universal model hub
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-md border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                        Multi-Model
                                    </span>
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Access Anthropic Claude, DeepSeek, Meta
                                    Llama, and hundreds of models through a
                                    single API key.
                                </p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            claude-3.7-sonnet
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Top Prose
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            deepseek/deepseek-r1
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Open Weights
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs font-medium dark:bg-slate-900/50">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            meta-llama/llama-3.3-70b
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Ultra-Value
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 5. Why BYOK vs Traditional AI SaaS Comparison */}
                <section
                    id="why-byok"
                    className="mx-auto flex min-h-screen w-full max-w-6xl scroll-mt-16 flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
                >
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <h2 className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                            The Math is Simple
                        </h2>
                        <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Why You Should Stop Paying for "Credits"
                        </p>
                        <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                            Compare traditional AI SaaS subscriptions to the
                            Bring Your Own Key model.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Old Way */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-8 dark:border-slate-800 dark:bg-slate-900/30">
                            <span className="mb-4 inline-block rounded-md border border-slate-200/80 bg-slate-200/70 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                The Old SaaS Subscription Way
                            </span>
                            <div className="mb-6 text-2xl font-black text-slate-900 dark:text-white">
                                $49 - $99{' '}
                                <span className="text-sm font-semibold text-slate-500">
                                    / month
                                </span>
                            </div>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="mt-0.5 size-4.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                    <span>
                                        Arbitrary monthly "credit" caps that
                                        expire if unused
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="mt-0.5 size-4.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                    <span>
                                        500% to 1,000% markup on top of raw API
                                        token costs
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="mt-0.5 size-4.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                    <span>
                                        Locked into outdated models chosen by
                                        the provider
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="mt-0.5 size-4.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                    <span>
                                        Recurring monthly bill even during quiet
                                        periods
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Nexus AI BYOK */}
                        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-white p-8 shadow-xs dark:border-indigo-500/40 dark:bg-[#0c0e1a]">
                            <span className="mb-4 inline-block rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                The Nexus AI BYOK Way
                            </span>
                            <div className="mb-6 text-2xl font-black text-slate-900 dark:text-white">
                                $0 Platform Fee{' '}
                                <span className="text-sm font-semibold text-slate-500">
                                    / raw token rate
                                </span>
                            </div>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                                <li className="flex items-start gap-3">
                                    <Check className="mt-0.5 size-4.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                    <span>
                                        <strong>0% Token Markup:</strong> Pay
                                        fractions of a penny directly to Google
                                        or OpenAI
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="mt-0.5 size-4.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                    <span>
                                        <strong>Unlimited Generations:</strong>{' '}
                                        Generate millions of words without
                                        hitting credit walls
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="mt-0.5 size-4.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                    <span>
                                        <strong>Immediate Model Access:</strong>{' '}
                                        Switch to Gemini 3.8 Flash or GPT-5
                                        instantly
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="mt-0.5 size-4.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                    <span>
                                        <strong>Data Sovereignty:</strong> Your
                                        prompts travel directly under your own
                                        API account
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 6. Feature Grid */}
                <section
                    id="features"
                    className="flex min-h-screen scroll-mt-16 flex-col justify-center border-t border-slate-200/80 bg-slate-50/50 py-16 sm:py-20 dark:border-slate-800/80 dark:bg-[#090b14]/50"
                >
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                Built for Speed & Precision
                            </h2>
                            <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Everything You Need in a Content Studio
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700">
                                <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                    <Sparkles className="size-5" />
                                </div>
                                <h3 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
                                    Custom Voice Tones
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Configure company voice guidelines, slang,
                                    vocabulary, and formality personas. Every
                                    generation sounds authentically yours.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700">
                                <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                    <Zap className="size-5" />
                                </div>
                                <h3 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
                                    Real-Time SSE Streaming
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    No spinning wheels. Tokens stream into the
                                    workspace the millisecond they are generated
                                    by the neural network.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700">
                                <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                    <TrendingUp className="size-5" />
                                </div>
                                <h3 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
                                    Multi-Platform Presets
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Pre-tuned prompts for LinkedIn hooks,
                                    Twitter threads, Facebook posts, SEO blog
                                    introductions, and cold sales emails.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700">
                                <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                    <Lock className="size-5" />
                                </div>
                                <h3 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
                                    Encrypted Key Vault
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Your API credentials are protected with
                                    Laravel's AES-256-GCM encryption at rest.
                                    Never shared, never exported.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700">
                                <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                    <FileText className="size-5" />
                                </div>
                                <h3 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
                                    Telemetry & Word Counting
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Instant calculation of word counts,
                                    character counts, and estimated reading
                                    times for social media character
                                    constraints.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0c0e1a] dark:hover:border-slate-700">
                                <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                    <PenTool className="size-5" />
                                </div>
                                <h3 className="mb-2 text-base font-extrabold text-slate-900 dark:text-white">
                                    Persistent History Archive
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Every generated copy snippet is safely
                                    indexed. Search, copy, or export in Markdown
                                    format whenever you need it.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Bottom CTA Banner */}
                <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
                    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-10 text-center text-white shadow-xl sm:p-16 dark:border-slate-800 dark:bg-[#0c0e1a]">
                        <div className="relative z-10">
                            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1 text-xs font-semibold text-slate-300">
                                <Sparkles className="size-3.5" />
                                Setup in Under 60 Seconds
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                                Ready to Take Full Control of Your AI Copy?
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
                                Plug in your Gemini or OpenAI API keys today and
                                experience true token freedom.
                            </p>
                            <div className="mt-8 flex justify-center">
                                <Link
                                    href={auth?.user ? dashboard() : register()}
                                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 active:scale-[0.98]"
                                >
                                    {auth?.user
                                        ? 'Open Dashboard'
                                        : 'Create Free Account'}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Footer */}
                <footer className="border-t border-slate-200/80 bg-white py-10 dark:border-slate-800/80 dark:bg-[#07080e]">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <img
                                src={`/images/logo/icon-only-${logoTheme}.png`}
                                alt="Nexus AI"
                                className="size-7 object-contain"
                            />
                            <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Nexus AI Content Studio
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            © {new Date().getFullYear()} Nexus AI. Built for
                            creators with pure API freedom.
                        </p>

                        <div className="flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <Link
                                href={login()}
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Register
                            </Link>
                            <a
                                href="#playground"
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Playground
                            </a>
                        </div>
                    </div>
                </footer>

                {/* 9. Floating Scroll-to-Top Button */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={scrollToTop}
                            className="fixed right-6 bottom-6 z-40 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label="Scroll back to top"
                            title="Scroll back to top"
                        >
                            <ArrowUp className="size-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
