import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Users, Eye, Key } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    index as adminUsersIndex,
    show as adminUsersShow,
} from '@/routes/admin/users';

interface User {
    id: number;
    name: string;
    email: string;
    ai_provider?: string;
    ai_model?: string;
    is_admin: boolean;
    created_at: string;
}

interface UsersProps {
    users: {
        data: User[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function AdminUsers({ users }: UsersProps) {
    return (
        <>
            <Head title="Admin Users Overview" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-5 p-3.5 sm:gap-6 sm:p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4 sm:pb-5 dark:border-neutral-800">
                    <div>
                        <h1 className="flex items-center gap-2 text-xl font-black text-neutral-950 sm:text-2xl dark:text-neutral-50">
                            <ShieldCheck className="size-5 text-indigo-600 sm:size-6" />
                            Admin Console: Users
                        </h1>
                        <p className="mt-1 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                            Monitor registered user profiles and AI engine
                            configurations.
                        </p>
                    </div>
                </div>

                {/* Users Table Card */}
                <Card className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <CardHeader className="px-4 pt-4 pb-2 sm:px-6">
                        <CardTitle className="text-xs font-bold text-neutral-900 sm:text-sm dark:text-neutral-50">
                            Registered Users ({users.total} total)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {users.data.length > 0 ? (
                            <>
                                {/* Mobile Cards View (< md) */}
                                <div className="block divide-y divide-neutral-100 md:hidden dark:divide-neutral-800/80">
                                    {users.data.map((user) => (
                                        <div
                                            key={user.id}
                                            className="space-y-3 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h4 className="truncate text-sm font-bold text-neutral-900 dark:text-neutral-50">
                                                        {user.name}
                                                    </h4>
                                                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                {user.is_admin ? (
                                                    <Badge className="flex shrink-0 items-center gap-1 border border-indigo-100 bg-indigo-50 text-[10px] text-indigo-700 dark:border-indigo-950/30 dark:bg-indigo-950/20 dark:text-indigo-400">
                                                        <Key className="size-3" />
                                                        Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge className="dark:bg-neutral-850 dark:border-neutral-850 shrink-0 border border-neutral-200 bg-neutral-100 text-[10px] text-neutral-700 dark:text-neutral-300">
                                                        User
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-neutral-100 pt-1 font-mono text-xs text-neutral-500 dark:border-neutral-800/60 dark:text-neutral-400">
                                                <span>
                                                    Engine:{' '}
                                                    <strong className="text-neutral-700 capitalize dark:text-neutral-200">
                                                        {user.ai_provider ||
                                                            'gemini'}
                                                    </strong>
                                                </span>
                                                <span>
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-end pt-1">
                                                <Link
                                                    href={adminUsersShow.url(
                                                        user.id,
                                                    )}
                                                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100 active:scale-95 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-950/70"
                                                >
                                                    <Eye className="size-3.5" />
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View (>= md) */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-neutral-100 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                            <tr>
                                                <th className="p-4 text-xs font-bold">
                                                    Name
                                                </th>
                                                <th className="p-4 text-xs font-bold">
                                                    Email
                                                </th>
                                                <th className="p-4 text-xs font-bold">
                                                    Role
                                                </th>
                                                <th className="p-4 text-xs font-bold">
                                                    AI Provider
                                                </th>
                                                <th className="p-4 text-xs font-bold">
                                                    Joined Date
                                                </th>
                                                <th className="p-4 text-xs font-bold">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                            {users.data.map((user) => {
                                                return (
                                                    <tr
                                                        key={user.id}
                                                        className="transition hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10"
                                                    >
                                                        <td className="dark:text-neutral-250 p-4 font-semibold text-neutral-900">
                                                            {user.name}
                                                        </td>
                                                        <td className="p-4 text-xs text-neutral-600 dark:text-neutral-400">
                                                            {user.email}
                                                        </td>
                                                        <td className="p-4">
                                                            {user.is_admin ? (
                                                                <Badge className="flex w-fit items-center gap-1 border border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-950/30 dark:bg-indigo-950/20 dark:text-indigo-400">
                                                                    <Key className="size-3" />
                                                                    Admin
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="dark:bg-neutral-850 dark:border-neutral-850 w-fit border border-neutral-200 bg-neutral-100 text-neutral-700 dark:text-neutral-300">
                                                                    User
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-xs font-semibold text-neutral-900 capitalize dark:text-neutral-100">
                                                            {user.ai_provider ||
                                                                'gemini'}
                                                        </td>
                                                        <td className="dark:text-neutral-450 p-4 text-xs text-neutral-500">
                                                            {new Date(
                                                                user.created_at,
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4">
                                                            <Link
                                                                href={adminUsersShow.url(
                                                                    user.id,
                                                                )}
                                                                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
                                                            >
                                                                <Eye className="size-3.5" />
                                                                View Profile
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="py-12 text-center text-neutral-400">
                                <Users className="mx-auto mb-2 size-8 text-neutral-300" />
                                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-50">
                                    No users found
                                </h3>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="mt-2 flex justify-center gap-1.5">
                        {users.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                    link.active
                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                        : link.url
                                          ? 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                                          : 'pointer-events-none border-neutral-100 text-neutral-400 dark:border-neutral-900'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AdminUsers.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Admin Users',
            href: adminUsersIndex.url(),
        },
    ],
};
