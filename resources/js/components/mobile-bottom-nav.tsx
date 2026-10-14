import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    History,
    Sparkles,
    Key,
    PenTool,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useRouteLoading } from '@/hooks/use-route-loading';
import { dashboard } from '@/routes';
import { index as tonesIndex } from '@/routes/tones';
import { index as historyIndex } from '@/routes/history';
import { create as generateCreate } from '@/routes/generate';

export function MobileBottomNav() {
    const { isCurrentUrl } = useCurrentUrl();
    const isRouteLoading = useRouteLoading();

    const isStudio = isCurrentUrl(generateCreate.url());
    const isDashboard = isCurrentUrl(dashboard());
    const isArchive = isCurrentUrl(historyIndex.url());
    const isTones = isCurrentUrl(tonesIndex.url());
    const isKeys = isCurrentUrl('/settings/api-keys');

    return (
        <nav
            aria-label="Mobile Navigation"
            className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/90 dark:bg-[#07080e]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
        >
            {/* Navigation progress indicator line */}
            {isRouteLoading && (
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse z-40" />
            )}

            <div className="grid grid-cols-5 items-center px-1 h-14">
                {/* 1. Cockpit */}
                <Link
                    href={dashboard()}
                    prefetch
                    className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                        isDashboard
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <LayoutGrid className="size-5" />
                        {isDashboard && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                        )}
                    </div>
                    <span className="text-[10px] tracking-tight mt-1 truncate">Cockpit</span>
                </Link>

                {/* 2. Personas */}
                <Link
                    href={tonesIndex.url()}
                    prefetch
                    className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                        isTones
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <Sparkles className="size-5" />
                        {isTones && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                        )}
                    </div>
                    <span className="text-[10px] tracking-tight mt-1 truncate">Personas</span>
                </Link>

                {/* 3. Center Elevated Action: AI Studio */}
                <Link
                    href={generateCreate.url()}
                    prefetch
                    aria-label="Launch AI Studio"
                    className="flex flex-col items-center justify-center -translate-y-3 active:scale-90 transition-transform"
                >
                    <div
                        className={`size-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                            isStudio
                                ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-indigo-500/50 ring-4 ring-white dark:ring-[#07080e]'
                                : 'bg-indigo-600 text-white shadow-indigo-600/35 hover:bg-indigo-500 ring-2 ring-white/80 dark:ring-[#07080e]'
                        }`}
                    >
                        <PenTool className="size-5" />
                    </div>
                    <span className={`text-[9.5px] font-extrabold tracking-tight mt-1 ${isStudio ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        Studio
                    </span>
                </Link>

                {/* 4. Archive */}
                <Link
                    href={historyIndex.url()}
                    prefetch
                    className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                        isArchive
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <History className="size-5" />
                        {isArchive && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                        )}
                    </div>
                    <span className="text-[10px] tracking-tight mt-1 truncate">Archive</span>
                </Link>

                {/* 5. Keys */}
                <Link
                    href="/settings/api-keys"
                    prefetch
                    className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                        isKeys
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <div className="relative">
                        <Key className="size-5" />
                        {isKeys && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                        )}
                    </div>
                    <span className="text-[10px] tracking-tight mt-1 truncate">AI Keys</span>
                </Link>
            </div>
        </nav>
    );
}
