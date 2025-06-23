"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"


import { AddTagsDialog } from "@/components/AddTagsDialog"
import { EditTagDialog } from "@/components/EditTagDialog"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTags } from "@/services/tagsApi"
import { updateTag } from "@/services/tagsApi"
import { deleteTag } from "@/services/tagsApi"

import { toast } from "sonner"


const Colors = {
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    pink: 'bg-pink-100 text-pink-800',
    gray: 'bg-gray-100 text-gray-800',
    "#gray": "bg-gray-100 text-gray-800",
    cyan: 'bg-cyan-100 text-cyan-800',
    teal: 'bg-teal-100 text-teal-800',
    brown: 'bg-brown-100 text-brown-800',
}


export default function Tags() {

    const queryClient = useQueryClient();


    const {
        data: tagsData,
        isLoading: isTagsLoading,
        isError: isTagsError,
        error: tagsError,
    } = useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
    });

    const Tags = tagsData?.tags || [];

    const { mutate: deleteTagMutate, isPending: isDeletingTag } = useMutation({
        mutationFn: (id) => deleteTag(id),
        onSuccess: () => {
            toast.success('Tag deleted successfully!');
            queryClient.invalidateQueries(['tags']); // refetch tag list
        },
        onError: (error) => {
            console.error('Error deleting tag:', error);
            toast.error(
                error?.response?.data?.message
                    ? `${error.response.data.message} (${error.response.data.contactCount || 0} contacts)`
                    : 'Failed to delete tag'
            );

        },
    });

    const { mutate: updateTagMutate, isPending } = useMutation({
        mutationFn: ({ id, data }) => updateTag(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries(['tags']);

            const previousTags = queryClient.getQueryData(['tags']);

            queryClient.setQueryData(['tags'], (old) => ({
                ...old,
                tags: old.tags.map(tag => tag._id === id ? { ...tag, ...data } : tag)
            }));

            return { previousTags };
        },
        onSuccess: (res) => {
            toast.success('Tag updated successfully!');
            queryClient.invalidateQueries(['tags']); // ⬅️ refetch tag list from server
        },
        onError: (err) => {
            console.error('Update failed:', err);
            toast.error('Failed to update tag');
        },
        onSuccess: () => {
            toast.success('Tag updated!');
        },
        onSettled: () => {
            queryClient.invalidateQueries(['tags']);
        },
    });


    const handleOnclikingDeleteBtn = (tag) => {
        if (window.confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
            deleteTagMutate(tag._id);
        }
    };

    const handleTagUpdated = (updatedTag) => {
        updateTagMutate({ id: updatedTag._id, data: updatedTag });
    };



    if (isTagsLoading) return <p>Loading tags...</p>;
    if (isTagsError) return <p>Error loading tags: {tagsError?.message}</p>;



    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tags</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <ModeToggle />
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Tags</h2>
                        <p className="text-muted-foreground">Organize your contacts with tags</p>
                    </div>
                    <AddTagsDialog
                        onTagsAdded={(tags) => console.log('Tags added:', tags)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Tags.map((tag, i) => (
                        <Card key={i}>
                            <CardContent className="flex flex-col gap-2 p-4">
                                <div className="flex items-center justify-between">
                                    <Badge className={`${Colors[tag.color]} text-sm px-2 py-1 rounded-full font-medium`}>
                                        {tag.name}
                                    </Badge>
                                    <div className="flex gap-2">
                                        <EditTagDialog
                                            tag={tag}
                                            onTagUpdated={handleTagUpdated}
                                        />
                                        <Button className={"cursor-pointer"} variant="ghost" size="icon" onClick={() => handleOnclikingDeleteBtn(tag)}>
                                            <Trash2
                                                className="w-4 h-4 text-red-500 "
                                            />
                                            {/* {isDeletingTag ? 'Deleting...' : 'Delete'} */}
                                        </Button>

                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{tag.usageCount} contacts</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}
