'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Loader2, Plus, Trash2, Pencil, ListChecks, LogIn } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axiosInstance";

const iconMap = {
    contact_created: <Plus className="h-4 w-4 text-green-500" />,
    contact_deleted: <Trash2 className="h-4 w-4 text-red-500" />,
    contact_updated: <Pencil className="h-4 w-4 text-yellow-500" />,
    bulk_delete: <ListChecks className="h-4 w-4 text-purple-500" />,
    bulk_import: <ListChecks className="h-4 w-4 text-blue-500" />,
    user_login: <LogIn className="h-4 w-4 text-blue-500" />,
    user_logout: <LogIn className="h-4 w-4 text-gray-500" />
};

function Activities() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["activities"],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosInstance.get(`/activities?page=${pageParam}&limit=20`);
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.activities.length === 20 ? allPages.length + 1 : undefined;
        },
    });
    // console.log("Activities data:", data);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <ModeToggle />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Activities</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-light dark:bg-dark overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-6">
                        <Loader2 className="animate-spin mx-auto" />
                        <p className="mt-2 text-muted-foreground">Loading activities...</p>
                    </div>
                ) : isError ? (
                    <div className="text-red-500 text-center">Error: {error.message}</div>
                ) : (
                    <>
                        {data?.pages.map((page, index) => (
                            <div key={index} className="space-y-4">
                                {page.activities.map((activity) => (
                                    <Card key={activity._id} className="shadow-sm">
                                        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                                            <div className="flex items-center gap-2">
                                                {iconMap[activity.action] || <ListChecks className="h-4 w-4 text-gray-400" />}
                                                <p className="text-base font-semibold">
                                                    {activity.entityName || activity.details?.contactName || "System"}{" "}
                                                    <span className="font-normal text-muted-foreground">
                                                        {activity.action.replace("_", " ")}
                                                    </span>
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="capitalize text-xs">
                                                {activity.entityType}
                                            </Badge>
                                        </CardHeader>

                                        <CardContent className="space-y-2 text-sm">
                                            {activity.details?.email && (
                                                <p>
                                                    <span className="text-muted-foreground">Email:</span> {activity.details.email}
                                                </p>
                                            )}

                                            {activity.details?.company && (
                                                <p>
                                                    <span className="text-muted-foreground">Company ID:</span> {activity.details.company}
                                                </p>
                                            )}

                                            {activity.details?.changes && (
                                                <div className="pt-1">
                                                    <p className="text-sm font-medium mb-1">Changes:</p>
                                                    <ul className="ml-4 list-disc text-xs space-y-1">
                                                        {Object.entries(activity.details.changes).map(([field, val]) => (
                                                            <li key={field}>
                                                                <span className="capitalize">{field}</span>:{" "}
                                                                <span className="text-red-500 line-through">{val.from}</span> →{" "}
                                                                <span className="text-green-600">{val.to}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {activity.action === "user_logout" && (
                                                <div className="space-y-1">
                                                    <p className="text-muted-foreground text-sm">
                                                        User <span className="font-medium">{activity.entityName}</span> logged out.
                                                    </p>
                                                    {activity.details?.email && (
                                                        <p className="text-sm text-muted-foreground">Email: {activity.details.email}</p>
                                                    )}
                                                </div>
                                            )}
                                            {activity.action === "user_login" && (
                                                <div className="space-y-1">
                                                    <p className="text-muted-foreground text-sm">
                                                        User <span className="font-medium">{activity.entityName}</span> logged in.
                                                    </p>
                                                    {/* {activity.details?.email && (
                                                        <p className="text-sm text-muted-foreground">Email: {activity.details.email}</p>
                                                    )} */}
                                                </div>
                                            )}

                                            {(activity.action === "bulk_import") && (
                                                <div className="space-y-1 pt-1 text-sm">
                                                    <p>
                                                        <span className="text-muted-foreground">Successful Imports:</span> {activity.details.successCount}
                                                    </p>
                                                    <p>
                                                        <span className="text-muted-foreground">Failed Imports:</span> {activity.details.failureCount}
                                                    </p>

                                                    {activity.details.failedReasons?.length > 0 && (
                                                        <>
                                                            <p className="text-muted-foreground pt-1">Failure Reasons:</p>
                                                            <ul className="ml-4 list-disc text-xs text-red-600">
                                                                {activity.details.failedReasons.map((fail, idx) => (
                                                                    <li key={idx}>
                                                                        {fail?.row?.email || "Unknown"} — {fail?.reason}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {(activity.action === "bulk_delete") && activity.details?.count && (
                                                <div className="space-y-1 pt-1 text-sm">
                                                    <p>
                                                        <span className="text-muted-foreground">Total Contacts Deleted:</span> {activity.details.count}
                                                    </p>
                                                    <p className="text-muted-foreground">Names:</p>
                                                    <ul className="ml-4 list-disc text-sm">
                                                        {activity.details.names?.map((name, idx) => (
                                                            <li key={idx}>{name}</li>
                                                        ))}
                                                    </ul>
                                                    <p className="text-muted-foreground">IDs:</p>
                                                    <ul className="ml-4 list-disc font-mono text-xs text-muted-foreground">
                                                        {activity.details.ids?.map((id, idx) => (
                                                            <li key={idx}>{id}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}



                                            <div className="text-right">
                                                <Badge variant="secondary" className="text-xs">
                                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                                </Badge>
                                            </div>
                                        </CardContent>

                                    </Card>
                                ))}
                            </div>
                        ))}

                        {hasNextPage && (
                            <div className="text-center mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? "Loading..." : "Load More"}
                                </Button>
                            </div>
                        )}

                        {!hasNextPage && (
                            <p className="text-center text-muted-foreground text-sm">
                                You&apos;ve reached the end.
                            </p>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Activities;
