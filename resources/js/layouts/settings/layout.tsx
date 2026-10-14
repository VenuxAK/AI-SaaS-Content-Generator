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
        <div className="px-3.5 sm:px-6 py-4 sm:py-6">
            <Heading
                title="Settings"
                description="Manage your profile, API keys, and account preferences"
            />

            <div className="mt-5 flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full lg:w-48 shrink-0">
                    <nav
                        className="flex flex-row overflow-x-auto space-x-1.5 pb-2 lg:flex-col lg:space-x-0 lg:space-y-1 lg:pb-0 no-scrollbar"
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
                                        'justify-start whitespace-nowrap min-h-[38px] px-3.5 shrink-0 rounded-lg lg:w-full transition-all active:scale-[0.98]',
                                        active
                                            ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/15 dark:bg-primary/20 dark:text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
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

                <div className="flex-1 md:max-w-2xl min-w-0">
                    <section className="max-w-xl space-y-10">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
