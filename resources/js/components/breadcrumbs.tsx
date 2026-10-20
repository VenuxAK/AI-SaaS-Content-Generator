import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb className="max-w-full truncate">
                    <BreadcrumbList className="flex-nowrap overflow-hidden text-ellipsis whitespace-nowrap">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const isSecondLast =
                                index === breadcrumbs.length - 2;

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem
                                        className={
                                            !isLast &&
                                            !isSecondLast &&
                                            breadcrumbs.length > 2
                                                ? 'hidden sm:inline-flex'
                                                : ''
                                        }
                                    >
                                        {isLast ? (
                                            <BreadcrumbPage className="max-w-[140px] truncate text-xs font-semibold sm:max-w-none sm:text-sm">
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={item.href}
                                                    className="max-w-[100px] truncate text-xs sm:max-w-none sm:text-sm"
                                                >
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && (
                                        <BreadcrumbSeparator
                                            className={
                                                !isLast &&
                                                !isSecondLast &&
                                                breadcrumbs.length > 2
                                                    ? 'hidden sm:inline-flex'
                                                    : ''
                                            }
                                        />
                                    )}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
