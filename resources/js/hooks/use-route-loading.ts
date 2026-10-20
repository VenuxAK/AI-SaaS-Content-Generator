import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export interface RouteLoadingState {
    isLoading: boolean;
    progress: number;
    showBadge: boolean;
}

/**
 * Hook to track whether an Inertia page navigation/visit is currently in progress
 * with realistic smooth progress trickling and delayed badge display.
 */
export function useRouteLoading(): RouteLoadingState {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showBadge, setShowBadge] = useState(false);

    const trickleTimer = useRef<NodeJS.Timeout | null>(null);
    const badgeTimer = useRef<NodeJS.Timeout | null>(null);
    const finishTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleStart = () => {
            if (finishTimer.current) {
                clearTimeout(finishTimer.current);
                finishTimer.current = null;
            }

            setIsLoading(true);
            setProgress(20);

            document.documentElement.classList.add('cursor-progress');

            // Show floating indicator if navigation takes longer than 120ms
            if (badgeTimer.current) {
                clearTimeout(badgeTimer.current);
            }

            badgeTimer.current = setTimeout(() => {
                setShowBadge(true);
            }, 120);

            // Smooth trickle progress
            let current = 20;

            const trickle = () => {
                if (current < 85) {
                    const step = Math.random() * 12 + 4;

                    current = Math.min(current + step, 88);
                    setProgress(current);
                    trickleTimer.current = setTimeout(
                        trickle,
                        180 + Math.random() * 120,
                    );
                }
            };

            if (trickleTimer.current) {
                clearTimeout(trickleTimer.current);
            }

            trickleTimer.current = setTimeout(trickle, 140);
        };

        const handleProgress = (event: Event) => {
            const customEvent = event as CustomEvent<{
                progress?: { percentage?: number };
            }>;

            if (customEvent?.detail?.progress?.percentage) {
                setProgress(
                    Math.max(
                        20,
                        Math.min(customEvent.detail.progress.percentage, 95),
                    ),
                );
            }
        };

        const handleFinish = () => {
            if (trickleTimer.current) {
                clearTimeout(trickleTimer.current);
                trickleTimer.current = null;
            }

            if (badgeTimer.current) {
                clearTimeout(badgeTimer.current);
                badgeTimer.current = null;
            }

            setProgress(100);

            if (finishTimer.current) {
                clearTimeout(finishTimer.current);
            }

            finishTimer.current = setTimeout(() => {
                setIsLoading(false);
                setShowBadge(false);
                setProgress(0);
                document.documentElement.classList.remove('cursor-progress');
            }, 250);
        };

        const removeStart = router.on('start', handleStart);
        const removeProgress = router.on('progress', handleProgress);
        const removeFinish = router.on('finish', handleFinish);

        return () => {
            removeStart();
            removeProgress();
            removeFinish();

            if (trickleTimer.current) {
                clearTimeout(trickleTimer.current);
            }

            if (badgeTimer.current) {
                clearTimeout(badgeTimer.current);
            }

            if (finishTimer.current) {
                clearTimeout(finishTimer.current);
            }

            document.documentElement.classList.remove('cursor-progress');
        };
    }, []);

    return { isLoading, progress, showBadge };
}
