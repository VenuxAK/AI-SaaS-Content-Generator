import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { isMobile, setOpenMobile } = useSidebar();

    const handleLinkClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                Studio Platform
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`rounded-xl px-3 py-2.5 min-h-[44px] flex items-center transition-all text-xs font-semibold ${
                                    active
                                        ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200/60 font-bold dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-500/30'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
                                }`}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3 w-full"
                                >
                                    {item.icon && (
                                        <item.icon
                                            className={`size-4.5 shrink-0 ${
                                                active
                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                    : 'text-slate-400 dark:text-slate-500'
                                            }`}
                                        />
                                    )}
                                    <span className="truncate">{item.title}</span>
                                    {active && (
                                        <span className="ml-auto size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
