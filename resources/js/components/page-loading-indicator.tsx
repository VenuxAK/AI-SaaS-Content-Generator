import { Loader2 } from 'lucide-react';
import { useRouteLoading } from '@/hooks/use-route-loading';

export function PageLoadingIndicator() {
    const { isLoading, progress, showBadge } = useRouteLoading();

    if (!isLoading && progress === 0) {
        return null;
    }

    return (
        <aside
            role="status"
            aria-live="polite"
            aria-label="Loading page"
            className="pointer-events-none fixed inset-x-0 top-0 z-[99999]"
        >
            {/* Top Glowing Multi-stop Progress Bar */}
            <div className="relative h-[3.5px] w-full overflow-hidden bg-transparent">
                <div
                    className="relative h-full bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.8),0_0_6px_rgba(236,72,153,0.8)] transition-all ease-out"
                    style={{
                        width: `${progress}%`,
                        opacity: progress === 100 ? 0 : 1,
                        transitionProperty: 'width, opacity',
                        transitionDuration: progress === 100 ? '250ms' : '180ms',
                    }}
                >
                    {/* Glowing Leading Peg */}
                    <div className="absolute top-0 right-0 h-full w-24 translate-x-1/2 rotate-3 bg-gradient-to-r from-transparent to-pink-400 shadow-[0_0_14px_#ec4899,0_0_6px_#a855f7]" />
                </div>
            </div>

            {/* Floating Glass Pill Indicator */}
            <div
                className={`fixed top-3.5 left-1/2 -translate-x-1/2 transition-all duration-200 ease-out ${
                    showBadge
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none -translate-y-3 scale-95 opacity-0'
                }`}
            >
                <div className="flex items-center gap-2 rounded-full border border-indigo-500/25 bg-white/90 px-3.5 py-1.5 shadow-[0_8px_25px_-5px_rgba(99,102,241,0.3)] backdrop-blur-md dark:border-indigo-500/35 dark:bg-[#0c0e1a]/90">
                    <Loader2 className="size-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        Switching page...
                    </span>
                    <span className="flex size-1.5 animate-pulse rounded-full bg-emerald-500" />
                </div>
            </div>
        </aside>
    );
}
