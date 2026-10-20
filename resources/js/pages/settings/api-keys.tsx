import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Cpu,
    ExternalLink,
    Eye,
    EyeOff,
    Key,
    Lock,
    Sparkles,
    XCircle,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface ProviderInfo {
    name: string;
    description: string;
    default_model: string;
    models: Record<string, string>;
    key_help_url: string;
    key_placeholder: string;
}

interface KeyStatus {
    is_set: boolean;
    masked: string | null;
}

interface Props {
    activeProvider?: string;
    currentProvider?: string;
    activeModel?: string;
    currentModel?: string;
    keysStatus: Record<string, KeyStatus>;
    providers: Record<string, ProviderInfo>;
    status?: string;
}

export default function ApiKeysSettings({
    activeProvider = 'gemini',
    currentProvider = 'gemini',
    activeModel = 'gemini-2.5-flash',
    currentModel = 'gemini-2.5-flash',
    keysStatus = {},
    providers = {},
    status,
}: Props) {
    const initialProvider = activeProvider || currentProvider || 'gemini';
    const initialModel = activeModel || currentModel || 'gemini-2.5-flash';

    const [selectedProvider, setSelectedProvider] =
        useState<string>(initialProvider);
    const [showKey, setShowKey] = useState<boolean>(false);
    const [customModelMode, setCustomModelMode] = useState<boolean>(false);
    const [testLoading, setTestLoading] = useState<boolean>(false);
    const [testResult, setTestResult] = useState<{
        valid: boolean;
        message: string;
    } | null>(null);

    const { errors: pageErrors } = usePage().props;

    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm({
            ai_provider: initialProvider,
            ai_model: initialModel,
            gemini_api_key: '',
            openai_api_key: '',
            openrouter_api_key: '',
        });

    const activeProviderMeta = providers[selectedProvider] || providers.gemini;

    const handleProviderSelect = (providerKey: string) => {
        setSelectedProvider(providerKey);
        setCustomModelMode(false);
        setData((prev) => ({
            ...prev,
            ai_provider: providerKey,
            ai_model:
                providers[providerKey]?.default_model ||
                Object.keys(providers[providerKey]?.models || {})[0] ||
                '',
        }));
        setTestResult(null);
    };

    const handleTestKey = async () => {
        setTestLoading(true);
        setTestResult(null);

        const keyFieldName = `${selectedProvider}_api_key` as keyof typeof data;
        const enteredKey = data[keyFieldName] as string;

        try {
            const response = await fetch('/settings/api-keys/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    provider: selectedProvider,
                    api_key: enteredKey || undefined,
                }),
            });

            const result = await response.json();
            const isValid = Boolean(result.valid ?? result.success);

            if (response.ok && isValid) {
                setTestResult({
                    valid: true,
                    message:
                        result.message ||
                        'Key connected and verified successfully!',
                });
                toast.success(result.message || 'API Key connection verified!');
            } else {
                setTestResult({
                    valid: false,
                    message:
                        result.message ||
                        'Failed to verify API key. Please check the key.',
                });
                toast.error(result.message || 'Verification failed');
            }
        } catch {
            setTestResult({
                valid: false,
                message: 'Network error occurred while testing connection.',
            });
            toast.error('Network error during test');
        } finally {
            setTestLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/api-keys', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('AI settings updated successfully!');
            },
        });
    };

    return (
        <>
            <Head title="AI & API Key Settings" />

            <div className="space-y-6">
                <div>
                    <Heading
                        title="AI & API Keys (BYOK)"
                        description="Connect your own AI API keys to generate content with zero markup. Select your primary provider and preferred model."
                    />
                </div>

                {status && (
                    <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <AlertTitle>Saved</AlertTitle>
                        <AlertDescription>{status}</AlertDescription>
                    </Alert>
                )}

                {pageErrors?.api_key && (
                    <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertTitle>API Key Required</AlertTitle>
                        <AlertDescription>
                            {pageErrors.api_key}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Provider Selector Cards */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">
                        Select Active AI Provider
                    </Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {Object.entries(providers).map(([key, provider]) => {
                            const isSelected = selectedProvider === key;
                            const isSavedActive = data.ai_provider === key;
                            const status = keysStatus[key];

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleProviderSelect(key)}
                                    className={cn(
                                        'relative flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all',
                                        isSelected
                                            ? 'border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20'
                                            : 'border-border/60 hover:border-border hover:bg-muted/40',
                                    )}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {key === 'gemini' && (
                                                <Sparkles className="h-4 w-4 text-blue-500" />
                                            )}
                                            {key === 'openai' && (
                                                <Cpu className="h-4 w-4 text-emerald-500" />
                                            )}
                                            {key === 'openrouter' && (
                                                <Zap className="h-4 w-4 text-purple-500" />
                                            )}
                                            <span className="text-sm font-semibold">
                                                {provider.name}
                                            </span>
                                        </div>
                                        {isSavedActive && (
                                            <Badge
                                                variant="default"
                                                className="h-5 px-1.5 py-0 text-[10px]"
                                            >
                                                Active
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        {status?.is_set ||
                                        (selectedProvider === key &&
                                            testResult?.valid) ? (
                                            <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                {selectedProvider === key &&
                                                testResult?.valid &&
                                                !status?.is_set
                                                    ? 'Verified (Click Save)'
                                                    : 'Configured'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                                                Not set
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Provider Configuration Card */}
                {activeProviderMeta && (
                    <Card className="border-border/80 shadow-xs">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <span>
                                            {activeProviderMeta.name}{' '}
                                            Configuration
                                        </span>
                                        {data.ai_provider ===
                                            selectedProvider && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                Current Generator
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-xs">
                                        {activeProviderMeta.description}
                                    </CardDescription>
                                </div>
                                <a
                                    href={activeProviderMeta.key_help_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
                                >
                                    <span>Get Key</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* API Key Input */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor={`${selectedProvider}_api_key`}
                                            className="text-sm font-medium"
                                        >
                                            API Key
                                        </Label>
                                        {keysStatus[selectedProvider]
                                            ?.is_set && (
                                            <span className="text-xs text-muted-foreground">
                                                Saved:{' '}
                                                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                                                    {
                                                        keysStatus[
                                                            selectedProvider
                                                        ]?.masked
                                                    }
                                                </code>
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id={`${selectedProvider}_api_key`}
                                            type={showKey ? 'text' : 'password'}
                                            placeholder={
                                                keysStatus[selectedProvider]
                                                    ?.is_set
                                                    ? '•••••••• (leave blank to keep existing)'
                                                    : activeProviderMeta.key_placeholder
                                            }
                                            value={
                                                (data[
                                                    `${selectedProvider}_api_key` as keyof typeof data
                                                ] as string) || ''
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    `${selectedProvider}_api_key` as keyof typeof data,
                                                    e.target.value,
                                                )
                                            }
                                            className="pr-20 font-mono text-base sm:text-sm"
                                            autoComplete="off"
                                        />
                                        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowKey(!showKey)
                                                }
                                                className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                                                title={
                                                    showKey
                                                        ? 'Hide key'
                                                        : 'Show key'
                                                }
                                            >
                                                {showKey ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <InputError
                                        message={
                                            errors[
                                                `${selectedProvider}_api_key` as keyof typeof errors
                                            ]
                                        }
                                    />

                                    <div className="flex flex-col justify-between gap-2.5 pt-1 sm:flex-row sm:items-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleTestKey}
                                            disabled={
                                                testLoading ||
                                                (!data[
                                                    `${selectedProvider}_api_key` as keyof typeof data
                                                ] &&
                                                    !keysStatus[
                                                        selectedProvider
                                                    ]?.is_set)
                                            }
                                            className="min-h-[38px] w-full gap-1.5 text-xs font-medium sm:h-8 sm:w-auto"
                                        >
                                            {testLoading ? (
                                                <Spinner className="h-3 w-3" />
                                            ) : (
                                                <Key className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            Test Key Connection
                                        </Button>

                                        <p className="text-center text-[11px] text-muted-foreground sm:text-right">
                                            Encrypted at rest with AES-256
                                        </p>
                                    </div>

                                    {testResult && (
                                        <div
                                            className={cn(
                                                'mt-3 flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-medium shadow-xs transition-all',
                                                testResult.valid
                                                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                                                    : 'border-destructive/40 bg-destructive/15 text-destructive',
                                            )}
                                        >
                                            {testResult.valid ? (
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                                            )}
                                            <span>{testResult.message}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Model Selector */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="ai_model"
                                            className="text-sm font-medium"
                                        >
                                            Default Model
                                        </Label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCustomModelMode(
                                                    !customModelMode,
                                                )
                                            }
                                            className="flex min-h-[32px] items-center text-xs font-medium text-primary hover:underline"
                                        >
                                            {customModelMode
                                                ? 'Pick from curated list'
                                                : 'Enter custom model ID'}
                                        </button>
                                    </div>

                                    {customModelMode ? (
                                        <div className="space-y-1.5">
                                            <Input
                                                id="ai_model"
                                                type="text"
                                                placeholder="e.g. gemini-3.8-flash, custom fine-tuned model"
                                                value={data.ai_model}
                                                onChange={(e) =>
                                                    setData(
                                                        'ai_model',
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-[44px] font-mono text-base sm:min-h-9 sm:text-sm"
                                            />
                                            <p className="text-[11px] text-muted-foreground">
                                                Specify any valid model ID
                                                supported by your API key.
                                            </p>
                                        </div>
                                    ) : (
                                        <Select
                                            value={data.ai_model}
                                            onValueChange={(val) =>
                                                setData('ai_model', val)
                                            }
                                        >
                                            <SelectTrigger
                                                id="ai_model"
                                                className="min-h-[44px] w-full sm:min-h-9"
                                            >
                                                <SelectValue placeholder="Choose a model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(
                                                    activeProviderMeta.models ||
                                                        {},
                                                ).map(
                                                    ([
                                                        modelKey,
                                                        modelLabel,
                                                    ]) => (
                                                        <SelectItem
                                                            key={modelKey}
                                                            value={modelKey}
                                                        >
                                                            {modelLabel}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    <InputError message={errors.ai_model} />
                                </div>

                                <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-h-[44px] w-full gap-2 sm:w-auto"
                                    >
                                        {processing && (
                                            <Spinner className="h-4 w-4" />
                                        )}
                                        Save AI Settings
                                    </Button>

                                    {recentlySuccessful && (
                                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            Saved!
                                        </p>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Privacy & Security Guarantee */}
                <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 p-4 text-xs text-muted-foreground">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="space-y-1">
                        <p className="font-medium text-foreground">
                            Zero Middleman & Direct Streaming
                        </p>
                        <p>
                            Your API keys are encrypted at rest using
                            Laravel&apos;s application key and never logged.
                            Content generation requests stream directly between
                            your server and the AI provider without any usage
                            tracking or credit fees.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

ApiKeysSettings.layout = {
    breadcrumbs: [
        {
            title: 'AI & API Keys',
            href: '/settings/api-keys',
        },
    ],
};
