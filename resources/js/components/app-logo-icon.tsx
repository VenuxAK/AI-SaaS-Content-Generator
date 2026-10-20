import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className,
    alt = 'Nexus AI',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo/logo.png"
            alt={alt}
            className={className || 'size-8 shrink-0 object-contain'}
            {...props}
        />
    );
}
