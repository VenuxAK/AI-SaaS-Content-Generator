import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="group flex flex-col items-center gap-2 self-center font-medium"
                >
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-2 shadow-sm shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-105 dark:bg-indigo-500/20">
                        <AppLogoIcon className="size-8 object-contain" />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                            Nexus
                            <span className="text-indigo-600 dark:text-indigo-400">
                                AI
                            </span>
                        </span>
                        <span className="-mt-1 text-[10px] font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                            BYOK Studio
                        </span>
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
