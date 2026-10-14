import { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Copy,
    Download,
    Edit3,
    Languages,
    Layers,
    PenTool,
    RefreshCw,
    Sparkles,
    Trash2,
    Zap,
    AlertCircle,
    Cpu,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { stream as generateStream, create as generateCreate } from '@/routes/generate';
import { index as historyIndex, update as historyUpdate, destroy as historyDestroy } from '@/routes/history';

interface Tone {
    id: number;
    name: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    tone_snapshot: string | null;
    full_prompt: string;
    ai_content: string | null;
    edited_content: string | null;
    status: 'pending' | 'streaming' | 'completed' | 'failed';
    created_at: string;
    ai_provider?: string | null;
    ai_model?: string | null;
    tone?: Tone | null;
}

interface ShowProps {
    generation: Generation;
    autostream: boolean;
}

// Enhanced Markdown parser to safely render AI output with rich responsive typography
function parseMarkdown(md: string, size: 'sm' | 'base' | 'lg' = 'base') {
    if (!md) return '';

    // Escape raw HTML tags to prevent XSS
    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks (```lang ... ```)
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre class="bg-slate-900 text-slate-100 dark:bg-black/90 dark:text-slate-200 p-4 sm:p-5 rounded-2xl border border-slate-800 my-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed shadow-lg">${code.trim()}</pre>`;
    });

    // Inline code (`code`)
    html = html.replace(
        /`([^`]+)`/g,
        '<code class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md font-mono text-xs border border-indigo-500/20 font-semibold">$1</code>'
    );

    // Bold (**text** or __text__)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-slate-950 dark:text-white">$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong class="font-extrabold text-slate-950 dark:text-white">$1</strong>');

    // Italic (*text* or _text_)
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>');

    // Horizontal Rules (--- or *** or ___)
    html = html.replace(/^(?:---|—|\*\*\*|___)\s*$/gim, '<hr class="my-6 sm:my-8 border-t border-slate-200 dark:border-slate-800" />');

    // Headers with size-responsive classes
    const h1Class =
        size === 'lg'
            ? 'text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-8 mb-4 block leading-tight tracking-tight border-b border-slate-200/80 dark:border-slate-800/80 pb-3'
            : size === 'sm'
              ? 'text-lg sm:text-xl font-black text-slate-950 dark:text-white mt-6 mb-3 block leading-tight tracking-tight border-b border-slate-200/80 dark:border-slate-800/80 pb-2'
              : 'text-xl sm:text-2xl font-black text-slate-950 dark:text-white mt-7 mb-3.5 block leading-tight tracking-tight border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5';

    const h2Class =
        size === 'lg'
            ? 'text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-7 mb-3.5 block leading-snug tracking-tight'
            : size === 'sm'
              ? 'text-base sm:text-lg font-extrabold text-slate-950 dark:text-white mt-5 mb-2.5 block leading-snug tracking-tight'
              : 'text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white mt-6 mb-3 block leading-snug tracking-tight';

    const h3Class =
        size === 'lg'
            ? 'text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3 block leading-snug tracking-tight'
            : size === 'sm'
              ? 'text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-4 mb-2 block leading-snug tracking-tight'
              : 'text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-5 mb-2.5 block leading-snug tracking-tight';

    const h4Class =
        size === 'lg'
            ? 'text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2.5 block leading-snug'
            : size === 'sm'
              ? 'text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-3.5 mb-1.5 block leading-snug'
              : 'text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 block leading-snug';

    html = html.replace(/^#### (.*$)/gim, `<h5 class="${h4Class}">$1</h5>`);
    html = html.replace(/^### (.*$)/gim, `<h4 class="${h3Class}">$1</h4>`);
    html = html.replace(/^## (.*$)/gim, `<h3 class="${h2Class}">$1</h3>`);
    html = html.replace(/^# (.*$)/gim, `<h2 class="${h1Class}">$1</h2>`);

    // Standalone Myanmar section titles: e.g. "၁။ Database Replication ဆိုတာ ဘာလဲ။"
    html = html.replace(
        /^([၁-၉0-9]+[။]\s*.*$)/gim,
        `<h4 class="${h2Class} text-indigo-900 dark:text-indigo-200 mt-7 mb-3">$1</h4>`
    );

    // Blockquotes (> text)
    html = html.replace(
        /^\> (.*$)/gim,
        '<blockquote class="border-l-4 border-indigo-500 pl-4 py-2 my-4 text-slate-700 dark:text-slate-300 italic bg-indigo-50/60 dark:bg-indigo-950/30 rounded-r-2xl leading-[1.85]">$1</blockquote>'
    );

    // Unordered Lists
    html = html.replace(
        /^\s*[\-\*]\s+(.*$)/gim,
        '<li class="list-disc ml-6 my-2 text-slate-800 dark:text-slate-100 leading-[1.95]">$1</li>'
    );

    // Ordered Lists
    html = html.replace(
        /^\s*(\d+)\.\s+(.*$)/gim,
        '<li class="list-decimal ml-6 my-2 text-slate-800 dark:text-slate-100 leading-[1.95]">$2</li>'
    );

    const lines = html.split('\n');
    let insidePre = false;

    const processedLines = lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed === '') return insidePre ? '\n' : '<div class="h-3"></div>';

        if (trimmed.startsWith('<pre')) {
            insidePre = true;
            return line;
        }
        if (trimmed.includes('</pre>')) {
            insidePre = false;
            return line;
        }

        if (insidePre) {
            return line + '\n';
        }

        if (
            trimmed.startsWith('<h') ||
            trimmed.startsWith('<blockquote') ||
            trimmed.startsWith('<li') ||
            trimmed.startsWith('<hr')
        ) {
            return line;
        }

        return `<p class="mb-4 text-slate-850 dark:text-slate-100 leading-[1.95] tracking-[0.01em]">${line}</p>`;
    });

    return processedLines.join('');
}

export default function HistoryShow({ generation, autostream }: ShowProps) {
    const [status, setStatus] = useState<string>(generation.status);
    const [content, setContent] = useState<string>(generation.ai_content || '');
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

    // Font Style & Size Preferences (Persisted locally)
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('nexus_ai_font_size');
            if (saved === 'sm' || saved === 'base' || saved === 'lg') return saved;
        }
        return 'base';
    });

    const [fontFamily, setFontFamily] = useState<'sans' | 'padauk' | 'serif'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('nexus_ai_font_family');
            if (saved === 'sans' || saved === 'padauk' || saved === 'serif') return saved;
        }
        return 'sans';
    });

    const handleFontSizeChange = (size: 'sm' | 'base' | 'lg') => {
        setFontSize(size);
        if (typeof window !== 'undefined') {
            localStorage.setItem('nexus_ai_font_size', size);
        }
    };

    const handleFontFamilyChange = (family: 'sans' | 'padauk' | 'serif') => {
        setFontFamily(family);
        if (typeof window !== 'undefined') {
            localStorage.setItem('nexus_ai_font_family', family);
        }
    };

    const editForm = useForm({
        edited_content: generation.edited_content || generation.ai_content || '',
    });

    const bottomRef = useRef<HTMLDivElement>(null);
    const activeText = generation.edited_content || content;

    // Word, Character, and Read Time Telemetry
    const wordCount = activeText.trim() ? activeText.trim().split(/\s+/).length : 0;
    const charCount = activeText.length;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

    // Smooth autoscroll during active generation
    useEffect(() => {
        if (status === 'streaming') {
            bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        }
    }, [activeText, status]);

    useEffect(() => {
        // SSE Streaming Hook
        if (autostream && status === 'pending') {
            const streamUrl = generateStream.url({ generation: generation.id });
            const source = new EventSource(streamUrl);

            setStatus('streaming');

            source.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.token) {
                    setContent((prev) => prev + data.token);
                }
                if (data.done) {
                    setStatus('completed');
                    source.close();
                    toast.success('AI generation finished!');
                }
                if (data.error) {
                    setError(data.error);
                    setStatus('failed');
                    source.close();
                    toast.error(data.error);
                }
            };

            source.onerror = () => {
                source.close();
                setError('Connection lost. The stream was interrupted.');
                setStatus('failed');
                toast.error('Connection lost. Please try again.');
            };

            return () => {
                source.close();
            };
        }
    }, [autostream, generation.id]);

    // Handle copying to clipboard
    const handleCopy = () => {
        const textToCopy = generation.edited_content || content;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            toast.success('Copy saved to clipboard!');
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    // Download content
    const handleDownload = (format: 'md' | 'txt') => {
        const textToDownload = generation.edited_content || content;
        if (!textToDownload) return;

        const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${generation.content_type}_${generation.id}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded as .${format}`);
    };

    // Save inline edits
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(historyUpdate.url({ generation: generation.id }), {
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Changes saved!');
            },
        });
    };

    // Delete generation
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this generation from your history?')) {
            router.delete(historyDestroy.url({ generation: generation.id }));
        }
    };

    const statusBadge = {
        pending: (
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                Pending
            </Badge>
        ),
        streaming: (
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 animate-pulse flex items-center gap-1.5 font-bold">
                <RefreshCw className="size-3 animate-spin" /> Streaming Copy...
            </Badge>
        ),
        completed: (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                Completed
            </Badge>
        ),
        failed: (
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold">
                Failed
            </Badge>
        ),
    }[status] || <Badge>{status}</Badge>;

    const fontFamilyClass = {
        sans: 'font-sans-myanmar',
        padauk: 'font-padauk',
        serif: 'font-serif-myanmar',
    }[fontFamily];

    const fontSizeClass = {
        sm: 'text-[14.5px] leading-[1.85]',
        base: 'text-[16px] sm:text-[16.5px] leading-[1.95]',
        lg: 'text-[18px] sm:text-[18.5px] leading-[2.05]',
    }[fontSize];

    return (
        <>
            <Head title={`Copy - ${generation.content_type.replace('_', ' ')}`} />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-5 sm:gap-6 p-3.5 sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 sm:pb-5 dark:border-slate-800/80">
                    <div>
                        <Link
                            href={historyIndex.url()}
                            className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 mb-1.5 transition"
                        >
                            <ArrowLeft className="size-3.5" />
                            Back to History
                        </Link>
                        <h1 className="text-xl sm:text-2xl sm:text-3xl font-black text-slate-900 dark:text-white capitalize flex items-center gap-2.5">
                            {generation.content_type.replace('_', ' ')}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                            Generated on {new Date(generation.created_at).toLocaleString()}
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                        {Boolean(activeText) && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCopy}
                                    className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0c0e1a] h-10 px-3 flex items-center gap-1.5 cursor-pointer text-xs font-bold transition hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-2xs active:scale-95"
                                >
                                    {isCopied ? (
                                        <Check className="size-4 text-emerald-500" />
                                    ) : (
                                        <Copy className="size-4" />
                                    )}
                                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload('md')}
                                    className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0c0e1a] h-10 px-3 flex items-center gap-1.5 cursor-pointer text-xs font-bold shadow-2xs active:scale-95"
                                >
                                    <Download className="size-4" />
                                    .md
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(!isEditing);
                                        editForm.setData('edited_content', activeText || '');
                                    }}
                                    className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0c0e1a] h-10 px-3 flex items-center gap-1.5 cursor-pointer text-xs font-bold shadow-2xs active:scale-95"
                                >
                                    <Edit3 className="size-4" />
                                    <span>{isEditing ? 'View' : 'Edit'}</span>
                                </Button>
                            </>
                        )}

                        <Link
                            href={generateCreate.url()}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 sm:px-4 h-10 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition active:scale-95"
                        >
                            <PenTool className="size-3.5" />
                            New Copy
                        </Link>

                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 h-10 px-3 flex items-center gap-1.5 cursor-pointer text-xs font-bold active:scale-95"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Status and Configuration Metadata Cards */}
                <div className="grid gap-2 sm:gap-3 grid-cols-2 lg:grid-cols-4">
                    <div className="p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 shadow-xs backdrop-blur-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                        <div className="mt-1 sm:mt-1.5">{statusBadge}</div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 shadow-xs backdrop-blur-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Language</span>
                        <div className="mt-1 sm:mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase font-mono">
                            <Languages className="size-3.5 sm:size-4 text-indigo-500" />
                            {generation.output_language}
                        </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 shadow-xs backdrop-blur-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Voice Tone</span>
                        <div className="mt-1 sm:mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            <Sparkles className="size-3.5 sm:size-4 text-indigo-500 shrink-0" />
                            <span className="truncate">{generation.tone_snapshot ? generation.tone_snapshot.split(':')[0] : 'Default'}</span>
                        </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 shadow-xs backdrop-blur-xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Engine</span>
                        <div className="mt-1 sm:mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 font-mono truncate">
                            <Zap className="size-3.5 sm:size-4 text-emerald-500 shrink-0" />
                            <span className="truncate">{generation.ai_provider || 'gemini'} {generation.ai_model ? `(${generation.ai_model})` : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Main Split Layout */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Primary Text Content Viewer / Editor */}
                    <div className="lg:col-span-8 space-y-6">
                        {status === 'failed' && (
                            <Card className="border-rose-500/20 bg-rose-500/10 rounded-3xl p-6 backdrop-blur-xl">
                                <div className="flex gap-3.5">
                                    <AlertCircle className="size-6 text-rose-600 dark:text-rose-400 shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                                            Generation Stream Failed
                                        </h3>
                                        <p className="text-xs text-rose-800 dark:text-rose-300 mt-1">
                                            {error ||
                                                'The connection to the AI generation provider failed. Please verify that your API key is valid and has access to the requested model.'}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card className="relative rounded-3xl border border-slate-200/90 bg-white/90 dark:border-slate-800/90 dark:bg-[#0c0e1a]/90 shadow-xl backdrop-blur-2xl overflow-hidden min-h-[350px] flex flex-col justify-between glow-indigo">
                            {(status === 'streaming' || status === 'pending') && (
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-[length:200%_auto] animate-pulse" />
                            )}

                            {/* Canvas Toolbar with Font Style & Size Controls, View Mode, and Direct Copy */}
                            <CardHeader className="bg-slate-50/70 dark:bg-[#080911]/70 py-3 px-3.5 sm:px-6 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                                    <CardTitle className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mr-1">
                                        <div className="size-2 rounded-full bg-indigo-500" />
                                        {isEditing ? 'Editing Content' : 'AI Output'}
                                    </CardTitle>

                                    {!isEditing && (
                                        <>
                                            {/* View Mode Toggle: Preview / Raw */}
                                            <div className="flex items-center bg-slate-200/60 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300/40 dark:border-slate-800 text-[10.5px] sm:text-[11px] font-bold">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewMode('preview')}
                                                    className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                                        viewMode === 'preview'
                                                            ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    Preview
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setViewMode('raw')}
                                                    className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                                        viewMode === 'raw'
                                                            ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    Raw MD
                                                </button>
                                            </div>

                                            {/* Font Family Selector: Sans / Padauk / Serif */}
                                            <div className="flex items-center bg-slate-200/60 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300/40 dark:border-slate-800 text-[10.5px] sm:text-[11px] font-bold">
                                                <button
                                                    type="button"
                                                    title="Modern Sans (Jakarta & Noto Sans)"
                                                    onClick={() => handleFontFamilyChange('sans')}
                                                    className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                                        fontFamily === 'sans'
                                                            ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    Sans
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Padauk (Clean Myanmar Unicode)"
                                                    onClick={() => handleFontFamilyChange('padauk')}
                                                    className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                                        fontFamily === 'padauk'
                                                            ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    Padauk
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Editorial Serif (Noto Serif Myanmar)"
                                                    onClick={() => handleFontFamilyChange('serif')}
                                                    className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                                        fontFamily === 'serif'
                                                            ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    Serif
                                                </button>
                                            </div>

                                            {/* Font Size Selector: A- / A / A+ */}
                                            <div className="flex items-center bg-slate-200/60 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300/40 dark:border-slate-800 text-[10.5px] sm:text-[11px] font-bold">
                                                <button
                                                    type="button"
                                                    title="Compact size (14.5px)"
                                                    onClick={() => handleFontSizeChange('sm')}
                                                    className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                                        fontSize === 'sm'
                                                            ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    A-
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Standard comfortable size (16.5px)"
                                                    onClick={() => handleFontSizeChange('base')}
                                                    className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                                        fontSize === 'base'
                                                            ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    A
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Large comfortable size (18.5px)"
                                                    onClick={() => handleFontSizeChange('lg')}
                                                    className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                                        fontSize === 'lg'
                                                            ? 'bg-white dark:bg-[#0c0e1a] text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    A+
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right Controls: Direct Copy Button + Telemetry */}
                                <div className="flex items-center justify-between sm:justify-end gap-3 w-full xl:w-auto">
                                    {/* Live Telemetry */}
                                    <div className="flex items-center gap-2 sm:gap-2.5 text-[10.5px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                        <span>
                                            Words: <strong className="text-slate-800 dark:text-slate-200">{wordCount}</strong>
                                        </span>
                                        <span>•</span>
                                        <span>
                                            Chars: <strong className="text-slate-800 dark:text-slate-200">{charCount}</strong>
                                        </span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="hidden sm:inline">
                                            Read: <strong className="text-slate-800 dark:text-slate-200">{readTimeMin}m</strong>
                                        </span>
                                    </div>

                                    {/* 1-Click Copy Button at AI Output */}
                                    {!isEditing && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleCopy}
                                            disabled={!activeText}
                                            className="h-8.5 px-3 sm:px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-50 shrink-0"
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check className="size-3.5 text-emerald-300" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-3.5" />
                                                    <span className="hidden sm:inline">Copy Output</span>
                                                    <span className="sm:hidden">Copy</span>
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 sm:p-8 flex-1">
                                {isEditing ? (
                                    <form onSubmit={handleSaveEdit} className="space-y-4 h-full flex flex-col justify-between">
                                        <textarea
                                            value={editForm.data.edited_content}
                                            onChange={(e) => editForm.setData('edited_content', e.target.value)}
                                            rows={14}
                                            className={`w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07080e] p-3.5 sm:p-5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-xs text-base sm:text-sm ${fontFamilyClass} ${fontSizeClass}`}
                                            required
                                        />
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                                className="rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-md"
                                            >
                                                {editForm.processing ? 'Saving...' : 'Save Edits'}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="min-h-[220px]">
                                        {activeText ? (
                                            viewMode === 'preview' ? (
                                                <div
                                                    className={`ai-response-canvas ${fontFamilyClass} ${fontSizeClass} text-slate-900 dark:text-slate-100`}
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            parseMarkdown(activeText, fontSize) +
                                                            (status === 'streaming'
                                                                ? '<span class="inline-block w-2.5 h-4.5 ml-1 bg-indigo-600 dark:bg-indigo-400 animate-cursor align-middle rounded-xs"></span>'
                                                                : ''),
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className={`whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-900/5 dark:bg-black/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 leading-relaxed overflow-x-auto`}
                                                >
                                                    {activeText}
                                                    {status === 'streaming' && (
                                                        <span className="inline-block w-2 h-4 ml-1 bg-indigo-600 dark:bg-indigo-400 animate-cursor align-middle rounded-xs" />
                                                    )}
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-16 text-slate-400 animate-pulse">
                                                <RefreshCw className="size-7 animate-spin text-indigo-600 dark:text-indigo-400 mb-3" />
                                                <span className="text-xs font-semibold">Streaming response tokens...</span>
                                            </div>
                                        )}
                                        <div ref={bottomRef} className="h-2" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Context & Prompt Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="rounded-3xl border border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 shadow-md backdrop-blur-xl p-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                                Prompt Topic Given
                            </h3>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-[#07080e] p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 font-medium">
                                "{generation.user_prompt}"
                            </p>
                        </Card>

                        {generation.tone_snapshot && (
                            <Card className="rounded-3xl border border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 shadow-md backdrop-blur-xl p-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                                    Voice Guidelines Applied
                                </h3>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-[#07080e] p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 font-medium">
                                    {generation.tone_snapshot}
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

HistoryShow.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Content History',
            href: historyIndex.url(),
        },
        {
            title: 'Copy Detail',
            href: '/history',
        },
    ],
};
