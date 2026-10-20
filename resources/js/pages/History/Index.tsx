import { useState, useMemo } from 'react';
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
    Search,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
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
            if (
                !/^(Meta Description|Estimated Reading Time|Reading Time|ခန့်မှန်းဖတ်ရှုချိန်)/i.test(
                    clean,
                ) &&
                clean
            ) {
                return clean.replace(/:$/, '');
            }
        }

        // 3. Fallback to first non-empty line of content
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (
                !trimmed ||
                trimmed.startsWith('---') ||
                trimmed.startsWith('>') ||
                /^(Meta Description|Estimated Reading Time)/i.test(trimmed)
            ) {
                continue;
            }
            const clean = trimmed.replace(/[*_`#]/g, '').trim();
            if (clean.length >= 5) {
                return clean.slice(0, 120);
            }
        }
    }

    // 4. Fallback: extract title from user_prompt
    const titledMatch = gen.user_prompt.match(
        /(?:titled|title|about)\s*["']([^"']+)["']/i,
    );
    if (titledMatch && titledMatch[1]) {
        return titledMatch[1].trim();
    }

    const quoteMatch = gen.user_prompt.match(/"([^"]{5,80})"/);
    if (quoteMatch && quoteMatch[1]) {
        return quoteMatch[1].trim();
    }

    const promptClean = gen.user_prompt.replace(
        /^(?:Write|Create|Draft|Generate)\s+(?:a|an)\s+[^.]+?(?:about|on|for|titled)\s+/i,
        '',
    );
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

const PLATFORM_ICONS: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
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
    const [searchQuery, setSearchQuery] = useState('');
    const [platformFilter, setPlatformFilter] = useState('all');

    const handleCopyText = (id: number, text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('AI output copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredGenerations = useMemo(() => {
        return history.data.filter((gen) => {
            const matchesPlatform =
                platformFilter === 'all' || gen.content_type === platformFilter;
            if (!matchesPlatform) return false;
            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase();
            const title = (gen.title || '').toLowerCase();
            const prompt = (gen.user_prompt || '').toLowerCase();
            const content = (gen.ai_content || '').toLowerCase();
            return (
                title.includes(q) || prompt.includes(q) || content.includes(q)
            );
        });
    }, [history.data, platformFilter, searchQuery]);

    return (
        <>
            <Head title="Content Archive - Nexus AI" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-5 p-3.5 sm:gap-6 sm:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:pb-5 dark:border-slate-800/80">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <History className="size-5" />
                            </div>
                            <h1 className="text-xl font-black text-slate-900 sm:text-2xl sm:text-3xl dark:text-white">
                                Content Archive
                            </h1>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                            Review, export, copy, or manage your historical
                            AI-generated campaigns and copy.
                        </p>
                    </div>

                    <Link
                        href={generateCreate.url()}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-xl shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 sm:w-auto"
                    >
                        <PenTool className="size-3.5" />
                        Create New Copy
                    </Link>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search archived copies by topic, title, prompt..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white/80 py-2 pr-9 pl-10 text-xs font-medium text-slate-900 shadow-2xs placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-[#0c0e1a]/80 dark:text-slate-100"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold dark:border-slate-800 dark:bg-[#0c0e1a]">
                        <button
                            type="button"
                            onClick={() => setPlatformFilter('all')}
                            className={`cursor-pointer rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
                                platformFilter === 'all'
                                    ? 'bg-white font-bold text-indigo-600 shadow-2xs dark:bg-[#141728] dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            All ({history.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setPlatformFilter('linkedin_post')}
                            className={`cursor-pointer rounded-xl px-2.5 py-1.5 whitespace-nowrap transition-all ${
                                platformFilter === 'linkedin_post'
                                    ? 'bg-white font-bold text-indigo-600 shadow-2xs dark:bg-[#141728] dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            LinkedIn
                        </button>
                        <button
                            type="button"
                            onClick={() => setPlatformFilter('twitter_thread')}
                            className={`cursor-pointer rounded-xl px-2.5 py-1.5 whitespace-nowrap transition-all ${
                                platformFilter === 'twitter_thread'
                                    ? 'bg-white font-bold text-indigo-600 shadow-2xs dark:bg-[#141728] dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Twitter/X
                        </button>
                        <button
                            type="button"
                            onClick={() => setPlatformFilter('facebook_post')}
                            className={`cursor-pointer rounded-xl px-2.5 py-1.5 whitespace-nowrap transition-all ${
                                platformFilter === 'facebook_post'
                                    ? 'bg-white font-bold text-indigo-600 shadow-2xs dark:bg-[#141728] dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Facebook
                        </button>
                        <button
                            type="button"
                            onClick={() => setPlatformFilter('blog_post')}
                            className={`cursor-pointer rounded-xl px-2.5 py-1.5 whitespace-nowrap transition-all ${
                                platformFilter === 'blog_post'
                                    ? 'bg-white font-bold text-indigo-600 shadow-2xs dark:bg-[#141728] dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Blog
                        </button>
                        <button
                            type="button"
                            onClick={() => setPlatformFilter('ad_copy')}
                            className={`cursor-pointer rounded-xl px-2.5 py-1.5 whitespace-nowrap transition-all ${
                                platformFilter === 'ad_copy'
                                    ? 'bg-white font-bold text-indigo-600 shadow-2xs dark:bg-[#141728] dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Ads
                        </button>
                    </div>
                </div>

                {/* History Grid */}
                {filteredGenerations.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        {filteredGenerations.map((gen) => {
                            const date = new Date(
                                gen.created_at,
                            ).toLocaleDateString();
                            const IconComponent =
                                PLATFORM_ICONS[gen.content_type] || FileText;
                            const contentTitle = getGenerationTitle(gen);

                            const statusBadge = {
                                pending: (
                                    <Badge className="animate-pulse border border-amber-500/20 bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                        Pending
                                    </Badge>
                                ),
                                streaming: (
                                    <Badge className="animate-pulse border border-indigo-500/20 bg-indigo-500/10 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
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
                                    className="group block transform transition hover:-translate-y-1"
                                >
                                    <Card className="flex min-h-[13.5rem] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-md backdrop-blur-xl transition duration-200 group-hover:border-indigo-400 group-hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0c0e1a]/80 dark:group-hover:border-indigo-500/40">
                                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-4 pt-4 pb-2 sm:px-5 dark:border-slate-800/60">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                                    <IconComponent className="size-3.5" />
                                                </div>
                                                <span className="max-w-[140px] truncate text-xs font-bold text-slate-900 capitalize dark:text-white">
                                                    {gen.content_type.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                            </div>
                                            {statusBadge}
                                        </CardHeader>
                                        <CardContent className="flex flex-1 flex-col justify-center px-4 pt-3.5 pb-3.5 sm:px-5">
                                            <h3 className="line-clamp-3 text-sm leading-snug font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                {contentTitle}
                                            </h3>
                                        </CardContent>
                                        <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-[11px] text-slate-400 sm:px-5 sm:py-3 dark:border-slate-800/60 dark:bg-[#080911]/60">
                                            <span className="flex items-center gap-1.5 font-mono font-semibold uppercase">
                                                <Languages className="size-3 text-indigo-500" />
                                                {gen.output_language}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px]">
                                                    {date}
                                                </span>
                                                {gen.ai_content && (
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleCopyText(
                                                                    gen.id,
                                                                    gen.ai_content,
                                                                );
                                                            }}
                                                            title="Copy AI output"
                                                            className="flex min-h-[38px] cursor-pointer items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs transition hover:border-indigo-400 hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-white"
                                                        >
                                                            {copiedId ===
                                                            gen.id ? (
                                                                <>
                                                                    <Check className="size-3 text-emerald-500" />
                                                                    <span className="font-bold text-emerald-500">
                                                                        Copied
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="size-3 text-indigo-500" />
                                                                    <span>
                                                                        Copy
                                                                    </span>
                                                                </>
                                                            )}
                                                        </button>

                                                        <Link
                                                            href={
                                                                historyShow.url(
                                                                    gen.id,
                                                                ) +
                                                                '?humanize=1'
                                                            }
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            title="Humanize copy"
                                                            className="flex min-h-[38px] cursor-pointer items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-50/60 px-2.5 py-1.5 text-[11px] font-bold text-purple-600 shadow-2xs hover:bg-purple-100 active:scale-95 dark:bg-purple-950/20 dark:text-purple-400 dark:hover:bg-purple-950/40"
                                                        >
                                                            <Sparkles className="size-3" />
                                                            <span className="hidden sm:inline">
                                                                Humanize
                                                            </span>
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
                ) : history.data.length > 0 ? (
                    <div className="mx-auto my-8 w-full max-w-md rounded-3xl border border-dashed border-slate-200 bg-white/50 p-12 text-center dark:border-slate-800 dark:bg-[#0c0e1a]/50">
                        <Search className="mx-auto mb-2 size-8 text-slate-300 dark:text-slate-700" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            No matching campaigns found
                        </h3>
                        <p className="mt-1 mb-4 text-xs text-slate-500 dark:text-slate-400">
                            Try adjusting your search query or platform filter.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setPlatformFilter('all');
                            }}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <div className="mx-auto my-12 w-full max-w-md rounded-3xl border border-dashed border-slate-200 bg-white/50 p-16 text-center dark:border-slate-800 dark:bg-[#0c0e1a]/50">
                        <MessageSquare className="mx-auto mb-3 size-10 text-slate-300 dark:text-slate-700" />
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            No copies generated yet
                        </h3>
                        <p className="mt-1 mb-6 text-xs text-slate-500 dark:text-slate-400">
                            Start your first AI content generation session in
                            the studio.
                        </p>
                        <Link
                            href={generateCreate.url()}
                            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500"
                        >
                            <Sparkles className="size-4" />
                            Launch AI Studio
                        </Link>
                    </div>
                )}

                {/* Pagination Controls */}
                {history.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4 pb-2">
                        {history.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                                    link.active
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                                        : link.url
                                          ? 'border-slate-200 bg-white text-slate-700 shadow-2xs hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0c0e1a] dark:text-slate-300'
                                          : 'pointer-events-none border-slate-100 text-slate-400 opacity-50 dark:border-slate-800/40'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
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
