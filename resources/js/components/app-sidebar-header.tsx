import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem as BreadcrumbItemType, User } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as { auth?: { user?: User } };
    const user = auth?.user;
    const getInitials = useInitials();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && resolvedAppearance === 'dark';

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="relative sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/70 px-3 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:px-4 md:px-6 dark:border-slate-800/80 dark:bg-[#07080e]/70">
            <div className="mr-2 flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <SidebarTrigger className="-ml-1 size-9 shrink-0 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60" />
                <div className="min-w-0 truncate">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="size-9 cursor-pointer rounded-xl border border-slate-200/80 bg-white/70 text-slate-700 shadow-2xs transition hover:bg-slate-100 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
                    title={
                        isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
                    }
                >
                    {isDark ? (
                        <Sun className="size-4.5 text-amber-400" />
                    ) : (
                        <Moon className="size-4.5 text-indigo-600" />
                    )}
                </Button>

                {user && (
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 p-0.5 shadow-2xs transition hover:ring-2 hover:ring-indigo-500/20 active:scale-95 dark:border-slate-800/80 dark:bg-slate-900/60"
                                    aria-label="User Account Menu"
                                >
                                    <Avatar className="size-7.5 overflow-hidden rounded-lg">
                                        <AvatarImage
                                            src={user.avatar}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-2xl p-1.5 shadow-xl"
                                align="end"
                                side="bottom"
                            >
                                <UserMenuContent user={user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </header>
    );
}
