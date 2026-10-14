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
            className={className || 'size-8 object-contain shrink-0'}
            {...props}
        />
    );
}
