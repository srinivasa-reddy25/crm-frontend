"use client"
import { WorkspaceSkeleton } from '@/components/workspace-skeleton';
import { tagColor } from '@/lib/tag-colors';

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"


import { AddTagsDialog } from "@/components/AddTagsDialog"
import { EditTagDialog } from "@/components/EditTagDialog"
import ConfirmDialog from "@/components/ConfirmDialog"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTags } from "@/services/tagsApi"
import { updateTag } from "@/services/tagsApi"
import { deleteTag } from "@/services/tagsApi"

import { toast } from "sonner"


export default function Tags() {

    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");


    const {
        data: tagsData,
        isLoading: isTagsLoading,
        isError: isTagsError,
        error: tagsError,
    } = useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
    });

    console.log('Tags data:', tagsData);

    const Tags = tagsData?.tags || [];
    const visibleTags = Tags.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));

    const { mutate: deleteTagMutate, isPending: isDeletingTag } = useMutation({
        mutationFn: (id) => deleteTag(id),
        onSuccess: () => {
            toast.success('Tag deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['tags'] }); // refetch tag list
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
            queryClient.invalidateQueries({ queryKey: ['tags'] }); // ⬅️ refetch tag list from server
        },
        onError: (err, variables, context) => {
            if (context?.previousTags) queryClient.setQueryData(["tags"], context.previousTags);
            console.error('Update failed:', err);
            toast.error('Failed to update tag');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });


    // const handleOnclikingDeleteBtn = (tag) => {
    //     if (window.confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
    //         deleteTagMutate(tag._id);
    //     }
    // };

    const handleTagUpdated = (updatedTag) => {
        updateTagMutate({ id: updatedTag._id, data: updatedTag });
    };



    if (isTagsLoading) return <WorkspaceSkeleton variant="cards" label="Loading tags" />;
    if (isTagsError) return <p>Error loading tags: {tagsError?.message}</p>;



    return <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><Input aria-label="Search tags" placeholder="Search tags…" className="w-48 sm:w-64" value={search} onChange={event => setSearch(event.target.value)} /><span className="text-xs text-muted-foreground">{Tags.length} tags</span></div>
        <AddTagsDialog />
      </div>
      {visibleTags.length ? <div className="tag-library">
        {visibleTags.map(tag => <Card key={tag._id} className="tag-library-card">
          <CardContent className="tag-library-content">
            <span className="tag-color-tile" style={{ '--tag-color': tagColor(tag.color) }} aria-hidden="true"><span /></span>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium" title={tag.name}>{tag.name}</p><p className="mt-1 text-xs text-muted-foreground">{tag.usageCount || 0} {tag.usageCount === 1 ? 'contact' : 'contacts'}</p></div>
            <div className="flex items-center gap-0.5"><EditTagDialog tag={tag} onTagUpdated={handleTagUpdated} /><ConfirmDialog trigger={<Button variant="ghost" size="icon" aria-label={`Delete ${tag.name}`} disabled={isDeletingTag}><Trash2 className="size-4" /></Button>} title={`Delete tag "${tag.name}"?`} onConfirm={() => deleteTagMutate(tag._id)} /></div>
          </CardContent>
        </Card>)}
      </div> : <div className="workspace-empty">{search ? 'No tags match your search.' : 'Create your first tag to organize contacts.'}</div>}
    </div>;
}
