import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function checkIsStandalone(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
}

function checkIsIOS(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    return isIosDevice && !checkIsStandalone();
}

export function usePwaInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState<boolean>(checkIsStandalone);
    const [isIOS] = useState<boolean>(checkIsIOS);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async (): Promise<boolean> => {
        if (!deferredPrompt) {
            return false;
        }

        try {
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                setIsInstalled(true);
                setDeferredPrompt(null);

                return true;
            }

            return false;
        } catch (error) {
            console.error('[PWA] Prompt error:', error);

            return false;
        }
    }, [deferredPrompt]);

    return {
        isInstallable: !!deferredPrompt,
        isInstalled,
        isIOS,
        promptInstall,
    };
}
