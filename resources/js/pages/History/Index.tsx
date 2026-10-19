import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    History,
    Languages,
    MessageSquare,
    PenTool,
    Sparkles,
    Linkedin,
    Twitter,
    FileText,
    Share2,
    Megaphone,
    Mail,
    Copy,
    Check,
    Layers,
    Video,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { create as generateCreate } from '@/routes/generate';
import { show as historyShow } from '@/routes/history';

interface Tone {
    id: number;
    name: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    title?: string;
    ai_content: string | null;
    edited_content?: string | null;
    status: 'pending' | 'streaming' | 'completed' | 'failed';
    created_at: string;
    tone?: Tone | null;
}

export function getGenerationTitle(gen: Generation): string {
    if (gen.title && gen.title.trim()) {
        return gen.title.trim();
    }

    const content = gen.edited_content || gen.ai_content;
    if (content) {
        // 1. Look for markdown H1 or H2 header: '# Title' or '## Title'
        const hMatch = content.match(/^#{1,3}\s+(.+)$/m);
        if (hMatch && hMatch[1]) {
            const clean = hMatch[1].replace(/[*_`#]/g, '').trim();
            if (clean) return clean;
        }

        // 2. Look for bold title at start: '**Title**'
        const boldMatch = content.match(/^\*\*([^*]+)\*\*/m);
        if (boldMatch && boldMatch[1]) {
            const clean = boldMatch[1].trim();
            if (!/^(Meta Description|Estimated Reading Time|Reading Time|ခန့်မှန်းဖတ်ရှုချိန်)/i.test(clean) && clean) {
                return clean.replace(/:$/, '');
            }
        }

        // 3. Fallback to first non-empty line of content
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('---') || trimmed.startsWith('>') || /^(Meta Description|Estimated Reading Time)/i.test(trimmed)) {
                continue;
            }
            const clean = trimmed.replace(/[*_`#]/g, '').trim();
            if (clean.length >= 5) {
                return clean.slice(0, 120);
            }
        }
    }

    // 4. Fallback: extract title from user_prompt
    const titledMatch = gen.user_prompt.match(/(?:titled|title|about)\s*["']([^"']+)["']/i);
    if (titledMatch && titledMatch[1]) {
        return titledMatch[1].trim();
    }

    const quoteMatch = gen.user_prompt.match(/"([^"]{5,80})"/);
    if (quoteMatch && quoteMatch[1]) {
        return quoteMatch[1].trim();
    }

    const promptClean = gen.user_prompt.replace(/^(?:Write|Create|Draft|Generate)\s+(?:a|an)\s+[^.]+?(?:about|on|for|titled)\s+/i, '');
    return promptClean.slice(0, 100).trim();
}

interface HistoryProps {
    history: {
        data: Generation[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    linkedin_post: Linkedin,
    twitter_thread: Twitter,
    facebook_post: Share2,
    blog_post: FileText,
    ad_copy: Megaphone,
    cold_email: Mail,
    carousel_slides: Layers,
    youtube_script: Video,
    tiktok_script: Video,
    caption: MessageSquare,
    marketing_copy: Sparkles,
};

export default function HistoryIndex({ history }: HistoryProps) {
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopyText = (id: number, text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('AI output copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <>
            <Head title="Content Archive - Nexus AI" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-5 sm:gap-6 p-3.5 sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 sm:pb-5 dark:border-slate-800/80">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <History className="size-5" />
                            </div>
                            <h1 className="text-xl sm:text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                                Content Archive
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Review, export, copy, or manage your historical AI-generated campaigns and copy.
                        </p>
                    </div>

                    <Link
                        href={generateCreate.url()}
                        className="inline-flex h-11 w-full sm:w-auto justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition active:scale-95"
                    >
                        <PenTool className="size-3.5" />
                        Create New Copy
                    </Link>
                </div>

                {/* History Grid */}
                {history.data.length > 0 ? (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {history.data.map((gen) => {
                            const date = new Date(gen.created_at).toLocaleDateString();
                            const IconComponent = PLATFORM_ICONS[gen.content_type] || FileText;
                            const contentTitle = getGenerationTitle(gen);

                            const statusBadge = {
                                pending: (
                                    <Badge className="border border-amber-500/20 bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                                        Pending
                                    </Badge>
                                ),
                                streaming: (
                                    <Badge className="border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                                        Writing...
                                    </Badge>
                                ),
                                completed: (
                                    <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                        Completed
                                    </Badge>
                                ),
                                failed: (
                                    <Badge className="border border-rose-500/20 bg-rose-500/10 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                                        Failed
                                    </Badge>
                                ),
                            }[gen.status];

                            return (
                                <Link
                                    key={gen.id}
                                    href={historyShow.url(gen.id)}
                                    className="group block transition transform hover:-translate-y-1"
                                >
                                    <Card className="rounded-3xl border border-slate-200/80 bg-white/80 shadow-md backdrop-blur-xl transition duration-200 min-h-[13.5rem] flex flex-col justify-between overflow-hidden dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 group-hover:border-indigo-400 group-hover:shadow-xl dark:group-hover:border-indigo-500/40">
                                        <CardHeader className="pb-2 pt-4 px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800/60 flex flex-row items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shrink-0">
                                                    <IconComponent className="size-3.5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-900 dark:text-white capitalize truncate max-w-[140px]">
                                                    {gen.content_type.replace('_', ' ')}
                                                </span>
                                            </div>
                                            {statusBadge}
                                        </CardHeader>
                                        <CardContent className="pt-3.5 pb-3.5 px-4 sm:px-5 flex-1 flex flex-col justify-center">
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-3 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {contentTitle}
                                            </h3>
                                        </CardContent>
                                        <CardFooter className="py-2.5 sm:py-3 px-4 sm:px-5 bg-slate-50/50 dark:bg-[#080911]/60 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 font-mono uppercase font-semibold">
                                                <Languages className="size-3 text-indigo-500" />
                                                {gen.output_language}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px]">{date}</span>
                                                {gen.ai_content && (
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleCopyText(gen.id, gen.ai_content);
                                                            }}
                                                            title="Copy AI output"
                                                            className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-white min-h-[38px] active:scale-95 cursor-pointer shadow-2xs"
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

                                                        <Link
                                                            href={historyShow.url(gen.id) + '?humanize=1'}
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="Humanize copy"
                                                            className="flex items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-50/60 dark:bg-purple-950/20 px-2.5 py-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/40 min-h-[38px] active:scale-95 cursor-pointer shadow-2xs"
                                                        >
                                                            <Sparkles className="size-3" />
                                                            <span className="hidden sm:inline">Humanize</span>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center max-w-md mx-auto my-12 w-full bg-white/50 dark:bg-[#0c0e1a]/50">
                        <MessageSquare className="size-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            No copies generated yet
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                            Start your first AI content generation session in the studio.
                        </p>
                        <Link
                            href={generateCreate.url()}
                            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                        >
                            <Sparkles className="size-4" />
                            Launch AI Studio
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

HistoryIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Content Archive',
            href: '/history',
        },
    ],
};
