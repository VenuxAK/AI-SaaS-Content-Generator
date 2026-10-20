import type { ReactNode } from 'react';

interface GridBackgroundProps {
    children?: ReactNode;
    className?: string;
}

export function GridBackground({
    children,
    className = '',
}: GridBackgroundProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Subtle Technical Grid Matrix with Radial Fade Mask */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

            {/* Soft Top Radial Spotlight */}
            <div className="pointer-events-none absolute top-0 left-1/2 h-[320px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px] sm:w-[900px] dark:bg-indigo-500/15" />

            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}

export default GridBackground;
