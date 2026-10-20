import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    Copy,
    Check,
    Cpu,
    ExternalLink,
    Flame,
    Key,
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

import { AuroraBackground } from '@/components/ui/aurora-background';
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
    const [mounted, setMounted] = useState(false);

    const [activePreset, setActivePreset] = useState<DemoPreset>(
        DEMO_PRESETS[0],
    );
    const [displayedOutput, setDisplayedOutput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Simulated typewriter stream on preset change
    useEffect(() => {
        let index = 0;
        const text = activePreset.output;
        setDisplayedOutput('');
        setIsTyping(true);

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedOutput(text.slice(0, index + 3));
                index += 3;
            } else {
                setDisplayedOutput(text);
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 16);

        return () => clearInterval(interval);
    }, [activePreset]);

    const handleCopy = () => {
        if (!displayedOutput) return;
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
                <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#07080e]/75">
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
                                <span className="-mt-1 text-[10px] font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                    BYOK Studio
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex dark:text-slate-300">
                            <a
                                href="#playground"
                                className="transition hover:text-indigo-600 dark:hover:text-white"
                            >
                                Live Studio Demo
                            </a>
                            <a
                                href="#models"
                                className="transition hover:text-indigo-600 dark:hover:text-white"
                            >
                                Supported Models
                            </a>
                            <a
                                href="#why-byok"
                                className="transition hover:text-indigo-600 dark:hover:text-white"
                            >
                                Why BYOK?
                            </a>
                            <a
                                href="#features"
                                className="transition hover:text-indigo-600 dark:hover:text-white"
                            >
                                Features
                            </a>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white/50 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                {mounted && resolvedAppearance === 'dark' ? (
                                    <Sun className="size-4 text-amber-400" />
                                ) : (
                                    <Moon className="size-4 text-indigo-500" />
                                )}
                            </button>

                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-9.5 items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 sm:gap-2 sm:px-4 sm:text-sm"
                                >
                                    <span>Dashboard</span>
                                    <ArrowRight className="size-3.5 sm:size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex px-2 py-2 text-xs font-semibold text-slate-700 transition hover:text-slate-900 sm:px-3 sm:text-sm dark:text-slate-300 dark:hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex h-9.5 items-center gap-1.5 rounded-xl bg-indigo-600 px-3 text-xs font-bold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95 sm:gap-2 sm:px-4 sm:text-sm"
                                    >
                                        <span className="xs:inline hidden">
                                            Get Started
                                        </span>
                                        <span className="xs:hidden">Join</span>
                                        <ArrowRight className="size-3.5 sm:size-4" />
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu Hamburger Toggle */}
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                aria-label="Toggle navigation menu"
                                className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white/50 text-slate-700 transition hover:bg-slate-100 md:hidden dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                {mobileMenuOpen ? (
                                    <CloseIcon className="size-5 text-indigo-600 dark:text-indigo-400" />
                                ) : (
                                    <Menu className="size-5" />
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
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden border-b border-slate-200/80 bg-white/95 px-4 py-4 shadow-xl backdrop-blur-2xl md:hidden dark:border-slate-800/80 dark:bg-[#07080e]/95"
                            >
                                <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <a
                                        href="#playground"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                    >
                                        <span>Live Studio Demo</span>
                                        <ArrowRight className="size-4 text-slate-400" />
                                    </a>
                                    <a
                                        href="#models"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                    >
                                        <span>Supported Models</span>
                                        <ArrowRight className="size-4 text-slate-400" />
                                    </a>
                                    <a
                                        href="#why-byok"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                    >
                                        <span>Why BYOK?</span>
                                        <ArrowRight className="size-4 text-slate-400" />
                                    </a>
                                    <a
                                        href="#features"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                    >
                                        <span>Features</span>
                                        <ArrowRight className="size-4 text-slate-400" />
                                    </a>

                                    <div className="flex flex-col gap-2 border-t border-slate-200/80 pt-2 dark:border-slate-800/80">
                                        {auth?.user ? (
                                            <Link
                                                href={dashboard()}
                                                className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-md shadow-indigo-600/25"
                                            >
                                                Open Dashboard
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    href={login()}
                                                    className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                >
                                                    Log in
                                                </Link>
                                                <Link
                                                    href={register()}
                                                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-md shadow-indigo-600/25"
                                                >
                                                    Get Started
                                                    <ArrowRight className="size-3.5" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                {/* 2. Hero Section with Aurora Background */}
                <AuroraBackground className="flex min-h-[calc(100dvh-4rem)] min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
                    <div className="mx-auto max-w-5xl text-center">
                        {/* Glow Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-center text-[11px] font-semibold text-indigo-700 backdrop-blur-md sm:mb-8 sm:gap-2 sm:px-4 sm:text-xs dark:text-indigo-300"
                        >
                            <span className="flex size-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
                            <span>
                                Zero Token Markup • BYOK Freedom • Gemini, GPT-5
                                & Claude
                            </span>
                        </motion.div>

                        {/* Main Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl leading-tight font-black tracking-tight sm:text-5xl lg:text-7xl"
                        >
                            Supercharge Your Copy with{' '}
                            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                                Your Own AI Keys
                            </span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mx-auto mt-4 max-w-3xl px-1 text-sm leading-relaxed font-normal text-slate-600 sm:mt-6 sm:px-0 sm:text-xl dark:text-slate-300"
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
                                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95 sm:h-13 sm:w-auto sm:px-8 sm:text-base"
                            >
                                <Zap className="size-4.5 sm:size-5" />
                                {auth?.user
                                    ? 'Enter AI Studio'
                                    : 'Start Generating Free'}
                            </Link>

                            <a
                                href="#playground"
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-300/80 bg-white/70 px-6 text-sm font-semibold text-slate-800 backdrop-blur-md transition hover:bg-white hover:text-slate-950 sm:h-13 sm:w-auto sm:px-7 sm:text-base dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <Sparkles className="size-4.5 text-indigo-500 sm:size-5" />
                                Live Playground
                            </a>
                        </motion.div>

                        {/* Trust Micro-Metrics */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-500 sm:mt-12 sm:gap-10 sm:text-xs dark:text-slate-400"
                        >
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500 sm:size-4" />
                                <span>100% Raw API Direct Cost</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Shield className="size-3.5 shrink-0 text-indigo-500 sm:size-4" />
                                <span>AES-256 Encrypted Keys</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Cpu className="size-3.5 shrink-0 text-cyan-500 sm:size-4" />
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
                                className="group inline-flex flex-col items-center gap-1.5 text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                                <span className="text-[11px] font-semibold tracking-wider uppercase opacity-75 group-hover:opacity-100">
                                    Explore Studio Demo
                                </span>
                                <ChevronDown className="size-4 animate-bounce text-indigo-500/80 group-hover:text-indigo-500" />
                            </a>
                        </motion.div>
                    </div>
                </AuroraBackground>

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
                        className="glow-indigo rounded-3xl border border-slate-200/90 bg-white/90 p-4 shadow-2xl backdrop-blur-2xl sm:p-8 dark:border-slate-800/90 dark:bg-[#0c0e1a]/90"
                    >
                        {/* Demo Top Bar */}
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-200/70 pb-6 lg:flex-row lg:items-center dark:border-slate-800/70">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="flex size-3 animate-ping rounded-full bg-emerald-500" />
                                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        Interactive Studio Simulation
                                    </h3>
                                    <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
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
                                                setActivePreset(preset)
                                            }
                                            className={`flex min-h-[38px] shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                                                isSelected
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <IconComponent className="size-4 shrink-0" />
                                            <span>{preset.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Workspace View */}
                        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Left Config Card */}
                            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 lg:col-span-4 dark:border-slate-800/70 dark:bg-slate-900/40">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                                        Active Engine
                                    </span>
                                    <span className="flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                        {activePreset.model}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                                        Voice Tone
                                    </span>
                                    <span className="rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
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
                                    <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-300">
                                        <Lock className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <span>
                                            Your API key is sent directly to
                                            Google/OpenAI endpoints with 0%
                                            proxy fee.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Output Window */}
                            <div className="flex flex-col rounded-2xl border border-slate-200/70 bg-white p-5 lg:col-span-8 dark:border-slate-800/70 dark:bg-[#07080e]">
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
                                        <Sparkles className="size-3.5 text-indigo-500" />
                                        Formatted Markdown Preview
                                    </span>
                                    <Link
                                        href={
                                            auth?.user
                                                ? dashboard()
                                                : register()
                                        }
                                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
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
                            <h2 className="text-xs font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                                Unrestricted Model Access
                            </h2>
                            <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
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
                                whileHover={{ y: -5 }}
                                className="glow-indigo flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg transition-all dark:border-slate-800/80 dark:bg-[#0c0e1a]"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                            <Zap className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                                Google Gemini
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Ultra-fast, massive context
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        Recommended
                                    </span>
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Includes generous free-tier limits directly
                                    from Google AI Studio. Sub-second response
                                    streaming.
                                </p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gemini-3.8-flash
                                        </span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                            Fastest
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gemini-3.5-flash-lite
                                        </span>
                                        <span className="text-slate-500">
                                            Lowest Cost
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gemini-2.5-flash
                                        </span>
                                        <span className="text-slate-500">
                                            Battle-Tested
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* OpenAI Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glow-cyan flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg transition-all dark:border-slate-800/80 dark:bg-[#0c0e1a]"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                            <Cpu className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                                OpenAI
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Industry standard reasoning
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                                        Flagship
                                    </span>
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Exceptional linguistic tone calibration,
                                    complex instruction following, and
                                    persuasive copywriting.
                                </p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gpt-5 / gpt-4.5
                                        </span>
                                        <span className="font-bold text-cyan-600 dark:text-cyan-400">
                                            Next-Gen
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            gpt-4o / gpt-4o-mini
                                        </span>
                                        <span className="text-slate-500">
                                            High Speed
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            o3-mini / o1
                                        </span>
                                        <span className="text-slate-500">
                                            Reasoning
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* OpenRouter Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glow-violet flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg transition-all dark:border-slate-800/80 dark:bg-[#0c0e1a]"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                            <Layers className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                                OpenRouter
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Universal model hub
                                            </p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                                        Multi-Model
                                    </span>
                                </div>
                                <p className="mb-6 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Access Anthropic Claude, DeepSeek, Meta
                                    Llama, and hundreds of models through a
                                    single API key.
                                </p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            claude-3.7-sonnet
                                        </span>
                                        <span className="font-bold text-purple-600 dark:text-purple-400">
                                            Top Prose
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            deepseek/deepseek-r1
                                        </span>
                                        <span className="text-slate-500">
                                            Open Weights
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 font-mono text-xs font-semibold dark:bg-slate-900/60">
                                        <span className="text-slate-700 dark:text-slate-300">
                                            meta-llama/llama-3.3-70b
                                        </span>
                                        <span className="text-slate-500">
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
                        <h2 className="text-xs font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                            The Math is Simple
                        </h2>
                        <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Why You Should Stop Paying for "Credits"
                        </p>
                        <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                            Compare traditional AI SaaS subscriptions to the
                            Bring Your Own Key model.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Old Way */}
                        <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8">
                            <span className="mb-4 inline-block rounded-lg bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
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
                                    <CloseIcon className="mt-0.5 size-5 shrink-0 text-rose-500" />
                                    <span>
                                        Arbitrary monthly "credit" caps that
                                        expire if unused
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="mt-0.5 size-5 shrink-0 text-rose-500" />
                                    <span>
                                        500% to 1,000% markup on top of raw API
                                        token costs
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="mt-0.5 size-5 shrink-0 text-rose-500" />
                                    <span>
                                        Locked into outdated models chosen by
                                        the provider
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="mt-0.5 size-5 shrink-0 text-rose-500" />
                                    <span>
                                        Recurring monthly bill even during quiet
                                        periods
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Nexus AI BYOK */}
                        <div className="glow-indigo relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8">
                            <span className="mb-4 inline-block rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
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
                                    <Check className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                                    <span>
                                        <strong>0% Token Markup:</strong> Pay
                                        fractions of a penny directly to Google
                                        or OpenAI
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                                    <span>
                                        <strong>Unlimited Generations:</strong>{' '}
                                        Generate millions of words without
                                        hitting credit walls
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                                    <span>
                                        <strong>Immediate Model Access:</strong>{' '}
                                        Switch to Gemini 3.8 Flash or GPT-5
                                        instantly
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="mt-0.5 size-5 shrink-0 text-emerald-500" />
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
                            <h2 className="text-xs font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                                Built for Speed & Precision
                            </h2>
                            <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Everything You Need in a Content Studio
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <Sparkles className="size-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
                                    Custom Voice Tones
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Configure company voice guidelines, slang,
                                    vocabulary, and formality personas. Every
                                    generation sounds authentically yours.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                    <Zap className="size-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
                                    Real-Time SSE Streaming
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    No spinning wheels. Tokens stream into the
                                    workspace the millisecond they are generated
                                    by the neural network.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <TrendingUp className="size-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
                                    Multi-Platform Presets
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Pre-tuned prompts for LinkedIn hooks,
                                    Twitter threads, Facebook posts, SEO blog
                                    introductions, and cold sales emails.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <Lock className="size-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
                                    Encrypted Key Vault
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Your API credentials are protected with
                                    Laravel's AES-256-GCM encryption at rest.
                                    Never shared, never exported.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    <FileText className="size-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
                                    Telemetry & Word Counting
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Instant calculation of word counts,
                                    character counts, and estimated reading
                                    times for social media character
                                    constraints.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                    <PenTool className="size-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
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
                    <div className="glow-indigo relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-[#07080e] p-10 text-center shadow-2xl sm:p-16">
                        <div className="relative z-10">
                            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300">
                                <Sparkles className="size-3.5" />
                                Setup in Under 60 Seconds
                            </span>
                            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                                Ready to Take Full Control of Your AI Copy?
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
                                Plug in your Gemini or OpenAI API keys today and
                                experience true token freedom.
                            </p>
                            <div className="mt-8 flex justify-center">
                                <Link
                                    href={auth?.user ? dashboard() : register()}
                                    className="inline-flex h-13 items-center gap-2 rounded-2xl bg-indigo-600 px-8 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
                                >
                                    {auth?.user
                                        ? 'Open Dashboard'
                                        : 'Create Free Account'}
                                    <ArrowRight className="size-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Footer */}
                <footer className="border-t border-slate-200/80 bg-white py-10 dark:border-slate-800/80 dark:bg-[#07080e]">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={`/images/logo/icon-only-${logoTheme}.png`}
                                alt="Nexus AI"
                                className="size-6 object-contain"
                            />
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                                Nexus AI Content Studio
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 text-center text-xs text-slate-500 sm:flex-row sm:gap-3 dark:text-slate-400">
                            <span>
                                Bring Your Own Key AI SaaS. AES-256-GCM
                                Encrypted.
                            </span>
                            <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                                •
                            </span>
                            <a
                                href="https://venuxlabs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-semibold text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                            >
                                <span>Powered by</span>
                                <span className="font-bold text-indigo-600 underline decoration-indigo-400/50 underline-offset-4 hover:decoration-indigo-400 dark:text-indigo-400">
                                    Venux Labs
                                </span>
                                <ExternalLink className="size-3 text-indigo-500" />
                            </a>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="hover:text-indigo-600 dark:hover:text-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hover:text-indigo-600 dark:hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="hover:text-indigo-600 dark:hover:text-white"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </footer>

                {/* 9. Floating Scroll-to-Top Button */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.button
                            onClick={scrollToTop}
                            initial={{ opacity: 0, scale: 0.7, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.7, y: 15 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Scroll to top"
                            className="fixed right-6 bottom-6 z-50 flex size-11 cursor-pointer items-center justify-center rounded-2xl border border-indigo-500/30 bg-white/90 text-indigo-600 shadow-xl shadow-indigo-600/20 backdrop-blur-xl transition-colors duration-200 hover:bg-indigo-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-indigo-500/30 dark:bg-slate-900/90 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white"
                        >
                            <ArrowUp className="size-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
