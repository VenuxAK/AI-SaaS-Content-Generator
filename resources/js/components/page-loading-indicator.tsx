import { useRouteLoading } from '@/hooks/use-route-loading';

export function PageLoadingIndicator() {
    const { isLoading, progress } = useRouteLoading();

    if (!isLoading && progress === 0) {
        return null;
    }

    return (
        <aside
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading page"
            className="pointer-events-none fixed inset-x-0 top-0 z-[99999]"
        >
            <div className="relative h-[2.5px] w-full overflow-hidden bg-transparent">
                <div
                    className="h-full bg-indigo-600 transition-all ease-out dark:bg-indigo-500"
                    style={{
                        width: `${progress}%`,
                        opacity: progress === 100 ? 0 : 1,
                        transitionProperty: 'width, opacity',
                        transitionDuration: progress === 100 ? '200ms' : '150ms',
                    }}
                />
            </div>
        </aside>
    );
}
