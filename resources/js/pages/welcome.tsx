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

    const [activePreset, setActivePreset] = useState<DemoPreset>(DEMO_PRESETS[0]);
    const [displayedOutput, setDisplayedOutput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copied, setCopied] = useState(false);

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

            <div className="min-h-screen bg-[#f8fafc] text-slate-900 transition-colors duration-300 dark:bg-[#07080e] dark:text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300 scroll-smooth">
                {/* 1. Header Navigation */}
                <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#07080e]/75">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <img
                                src={`/images/logo/icon-only-${logoTheme}.png`}
                                alt="Nexus AI"
                                className="size-8 object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="flex flex-col">
                                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Nexus<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 -mt-1">
                                    BYOK Studio
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <a href="#playground" className="transition hover:text-indigo-600 dark:hover:text-white">
                                Live Studio Demo
                            </a>
                            <a href="#models" className="transition hover:text-indigo-600 dark:hover:text-white">
                                Supported Models
                            </a>
                            <a href="#why-byok" className="transition hover:text-indigo-600 dark:hover:text-white">
                                Why BYOK?
                            </a>
                            <a href="#features" className="transition hover:text-indigo-600 dark:hover:text-white">
                                Features
                            </a>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
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
                                    className="inline-flex h-9.5 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500"
                                >
                                    Dashboard
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hidden sm:inline-flex text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex h-9.5 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95"
                                    >
                                        Get Started Free
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* 2. Hero Section with Aurora Background */}
                <AuroraBackground className="min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="mx-auto max-w-5xl text-center">
                        {/* Glow Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 backdrop-blur-md mb-8"
                        >
                            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Zero Token Markup • BYOK Freedom • Gemini 3.8 Flash, GPT-5 & Claude 3.7</span>
                        </motion.div>

                        {/* Main Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl"
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
                            className="mx-auto mt-6 max-w-3xl text-base sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-normal"
                        >
                            Stop renting marked-up AI tokens at $49/month. Nexus AI connects directly to your Google Gemini, OpenAI, or OpenRouter keys—delivering high-converting social copy, viral threads, and SEO blogs with calibrated voice personas.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                href={auth?.user ? dashboard() : register()}
                                className="flex h-13 w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-8 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-95"
                            >
                                <Zap className="size-5" />
                                {auth?.user ? 'Enter AI Studio' : 'Start Generating Free'}
                            </Link>

                            <a
                                href="#playground"
                                className="flex h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-300/80 bg-white/70 px-7 text-base font-semibold text-slate-800 backdrop-blur-md transition hover:bg-white hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <Sparkles className="size-5 text-indigo-500" />
                                Live Playground
                            </a>
                        </motion.div>

                        {/* Trust Micro-Metrics */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500 dark:text-slate-400"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-emerald-500" />
                                <span>100% Raw API Direct Cost</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="size-4 text-indigo-500" />
                                <span>AES-256 Encrypted Keys</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu className="size-4 text-cyan-500" />
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
                                className="group inline-flex flex-col items-center gap-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
                <section id="playground" className="min-h-screen flex flex-col justify-center scroll-mt-16 relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="rounded-3xl border border-slate-200/90 bg-white/90 p-4 sm:p-8 shadow-2xl backdrop-blur-2xl dark:border-slate-800/90 dark:bg-[#0c0e1a]/90 glow-indigo"
                    >
                        {/* Demo Top Bar */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800/70 pb-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="flex size-3 rounded-full bg-emerald-500 animate-ping" />
                                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        Interactive Studio Simulation
                                    </h3>
                                    <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                        Live Preview
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Select a target platform preset below to simulate immediate high-velocity generation.
                                </p>
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {DEMO_PRESETS.map((preset) => {
                                    const IconComponent = preset.icon;
                                    const isSelected = activePreset.id === preset.id;
                                    return (
                                        <button
                                            key={preset.id}
                                            onClick={() => setActivePreset(preset)}
                                            className={`flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
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
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Config Card */}
                            <div className="lg:col-span-4 flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-slate-800/70 dark:bg-slate-900/40">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Active Engine</span>
                                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                        {activePreset.model}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Voice Tone</span>
                                    <span className="rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                        {activePreset.tone}
                                    </span>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                        Topic / Prompt Given
                                    </label>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-[#07080e] dark:text-slate-200 font-medium">
                                        "{activePreset.prompt}"
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                        <span>Latency: <strong className="text-slate-700 dark:text-slate-200">{activePreset.stats.latency}</strong></span>
                                        <span>Words: <strong className="text-slate-700 dark:text-slate-200">{activePreset.stats.words}</strong></span>
                                        <span>Chars: <strong className="text-slate-700 dark:text-slate-200">{activePreset.stats.chars}</strong></span>
                                    </div>
                                    <div className="rounded-lg bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                                        <Lock className="size-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                                        <span>Your API key is sent directly to Google/OpenAI endpoints with 0% proxy fee.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Output Window */}
                            <div className="lg:col-span-8 flex flex-col rounded-2xl border border-slate-200/70 bg-white p-5 dark:border-slate-800/70 dark:bg-[#07080e]">
                                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-indigo-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                                                <span className="text-emerald-500">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-3.5" />
                                                <span>Copy Result</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="min-h-[220px] max-h-[340px] overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-200 pr-2">
                                    {displayedOutput}
                                    {isTyping && (
                                        <span className="inline-block size-2.5 ml-1 rounded-xs bg-indigo-500 animate-cursor" />
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Sparkles className="size-3.5 text-indigo-500" />
                                        Formatted Markdown Preview
                                    </span>
                                    <Link
                                        href={auth?.user ? dashboard() : register()}
                                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                                    >
                                        Customize prompts in Studio <ArrowRight className="size-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 4. Supported Models Showcase */}
                <section id="models" className="min-h-screen flex flex-col justify-center scroll-mt-16 py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090b14]/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                Unrestricted Model Access
                            </h2>
                            <p className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                                Plug In the Most Powerful AI Models on Earth
                            </p>
                            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                                Switch models on the fly with a single click. No subscription tiers, no paywalled models.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Google Gemini Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg transition-all dark:border-slate-800/80 dark:bg-[#0c0e1a] glow-indigo"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                            <Zap className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Google Gemini</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Ultra-fast, massive context</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        Recommended
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                                    Includes generous free-tier limits directly from Google AI Studio. Sub-second response streaming.
                                </p>
                                <div className="flex flex-col gap-2 mt-auto">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">gemini-3.8-flash</span>
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">Fastest</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">gemini-3.5-flash-lite</span>
                                        <span className="text-slate-500">Lowest Cost</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">gemini-2.5-flash</span>
                                        <span className="text-slate-500">Battle-Tested</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* OpenAI Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg transition-all dark:border-slate-800/80 dark:bg-[#0c0e1a] glow-cyan"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                            <Cpu className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">OpenAI</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Industry standard reasoning</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                                        Flagship
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                                    Exceptional linguistic tone calibration, complex instruction following, and persuasive copywriting.
                                </p>
                                <div className="flex flex-col gap-2 mt-auto">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">gpt-5 / gpt-4.5</span>
                                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">Next-Gen</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">gpt-4o / gpt-4o-mini</span>
                                        <span className="text-slate-500">High Speed</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">o3-mini / o1</span>
                                        <span className="text-slate-500">Reasoning</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* OpenRouter Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-lg transition-all dark:border-slate-800/80 dark:bg-[#0c0e1a] glow-violet"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                            <Layers className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">OpenRouter</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Universal model hub</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                                        Multi-Model
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                                    Access Anthropic Claude, DeepSeek, Meta Llama, and hundreds of models through a single API key.
                                </p>
                                <div className="flex flex-col gap-2 mt-auto">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">claude-3.7-sonnet</span>
                                        <span className="text-purple-600 dark:text-purple-400 font-bold">Top Prose</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">deepseek/deepseek-r1</span>
                                        <span className="text-slate-500">Open Weights</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs font-mono font-semibold">
                                        <span className="text-slate-700 dark:text-slate-300">meta-llama/llama-3.3-70b</span>
                                        <span className="text-slate-500">Ultra-Value</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 5. Why BYOK vs Traditional AI SaaS Comparison */}
                <section id="why-byok" className="min-h-screen flex flex-col justify-center scroll-mt-16 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                            The Math is Simple
                        </h2>
                        <p className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                            Why You Should Stop Paying for "Credits"
                        </p>
                        <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                            Compare traditional AI SaaS subscriptions to the Bring Your Own Key model.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Old Way */}
                        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 relative overflow-hidden">
                            <span className="inline-block rounded-lg bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 mb-4">
                                The Old SaaS Subscription Way
                            </span>
                            <div className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                                $49 - $99 <span className="text-sm font-semibold text-slate-500">/ month</span>
                            </div>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="size-5 shrink-0 text-rose-500 mt-0.5" />
                                    <span>Arbitrary monthly "credit" caps that expire if unused</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="size-5 shrink-0 text-rose-500 mt-0.5" />
                                    <span>500% to 1,000% markup on top of raw API token costs</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="size-5 shrink-0 text-rose-500 mt-0.5" />
                                    <span>Locked into outdated models chosen by the provider</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CloseIcon className="size-5 shrink-0 text-rose-500 mt-0.5" />
                                    <span>Recurring monthly bill even during quiet periods</span>
                                </li>
                            </ul>
                        </div>

                        {/* Nexus AI BYOK */}
                        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 relative overflow-hidden glow-indigo">
                            <span className="inline-block rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                                The Nexus AI BYOK Way
                            </span>
                            <div className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                                $0 Platform Fee <span className="text-sm font-semibold text-slate-500">/ raw token rate</span>
                            </div>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                                <li className="flex items-start gap-3">
                                    <Check className="size-5 shrink-0 text-emerald-500 mt-0.5" />
                                    <span><strong>0% Token Markup:</strong> Pay fractions of a penny directly to Google or OpenAI</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="size-5 shrink-0 text-emerald-500 mt-0.5" />
                                    <span><strong>Unlimited Generations:</strong> Generate millions of words without hitting credit walls</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="size-5 shrink-0 text-emerald-500 mt-0.5" />
                                    <span><strong>Immediate Model Access:</strong> Switch to Gemini 3.8 Flash or GPT-5 instantly</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="size-5 shrink-0 text-emerald-500 mt-0.5" />
                                    <span><strong>Data Sovereignty:</strong> Your prompts travel directly under your own API account</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 6. Feature Grid */}
                <section id="features" className="min-h-screen flex flex-col justify-center scroll-mt-16 py-16 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090b14]/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                Built for Speed & Precision
                            </h2>
                            <p className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                                Everything You Need in a Content Studio
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-5">
                                    <Sparkles className="size-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                                    Custom Voice Tones
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Configure company voice guidelines, slang, vocabulary, and formality personas. Every generation sounds authentically yours.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-5">
                                    <Zap className="size-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                                    Real-Time SSE Streaming
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    No spinning wheels. Tokens stream into the workspace the millisecond they are generated by the neural network.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-5">
                                    <TrendingUp className="size-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                                    Multi-Platform Presets
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Pre-tuned prompts for LinkedIn hooks, Twitter threads, Facebook posts, SEO blog introductions, and cold sales emails.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
                                    <Lock className="size-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                                    Encrypted Key Vault
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Your API credentials are protected with Laravel's AES-256-GCM encryption at rest. Never shared, never exported.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-5">
                                    <FileText className="size-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                                    Telemetry & Word Counting
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Instant calculation of word counts, character counts, and estimated reading times for social media character constraints.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 dark:border-slate-800/80 dark:bg-[#0c0e1a]">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-5">
                                    <PenTool className="size-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                                    Persistent History Archive
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Every generated copy snippet is safely indexed. Search, copy, or export in Markdown format whenever you need it.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Bottom CTA Banner */}
                <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-[#07080e] p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden glow-indigo">
                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 mb-4">
                                <Sparkles className="size-3.5" />
                                Setup in Under 60 Seconds
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                                Ready to Take Full Control of Your AI Copy?
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-300">
                                Plug in your Gemini or OpenAI API keys today and experience true token freedom.
                            </p>
                            <div className="mt-8 flex justify-center">
                                <Link
                                    href={auth?.user ? dashboard() : register()}
                                    className="inline-flex h-13 items-center gap-2 rounded-2xl bg-indigo-600 px-8 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
                                >
                                    {auth?.user ? 'Open Dashboard' : 'Create Free Account'}
                                    <ArrowRight className="size-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Footer */}
                <footer className="border-t border-slate-200/80 py-10 dark:border-slate-800/80 bg-white dark:bg-[#07080e]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={`/images/logo/icon-only-${logoTheme}.png`}
                                alt="Nexus AI"
                                className="size-6 object-contain"
                            />
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                Nexus AI Content Studio
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                            <span>Bring Your Own Key AI SaaS. AES-256-GCM Encrypted.</span>
                            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                            <a
                                href="https://venuxlabs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
                            >
                                <span>Powered by</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/50 hover:decoration-indigo-400 underline-offset-4">
                                    Venux Labs
                                </span>
                                <ExternalLink className="size-3 text-indigo-500" />
                            </a>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {auth?.user ? (
                                <Link href={dashboard()} className="hover:text-indigo-600 dark:hover:text-white">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()} className="hover:text-indigo-600 dark:hover:text-white">
                                        Log in
                                    </Link>
                                    <Link href={register()} className="hover:text-indigo-600 dark:hover:text-white">
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
                            className="fixed bottom-6 right-6 z-50 flex size-11 cursor-pointer items-center justify-center rounded-2xl border border-indigo-500/30 bg-white/90 text-indigo-600 shadow-xl shadow-indigo-600/20 backdrop-blur-xl transition-colors duration-200 hover:bg-indigo-600 hover:text-white dark:border-indigo-500/30 dark:bg-slate-900/90 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                            <ArrowUp className="size-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
