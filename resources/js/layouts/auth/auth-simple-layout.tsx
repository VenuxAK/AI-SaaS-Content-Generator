import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-2 shadow-sm shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-105 dark:bg-indigo-500/20">
                                <AppLogoIcon className="size-8 object-contain" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                    Nexus<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 -mt-1">
                                    BYOK Studio
                                </span>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
