import { Check, Download, PlusSquare, Share, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { usePwaInstall } from '@/hooks/use-pwa-install';

interface PwaInstallButtonProps {
    className?: string;
    collapsed?: boolean;
}

export function PwaInstallButton({
    className = '',
    collapsed = false,
}: PwaInstallButtonProps) {
    const { isInstallable, isInstalled, isIOS, promptInstall } = usePwaInstall();
    const [showIosModal, setShowIosModal] = useState(false);
    const [installing, setInstalling] = useState(false);

    // If app is already installed or running as standalone, don't show the button
    if (isInstalled) {
        return null;
    }

    const handleClick = async () => {
        if (isIOS) {
            setShowIosModal(true);

            return;
        }

        if (isInstallable) {
            setInstalling(true);
            await promptInstall();
            setInstalling(false);
        } else {
            // For other browsers (e.g. Firefox or Safari desktop), provide quick guide
            setShowIosModal(true);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                disabled={installing}
                title="Install App on Desktop or Mobile"
                className={`group flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-700 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/15 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25 ${
                    collapsed ? 'justify-center px-2' : 'w-full'
                } ${className}`}
            >
                <div className="flex size-5 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm dark:bg-indigo-500">
                    <Download className="size-3 transition-transform group-hover:scale-110" />
                </div>
                {!collapsed && (
                    <div className="flex flex-1 items-center justify-between text-left">
                        <span>Install Web App</span>
                        <span className="rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-300">
                            PWA
                        </span>
                    </div>
                )}
            </button>

            {/* iOS & Manual Install Guide Modal */}
            <Dialog open={showIosModal} onOpenChange={setShowIosModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                            <Smartphone className="size-6" />
                        </div>
                        <DialogTitle className="text-center text-lg font-bold">
                            Install AI SaaS Content Generator
                        </DialogTitle>
                        <DialogDescription className="text-center text-sm text-slate-500 dark:text-slate-400">
                            Run this app in a standalone native window on your device with offline support.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2 text-sm">
                        {isIOS ? (
                            <ol className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                                <li className="flex items-start gap-3">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                                        1
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                        Tap the <strong className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400"><Share className="size-3.5" /> Share</strong> button in Safari's toolbar.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                                        2
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                        Scroll down and tap <strong className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400"><PlusSquare className="size-3.5" /> Add to Home Screen</strong>.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                                        3
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                        Tap <strong className="font-semibold text-indigo-600 dark:text-indigo-400">Add</strong> in the top-right corner to finish.
                                    </span>
                                </li>
                            </ol>
                        ) : (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                                <p className="mb-2 font-medium">To install on your browser:</p>
                                <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <li>Click the <strong>Install</strong> icon in your browser address bar (top right).</li>
                                    <li>Or open your browser menu (⋮ / ⋯) and choose <strong>"Install AI SaaS Content Generator"</strong>.</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setShowIosModal(false)}
                            className="w-full"
                        >
                            <Check className="mr-2 size-4" />
                            Got it
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
