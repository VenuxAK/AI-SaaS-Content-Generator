import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { useRouteLoading } from '@/hooks/use-route-loading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Sun, Moon } from 'lucide-react';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isRouteLoading = useRouteLoading();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-4 md:px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white/70 dark:bg-[#07080e]/70 backdrop-blur-md sticky top-0 z-20">
            {/* Animated accent line when navigating */}
            {isRouteLoading && (
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse z-30" />
            )}

            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
                <SidebarTrigger className="-ml-1 size-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer shrink-0" />
                <div className="min-w-0 truncate">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                {isRouteLoading && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 animate-in fade-in duration-150 shrink-0">
                        <Spinner className="size-3 text-indigo-500 animate-spin" />
                        <span className="hidden sm:inline">Loading...</span>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="size-9 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition shadow-2xs"
                    title={resolvedAppearance === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {resolvedAppearance === 'dark' ? (
                        <Sun className="size-4.5 text-amber-400" />
                    ) : (
                        <Moon className="size-4.5 text-indigo-600" />
                    )}
                </Button>
            </div>
        </header>
    );
}
