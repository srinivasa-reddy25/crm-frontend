'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Loader2, Plus, Trash2, Pencil, ListChecks, LogIn } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axiosInstance";



import CalendarDialog from "@/components/calenderDialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useRef, useEffect, useState } from "react";


const iconMap = {
    contact_created: <Plus className="h-4 w-4 text-foreground" />,
    contact_deleted: <Trash2 className="h-4 w-4 text-foreground" />,
    contact_updated: <Pencil className="h-4 w-4 text-foreground" />,
    bulk_delete: <ListChecks className="h-4 w-4 text-foreground" />,
    bulk_import: <ListChecks className="h-4 w-4 text-foreground" />,
    user_login: <LogIn className="h-4 w-4 text-foreground" />,
    user_logout: <LogIn className="h-4 w-4 text-muted-foreground" />
};

const actionLabels = { contact_created: "contact created", contact_deleted: "contact deleted", contact_updated: "contact updated", bulk_delete: "contacts deleted", bulk_import: "contacts imported", user_login: "signed in", user_logout: "signed out" };

function Activities() {
    const [selectedAction, setSelectedAction] = useState("all");
    const [dateRange, setDateRange] = useState();


    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["activities", selectedAction, dateRange],
        queryFn: async ({ pageParam = null }) => {
            const res = await axiosInstance.get('/activities', {
                params: {
                    limit: 10,
                    cursor: pageParam,
                    action: selectedAction === "all" ? undefined : selectedAction,
                    startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
                    endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
                },
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    });

    // console.log("Next cursor:", data?.pages[data.pages.length - 1]?.nextCursor);

    // console.log("Activities data:", data);





    // const loadMoreRef = useRef();

    // useEffect(() => {
    //     if (!hasNextPage || isFetchingNextPage) return;

    //     const observer = new IntersectionObserver((entries) => {
    //         if (entries[0].isIntersecting) {
    //             fetchNextPage();
    //         }
    //     });

    //     if (loadMoreRef.current) {
    //         observer.observe(loadMoreRef.current);
    //     }

    //     return () => {
    //         if (loadMoreRef.current) {
    //             observer.unobserve(loadMoreRef.current);
    //         }
    //     };
    // }, [hasNextPage, isFetchingNextPage, fetchNextPage]);




    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 bg-background">
                <div className="flex flex-wrap gap-2 items-center">

                    <CalendarDialog value={dateRange} onApply={setDateRange} />

                    <Select
                        value={selectedAction}
                        onValueChange={(value) => setSelectedAction(value)}
                    >
                        <SelectTrigger className="w-[180px] sm:w-[200px]">
                            <SelectValue placeholder="Filter by action" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" align="start" sideOffset={6}>
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="contact_created">Contact Created</SelectItem>
                            <SelectItem value="contact_deleted">Contact Deleted</SelectItem>
                            <SelectItem value="contact_updated">Contact Updated</SelectItem>
                            <SelectItem value="bulk_delete">Bulk Delete</SelectItem>
                            <SelectItem value="bulk_import">Bulk Import</SelectItem>
                            <SelectItem value="user_login">User Login</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    variant="ghost"
                    className="text-sm"
                    onClick={() => {
                        setSelectedAction("all");
                        setDateRange(undefined);
                    }}
                >
                    Clear Filters
                </Button>
            </div>

            {(selectedAction !== "all" || dateRange?.from) && (
                <div className="text-xs text-muted-foreground mb-3">
                    <span className="inline-block">
                        {selectedAction !== "all" && (
                            <>
                                Action: <strong className="capitalize">{selectedAction.replace("_", " ")}</strong>
                            </>
                        )}
                        {selectedAction !== "all" && dateRange?.from && " | "}
                        {dateRange?.from && (
                            <>
                                Date: <strong>{dateRange.from.toDateString()}</strong>
                                {dateRange.to && <> → <strong>{dateRange.to.toDateString()}</strong></>}
                            </>
                        )}
                    </span>
                </div>
            )}



            <div className="activity-feed flex flex-1 flex-col overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-6">
                        <Loader2 className="animate-spin mx-auto" />
                        <p className="mt-2 text-muted-foreground">Loading activities...</p>
                    </div>
                ) : isError ? (
                    <div className="text-foreground text-center">Error: {error.message}</div>
                ) : (
                    <>
                        {data?.pages.map((page, index) => (
                            <div key={index} className="activity-page">
                                {page.activities.map((activity) => (
                                    <Card key={activity._id} className="activity-row compact-activity">
                                        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className="activity-icon">{iconMap[activity.action] || <ListChecks className="h-4 w-4 text-muted-foreground" />}</span>
                                                <p className="text-sm font-medium">
                                                    {activity.entityName || activity.details?.contactName || "System"}{" "}
                                                    <span className="font-normal text-muted-foreground">
                                                        {actionLabels[activity.action] || activity.action.replaceAll("_", " ")}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0"><time className="text-xs text-muted-foreground" dateTime={activity.timestamp} title={new Date(activity.timestamp).toLocaleString()}>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</time><Badge variant="outline" className="capitalize text-xs">
                                                {activity.entityType}
                                            </Badge></div>
                                        </CardHeader>

                                        <CardContent className="space-y-1 text-sm">
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
                                                                <span className="text-foreground line-through">
                                                                    {Array.isArray(val.from) ? val.from.join(', ') : val.from}
                                                                </span>{" "}
                                                                →{" "}
                                                                <span className="text-foreground">
                                                                    {Array.isArray(val.to) ? val.to.join(', ') : val.to}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
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
                                                            <ul className="ml-4 list-disc text-xs text-foreground">
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
                        {/* {hasNextPage && (
                            <div ref={loadMoreRef} className="text-center mt-4">
                                <Loader2 className="animate-spin mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mt-1">Loading more...</p>
                            </div>
                        )} */}


                        {!hasNextPage && (
                            <p className="text-center text-muted-foreground text-xs py-4">
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
