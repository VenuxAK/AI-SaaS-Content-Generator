import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    History,
    Sparkles,
    Key,
    PenTool,
} from 'lucide-react';
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
            className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/95 dark:bg-[#07080e]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
        >
            <div className="grid grid-cols-5 items-center px-1 h-15">
                {/* 1. Home / Cockpit */}
                <Link
                    href={dashboard()}
                    prefetch
                    aria-label="Home Dashboard"
                    className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-90 ${
                        isDashboard
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <LayoutGrid className="size-5" />
                        {isDashboard && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs" />
                        )}
                    </div>
                    <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">Home</span>
                </Link>

                {/* 2. Voice Tones */}
                <Link
                    href={tonesIndex.url()}
                    prefetch
                    aria-label="Voice Tones"
                    className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-90 ${
                        isTones
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <Sparkles className="size-5" />
                        {isTones && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs" />
                        )}
                    </div>
                    <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">Tones</span>
                </Link>

                {/* 3. Center Elevated Action: AI Studio */}
                <Link
                    href={generateCreate.url()}
                    prefetch
                    aria-label="Launch AI Studio"
                    className="flex flex-col items-center justify-center -translate-y-3.5 active:scale-90 transition-transform"
                >
                    <div
                        className={`size-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                            isStudio
                                ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-indigo-500/50 ring-4 ring-white dark:ring-[#07080e]'
                                : 'bg-indigo-600 text-white shadow-indigo-600/35 hover:bg-indigo-500 ring-2 ring-white/90 dark:ring-[#07080e]'
                        }`}
                    >
                        <PenTool className="size-5" />
                    </div>
                    <span className={`text-[9.5px] font-extrabold tracking-tight mt-1 ${isStudio ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        Create
                    </span>
                </Link>

                {/* 4. History Archive */}
                <Link
                    href={historyIndex.url()}
                    prefetch
                    aria-label="Content History"
                    className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-90 ${
                        isArchive
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <History className="size-5" />
                        {isArchive && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs" />
                        )}
                    </div>
                    <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">History</span>
                </Link>

                {/* 5. Keys */}
                <Link
                    href="/settings/api-keys"
                    prefetch
                    aria-label="AI API Keys"
                    className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-90 ${
                        isKeys
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <Key className="size-5" />
                        {isKeys && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs" />
                        )}
                    </div>
                    <span className="text-[10px] font-semibold tracking-tight mt-1 truncate">Keys</span>
                </Link>
            </div>
        </nav>
    );
}
