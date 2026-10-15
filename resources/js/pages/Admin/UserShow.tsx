import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Cpu, Key, ShieldCheck, Sparkles, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index as adminUsersIndex } from '@/routes/admin/users';

interface User {
    id: number;
    name: string;
    email: string;
    ai_provider?: string;
    ai_model?: string;
    is_admin: boolean;
    created_at: string;
}

interface Tone {
    id: number;
    name: string;
}

interface Generation {
    id: number;
    content_type: string;
    output_language: string;
    user_prompt: string;
    ai_provider?: string | null;
    ai_model?: string | null;
    status: string;
    created_at: string;
    tone?: Tone | null;
}

interface UserShowProps {
    subjectUser: User;
    generations: {
        data: Generation[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
}

export default function AdminUserShow({
    subjectUser,
    generations,
}: UserShowProps) {
    const providerNameMap: Record<string, string> = {
        gemini: 'Google Gemini',
        openai: 'OpenAI',
        openrouter: 'OpenRouter',
    };

    return (
        <>
            <Head title={`User Profile: ${subjectUser.name}`} />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-5 sm:gap-6 p-3.5 sm:p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-5 dark:border-neutral-800">
                    <div>
                        <Link
                            href={adminUsersIndex.url()}
                            className="mb-2 flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                            <ArrowLeft className="size-3" />
                            Back to Users
                        </Link>
                        <h1 className="flex items-center gap-2 text-2xl font-black text-neutral-950 dark:text-neutral-50">
                            User Profile: {subjectUser.name}
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Review AI engine preferences and generated copywriting history for this user.
                        </p>
                    </div>
                </div>

                {/* Profile & AI Engine Details Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Metadata Card */}
                    <Card className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="border-b border-neutral-100 pb-2 text-sm font-bold text-neutral-950 dark:border-neutral-800 dark:text-neutral-50">
                            Account Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                    User ID
                                </span>
                                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                    #{subjectUser.id}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                    Role
                                </span>
                                <div className="mt-0.5">
                                    {subjectUser.is_admin ? (
                                        <Badge className="flex w-fit items-center gap-1 border border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-950/30 dark:bg-indigo-950/20 dark:text-indigo-400">
                                            <Key className="size-3" />
                                            Admin
                                        </Badge>
                                    ) : (
                                        <Badge className="w-fit border border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                                            User
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                Email Address
                            </span>
                            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                {subjectUser.email}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                Registration Date
                            </span>
                            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                {new Date(subjectUser.created_at).toLocaleString()}
                            </span>
                        </div>
                    </Card>

                    {/* AI Configuration Card */}
                    <Card className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <h3 className="border-b border-neutral-100 pb-2 text-sm font-bold text-neutral-950 dark:border-neutral-800 dark:text-neutral-50 flex items-center gap-1.5">
                            <ShieldCheck className="size-4 text-indigo-600" />
                            AI Engine Preferences (BYOK)
                        </h3>

                        <div className="flex items-center gap-3 pt-1">
                            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                {subjectUser.ai_provider === 'gemini' && (
                                    <Sparkles className="size-6" />
                                )}
                                {subjectUser.ai_provider === 'openai' && (
                                    <Cpu className="size-6" />
                                )}
                                {subjectUser.ai_provider === 'openrouter' && (
                                    <Zap className="size-6" />
                                )}
                                {!subjectUser.ai_provider && (
                                    <Sparkles className="size-6" />
                                )}
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                    Primary Provider
                                </span>
                                <h4 className="text-base font-bold text-neutral-950 dark:text-neutral-50">
                                    {providerNameMap[subjectUser.ai_provider ?? 'gemini'] ||
                                        subjectUser.ai_provider}
                                </h4>
                            </div>
                        </div>

                        <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                Active Model
                            </span>
                            <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                {subjectUser.ai_model || 'Default provider model'}
                            </span>
                        </div>

                        <div className="rounded-xl bg-neutral-50 p-3 text-[11px] text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                            API keys are encrypted using AES-256 at rest and cannot be viewed in the admin console.
                        </div>
                    </Card>
                </div>

                {/* Generations Table Section */}
                <Card className="flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-neutral-900 dark:text-neutral-50">
                            <Sparkles className="size-4 text-indigo-600" />
                            Generated Copy History ({generations.total} total)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        {generations.data.length > 0 ? (
                            <>
                                {/* Mobile Generations Card List (< md) */}
                                <div className="block md:hidden divide-y divide-neutral-100 dark:divide-neutral-800/80">
                                    {generations.data.map((gen) => (
                                        <div key={gen.id} className="p-4 space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                                                    {gen.content_type.replace('_', ' ')}
                                                </span>
                                                <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 capitalize text-[10px]">
                                                    {gen.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                                {gen.user_prompt}
                                            </p>
                                            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono pt-1">
                                                <span className="capitalize">{gen.ai_provider || 'gemini'}</span>
                                                <span>{new Date(gen.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View (>= md) */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-neutral-100 bg-neutral-50 text-[10px] font-bold uppercase text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950">
                                            <tr>
                                                <th className="p-3">Date</th>
                                                <th className="p-3">Type</th>
                                                <th className="p-3">Prompt</th>
                                                <th className="p-3">Engine</th>
                                                <th className="p-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                            {generations.data.map((gen) => (
                                                <tr
                                                    key={gen.id}
                                                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10"
                                                >
                                                    <td className="whitespace-nowrap p-3 text-xs text-neutral-400">
                                                        {new Date(
                                                            gen.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3 text-xs font-bold capitalize text-indigo-600">
                                                        {gen.content_type.replace(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </td>
                                                    <td className="max-w-[320px] truncate p-3 text-xs text-neutral-600 dark:text-neutral-400">
                                                        {gen.user_prompt}
                                                    </td>
                                                    <td className="p-3 text-xs capitalize text-neutral-600 dark:text-neutral-300">
                                                        {gen.ai_provider || 'gemini'}
                                                    </td>
                                                    <td className="p-3 text-xs">
                                                        <Badge className="bg-neutral-100 text-neutral-600 capitalize">
                                                            {gen.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="py-8 text-center text-xs text-neutral-400">
                                No copy generated yet by this user.
                            </div>
                        )}
                    </CardContent>
                    {generations.links.length > 3 && (
                        <div className="flex justify-center gap-1 border-t border-neutral-100 py-3 dark:border-neutral-800">
                            {generations.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`rounded px-2 py-1 text-[10px] font-semibold border transition ${
                                        link.active
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : link.url
                                            ? 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                                            : 'pointer-events-none border-neutral-100 text-neutral-400 dark:border-neutral-900'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}

AdminUserShow.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Admin Users',
            href: '/admin/users',
        },
        {
            title: 'User Profile',
            href: '/admin/users',
        },
    ],
};
