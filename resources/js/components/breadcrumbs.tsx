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
                <Breadcrumb className="truncate max-w-full">
                    <BreadcrumbList className="flex-nowrap whitespace-nowrap overflow-hidden text-ellipsis">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const isSecondLast = index === breadcrumbs.length - 2;

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem className={!isLast && !isSecondLast && breadcrumbs.length > 2 ? 'hidden sm:inline-flex' : ''}>
                                        {isLast ? (
                                            <BreadcrumbPage className="font-semibold text-xs sm:text-sm truncate max-w-[140px] sm:max-w-none">
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href} className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && (
                                        <BreadcrumbSeparator className={!isLast && !isSecondLast && breadcrumbs.length > 2 ? 'hidden sm:inline-flex' : ''} />
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
