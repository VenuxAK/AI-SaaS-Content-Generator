import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    History,
    Sparkles,
    Key,
    Users,
    PenTool,
    Zap,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as tonesIndex } from '@/routes/tones';
import { index as historyIndex } from '@/routes/history';
import { index as adminUsersIndex } from '@/routes/admin/users';
import { create as generateCreate } from '@/routes/generate';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const user = auth?.user;
    const { state, isMobile, setOpenMobile } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const handleMobileDismiss = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    const navItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'AI Copy Studio',
            href: generateCreate.url(),
            icon: PenTool,
        },
        {
            title: 'Content Archive',
            href: historyIndex.url(),
            icon: History,
        },
        {
            title: 'Voice Personas',
            href: tonesIndex.url(),
            icon: Sparkles,
        },
        {
            title: 'AI & API Keys',
            href: '/settings/api-keys',
            icon: Key,
        },
    ];

    if (user && user.is_admin) {
        navItems.push({
            title: 'Admin Users',
            href: adminUsersIndex.url(),
            icon: Users,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-slate-200/80 dark:border-slate-800/80">
            <SidebarHeader className="border-b border-slate-100 dark:border-slate-800/60 p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={dashboard()} prefetch onClick={handleMobileDismiss}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={navItems} />

                {/* BYOK Status Card (when expanded) */}
                {!isCollapsed && (
                    <div className="mx-3 mt-auto mb-2 rounded-2xl border border-indigo-500/20 bg-indigo-50/50 p-3.5 dark:border-indigo-500/15 dark:bg-[#0c0e1a]/80">
                        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                            <span className="flex items-center gap-1.5">
                                <Zap className="size-3 text-indigo-600 dark:text-indigo-400" />
                                BYOK Connected
                            </span>
                            <span className="flex size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                            0% Token markup. Unlimited direct streaming.
                        </p>
                        <Link
                            href="/settings/api-keys"
                            onClick={handleMobileDismiss}
                            className="mt-2 block text-[10px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                            Configure AI credentials →
                        </Link>
                    </div>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 dark:border-slate-800/60 p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
