import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * Hook to track whether an Inertia page navigation/visit is currently in progress.
 */
export function useRouteLoading(): boolean {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', () => {
            setIsLoading(true);
        });

        const removeFinish = router.on('finish', () => {
            setIsLoading(false);
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return isLoading;
}
