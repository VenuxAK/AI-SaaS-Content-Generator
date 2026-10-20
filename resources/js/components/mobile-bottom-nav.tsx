import { Link } from '@inertiajs/react';
import { LayoutGrid, History, Sparkles, Key, PenTool } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import { index as tonesIndex } from '@/routes/tones';
import { index as historyIndex } from '@/routes/history';
import { create as generateCreate } from '@/routes/generate';

export function MobileBottomNav() {
    const { isCurrentUrl } = useCurrentUrl();

    const isStudio = isCurrentUrl(generateCreate.url());
    const isDashboard = isCurrentUrl(dashboard());
    const isArchive = isCurrentUrl(historyIndex.url());
    const isTones = isCurrentUrl(tonesIndex.url());
    const isKeys = isCurrentUrl('/settings/api-keys');

    return (
        <nav
            aria-label="Mobile Navigation"
            className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:hidden dark:border-slate-800/80 dark:bg-[#07080e]/95 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
        >
            <div className="grid h-15 grid-cols-5 items-center px-1">
                {/* 1. Home / Cockpit */}
                <Link
                    href={dashboard()}
                    prefetch
                    aria-label="Home Dashboard"
                    className={`flex min-h-[48px] flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                        isDashboard
                            ? 'font-bold text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <LayoutGrid className="size-5" />
                        {isDashboard && (
                            <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-indigo-600 shadow-xs dark:bg-indigo-400" />
                        )}
                    </div>
                    <span className="mt-1 truncate text-[10px] font-semibold tracking-tight">
                        Home
                    </span>
                </Link>

                {/* 2. Voice Tones */}
                <Link
                    href={tonesIndex.url()}
                    prefetch
                    aria-label="Voice Tones"
                    className={`flex min-h-[48px] flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                        isTones
                            ? 'font-bold text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <Sparkles className="size-5" />
                        {isTones && (
                            <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-indigo-600 shadow-xs dark:bg-indigo-400" />
                        )}
                    </div>
                    <span className="mt-1 truncate text-[10px] font-semibold tracking-tight">
                        Tones
                    </span>
                </Link>

                {/* 3. Center Elevated Action: AI Studio */}
                <Link
                    href={generateCreate.url()}
                    prefetch
                    aria-label="Launch AI Studio"
                    className="flex -translate-y-3.5 flex-col items-center justify-center transition-transform active:scale-90"
                >
                    <div
                        className={`flex size-12 items-center justify-center rounded-full shadow-lg transition-all ${
                            isStudio
                                ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white ring-4 shadow-indigo-500/50 ring-white dark:ring-[#07080e]'
                                : 'bg-indigo-600 text-white ring-2 shadow-indigo-600/35 ring-white/90 hover:bg-indigo-500 dark:ring-[#07080e]'
                        }`}
                    >
                        <PenTool className="size-5" />
                    </div>
                    <span
                        className={`mt-1 text-[9.5px] font-extrabold tracking-tight ${isStudio ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                        Create
                    </span>
                </Link>

                {/* 4. History Archive */}
                <Link
                    href={historyIndex.url()}
                    prefetch
                    aria-label="Content History"
                    className={`flex min-h-[48px] flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                        isArchive
                            ? 'font-bold text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <History className="size-5" />
                        {isArchive && (
                            <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-indigo-600 shadow-xs dark:bg-indigo-400" />
                        )}
                    </div>
                    <span className="mt-1 truncate text-[10px] font-semibold tracking-tight">
                        History
                    </span>
                </Link>

                {/* 5. Keys */}
                <Link
                    href="/settings/api-keys"
                    prefetch
                    aria-label="AI API Keys"
                    className={`flex min-h-[48px] flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                        isKeys
                            ? 'font-bold text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <Key className="size-5" />
                        {isKeys && (
                            <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-indigo-600 shadow-xs dark:bg-indigo-400" />
                        )}
                    </div>
                    <span className="mt-1 truncate text-[10px] font-semibold tracking-tight">
                        Keys
                    </span>
                </Link>
            </div>
        </nav>
    );
}
