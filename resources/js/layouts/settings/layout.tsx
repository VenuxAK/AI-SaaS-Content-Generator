import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'AI & API Keys',
        href: '/settings/api-keys',
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-3.5 py-4 sm:px-6 sm:py-6">
            <Heading
                title="Settings"
                description="Manage your profile, API keys, and account preferences"
            />

            <div className="mt-5 flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full shrink-0 lg:w-48">
                    <nav
                        className="no-scrollbar flex flex-row space-x-1.5 overflow-x-auto pb-2 lg:flex-col lg:space-y-1 lg:space-x-0 lg:pb-0"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const active = isCurrentOrParentUrl(item.href);
                            return (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'min-h-[38px] shrink-0 justify-start rounded-lg px-3.5 whitespace-nowrap transition-all active:scale-[0.98] lg:w-full',
                                        active
                                            ? 'bg-primary/10 font-semibold text-primary hover:bg-primary/15 dark:bg-primary/20 dark:text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                    )}
                                >
                                    <Link href={item.href}>
                                        {item.icon && (
                                            <item.icon className="h-4 w-4" />
                                        )}
                                        {item.title}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-4 lg:hidden" />

                <div className="min-w-0 flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-10">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
