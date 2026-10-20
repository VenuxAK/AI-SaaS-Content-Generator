import { useState, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';

export default function AppLogo() {
    const { state } = useSidebar();
    const { resolvedAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoTheme = mounted ? resolvedAppearance : 'light';

    return (
        <div className="flex w-full items-center gap-2 transition-all duration-200">
            <img
                src={`/images/logo/icon-only-${logoTheme}.png`}
                alt="Nexus AI"
                className="size-7 shrink-0 object-contain"
            />
            {state !== 'collapsed' && (
                <span className="truncate text-sm font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Nexus AI
                </span>
            )}
        </div>
    );
}
