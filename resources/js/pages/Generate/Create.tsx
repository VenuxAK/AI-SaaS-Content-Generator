import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Cpu,
    History,
    Key,
    PenTool,
    Sparkles,
    Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { store as generateStore } from '@/routes/generate';
import { index as historyIndex, show as historyShow } from '@/routes/history';
import { index as tonesIndex } from '@/routes/tones';

interface Tone {
    id: number;
    name: string;
}

interface Option {
    value: string;
    label: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    ai_content: string | null;
    status: string;
    created_at: string;
    tone?: Tone | null;
}

interface CreateProps {
    tones: Tone[];
    contentTypes: Option[];
    outputLanguages: Option[];
    recentGenerations?: Generation[];
    aiProvider?: string;
    aiModel?: string;
    hasApiKey?: boolean;
}

export default function Create({
    tones,
    contentTypes,
    outputLanguages,
    recentGenerations = [],
    aiProvider = 'gemini',
    aiModel = 'gemini-2.5-flash',
    hasApiKey = false,
}: CreateProps) {
    const { errors: pageErrors } = usePage().props;

    const providerNames: Record<string, string> = {
        gemini: 'Google Gemini',
        openai: 'OpenAI',
        openrouter: 'OpenRouter',
    };

    const { data, setData, post, processing, errors } = useForm({
        content_type: contentTypes[0]?.value || 'facebook_post',
        output_language: 'en',
        tone_id: tones[0]?.id || '',
        user_prompt: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(generateStore.url());
    };

    return (
        <>
            <Head title="Generate AI Copy" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6 p-6">
                {/* Header Title */}
                <div className="flex flex-col gap-1">
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">
                        <PenTool className="size-6 text-indigo-600 dark:text-indigo-400" />
                        Generate AI Copy
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Create high-converting copy, posts, and scripts streamed directly from your active AI model.
                    </p>
                </div>

                {/* API Key Missing Alert */}
                {(!hasApiKey || pageErrors?.api_key) && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-amber-500/20 p-2 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">API Key Required</h4>
                                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                                    {pageErrors?.api_key ||
                                        `Please configure your ${providerNames[aiProvider] || 'AI'} API key in settings before generating content.`}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/settings/api-keys"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition shrink-0"
                        >
                            <Key className="size-3.5" />
                            Configure Key
                        </Link>
                    </div>
                )}

                {/* Main Content Layout */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Form Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="content_type"
                                            className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                                        >
                                            Content Type
                                        </label>
                                        <Select
                                            value={data.content_type}
                                            onValueChange={(val) =>
                                                setData('content_type', val)
                                            }
                                        >
                                            <SelectTrigger className="h-11 w-full cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 shadow-xs hover:border-neutral-300 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-700">
                                                <SelectValue placeholder="Select content type" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                                                {contentTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.content_type && (
                                            <span className="mt-1 block text-xs text-rose-500">
                                                {errors.content_type}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="output_language"
                                            className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                                        >
                                            Language
                                        </label>
                                        <Select
                                            value={data.output_language}
                                            onValueChange={(val) =>
                                                setData('output_language', val)
                                            }
                                        >
                                            <SelectTrigger className="h-11 w-full cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 shadow-xs hover:border-neutral-300 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-700">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                                                {outputLanguages.map((lang) => (
                                                    <SelectItem
                                                        key={lang.value}
                                                        value={lang.value}
                                                    >
                                                        {lang.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.output_language && (
                                            <span className="mt-1 block text-xs text-rose-500">
                                                {errors.output_language}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="tone_id"
                                            className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                                        >
                                            Writing Tone
                                        </label>
                                        <Link
                                            href={tonesIndex.url()}
                                            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Manage Tones →
                                        </Link>
                                    </div>
                                    {tones.length > 0 ? (
                                        <Select
                                            value={
                                                data.tone_id
                                                    ? String(data.tone_id)
                                                    : 'none'
                                            }
                                            onValueChange={(val) =>
                                                setData(
                                                    'tone_id',
                                                    val === 'none' ? '' : val
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-11 w-full cursor-pointer rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 shadow-xs hover:border-neutral-300 focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-700">
                                                <SelectValue placeholder="Select tone" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                                                <SelectItem value="none">
                                                    None (Standard Default)
                                                </SelectItem>
                                                {tones.map((t) => (
                                                    <SelectItem
                                                        key={t.id}
                                                        value={String(t.id)}
                                                    >
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-500 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-400">
                                            <span>
                                                No custom tones defined. Standard tone will be used.
                                            </span>
                                            <Link
                                                href={tonesIndex.url()}
                                                className="font-bold text-indigo-600 underline dark:text-indigo-400"
                                            >
                                                Create Tone
                                            </Link>
                                        </div>
                                    )}
                                    {errors.tone_id && (
                                        <span className="mt-1 block text-xs text-rose-500">
                                            {errors.tone_id}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="user_prompt"
                                            className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                                        >
                                            What should we write about?
                                        </label>
                                        <span className="text-xs text-neutral-400">
                                            {data.user_prompt.length} / 2000
                                        </span>
                                    </div>
                                    <textarea
                                        id="user_prompt"
                                        rows={6}
                                        placeholder="Describe your product, offer, target audience, or topic in detail. The more context you provide, the better the copy!"
                                        value={data.user_prompt}
                                        onChange={(e) =>
                                            setData('user_prompt', e.target.value)
                                        }
                                        className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 font-sans text-sm leading-relaxed text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                                        maxLength={2000}
                                        required
                                    />
                                    {errors.user_prompt && (
                                        <span className="mt-1 block text-xs text-rose-500">
                                            {errors.user_prompt}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || !hasApiKey}
                                    className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-xs shadow-indigo-600/10 hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    <Sparkles className="size-4" />
                                    {processing
                                        ? 'Initializing Stream...'
                                        : hasApiKey
                                        ? 'Generate Copy'
                                        : 'Configure API Key to Generate'}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Right Side AI Engine Info & Recent History */}
                    <div className="space-y-6">
                        {/* Engine Details Card */}
                        <Card className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                    Generation Engine
                                </p>
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                        hasApiKey
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    }`}
                                >
                                    <span
                                        className={`size-1.5 rounded-full ${
                                            hasApiKey
                                                ? 'bg-emerald-500'
                                                : 'bg-amber-500'
                                        }`}
                                    />
                                    {hasApiKey ? 'Ready' : 'Key Needed'}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                    {aiProvider === 'gemini' && (
                                        <Sparkles className="size-5" />
                                    )}
                                    {aiProvider === 'openai' && (
                                        <Cpu className="size-5" />
                                    )}
                                    {aiProvider === 'openrouter' && (
                                        <Zap className="size-5" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-neutral-950 dark:text-neutral-50">
                                        {providerNames[aiProvider] || aiProvider}
                                    </h4>
                                    <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                                        {aiModel}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/settings/api-keys"
                                className="mt-4 block text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                Change provider or model →
                            </Link>
                        </Card>

                        {/* Recent History */}
                        <Card className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <History className="size-4 text-indigo-600" />
                                    <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                                        Recent Copies
                                    </h2>
                                </div>
                                <Link
                                    href={historyIndex.url()}
                                    className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 hover:underline"
                                >
                                    View All
                                </Link>
                            </div>

                            {recentGenerations.length > 0 ? (
                                <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                                    {recentGenerations.map((gen) => (
                                        <Link
                                            key={gen.id}
                                            href={historyShow.url(gen.id)}
                                            className="group block rounded-xl border border-neutral-100 p-3 transition hover:bg-neutral-50 dark:border-neutral-800/60 dark:hover:bg-neutral-950"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold capitalize text-neutral-900 dark:text-neutral-100">
                                                    {gen.content_type.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] text-neutral-400">
                                                    {new Date(
                                                        gen.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="mt-1 truncate text-xs text-neutral-500 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-300">
                                                {gen.user_prompt}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
                                    No copies generated yet.
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Generate Copy', href: '/generate' },
    ],
};
