/**
 * Register the Progressive Web App Service Worker
 */
export function registerServiceWorker(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((registration) => {
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;

                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (
                                installingWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                            ) {
                                console.log('[PWA] App updated in background.');
                            }
                        };
                    }
                };
            })
            .catch((error) => {
                console.warn('[PWA] Service worker registration error:', error);
            });
    });
}
