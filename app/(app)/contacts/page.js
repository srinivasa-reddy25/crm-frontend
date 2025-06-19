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
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, ListIcon, LayoutGridIcon, Filter, SquarePen, Trash2, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/ui/pagination"

import { AddContactDialog } from "@/components/AddContactDialog"

import { Card } from "@/components/ui/card"

import { useState } from "react";

import { useRouter } from "next/navigation"


import { ImportCsvDialog } from "@/components/ImportCsvDialog"

import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';


import { getContacts } from '@/services/contactsApi';
import { deleteContact } from '@/services/contactsApi'
import { bulkDeleteContacts } from "@/services/contactsApi"
import { getTags } from "@/services/tagsApi"

import { toast } from "sonner";



function Contact() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState("table");
    // const [contacts, setContacts] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [selectedContactIds, setSelectedContactIds] = useState([]);
    // const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const queryClient = useQueryClient();




    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)


    const {
        data: tagsData,
        isLoading: isTagsLoading,
        isError: isTagsError,
        error: tagsError,
    } = useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
    });

    const availableTags = tagsData?.tags || [];


    const {
        data: contactData,
        isLoading: isContactsLoading,
        isError: isContactsError,
        error: contactsError,
    } = useQuery({
        queryKey: ['contacts', { selectedTags }],
        queryFn: () => {
            if (selectedTags.length === 0 || selectedTags.length === availableTags.length) {
                return getContacts();
            }

            if (selectedTags.length === 1) {
                return getContacts({ tag: selectedTags[0] });
            }

            const matchType = 'all';
            return getContacts({ tags: selectedTags.join(','), matchType });
        },
        enabled: !!availableTags.length,
    });
    const contacts = contactData?.contacts || [];


    console.log("Contacts Data:", contacts);
    const fallbackContacts = [
        {
            id: "X7d93kA8sLp0wErTgqVn91UyZbNmKj2L",
            initials: "JS",
            name: "John Smith",
            email: "john.smith@techcorp.com",
            company: "TechCorp",
            tags: ["Hot Lead", "VIP"],
            tagColors: ["destructive", "secondary"],
            lastInteraction: "2 days ago",
        },
    ];
    const displayContacts = isContactsError ? fallbackContacts : contacts;
    console.log("Contacts:", displayContacts);



    const { mutate: deleteContactMutate, isPending: isDeleting } = useMutation({
        mutationFn: deleteContact,
        onSuccess: (_, contactId) => {
            alert('Contact deleted successfully!');
            queryClient.invalidateQueries(['contacts']);
        },
        onError: (error) => {
            console.error('Failed to delete contact:', error);
            alert('Failed to delete contact. Please try again later.');
        },
    });

    const { mutate: bulkDeleteMutate, isPending: isBulkDeleting } = useMutation({
        mutationFn: bulkDeleteContacts,
        onSuccess: () => {
            alert('Contacts deleted successfully!');
            queryClient.invalidateQueries(['contacts']);
            setSelectedContactIds([]);
        },
        onError: (error) => {
            console.error('Failed to delete contacts:', error);
            alert('Failed to delete contacts. Please try again later.');
        }
    });



    const getInitials = (name) =>
        name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : ''

    const onClikingContactDetails = (contactId) => {
        console.log("Contact clicked", contactId);
        router.push(`/contacts/${contactId}`);
    }

    const handleDeleteClick = (contactId) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            deleteContactMutate(contactId);
        }
    };

    const handleBulkDelete = () => {
        if (selectedContactIds.length === 0) {
            alert('No contacts selected for deletion.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedContactIds.length} contact(s)?`)) {
            bulkDeleteMutate(selectedContactIds);
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;

        // Convert to different time units
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        // Choose the appropriate unit
        if (diffSeconds < 60) {
            return diffSeconds === 1 ? "1 second ago" : `${diffSeconds} seconds ago`;
        } else if (diffMinutes < 60) {
            return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
        } else if (diffHours < 24) {
            return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
        } else {
            return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
        }
    };

    const handleTagFilter = (tagId) => {
        let newSelectedTags;

        if (tagId === 'all') {
            if (selectedTags.length === availableTags.length) {
                // If all tags are selected, clear the selection
                newSelectedTags = [];
            }
            else {
                // If 'All Contacts' is selected, select all available tags
                newSelectedTags = availableTags.map(tag => tag._id);
            }
        } else if (selectedTags.includes(tagId)) {
            // If tag is already selected, remove it
            newSelectedTags = selectedTags.filter(t => t !== tagId);
        } else {
            // If tag is not selected, add it to selected tags
            newSelectedTags = [...selectedTags, tagId];
        }

        // Update the selected tags state
        setSelectedTags(newSelectedTags);
        console.log("Selected Tags:", newSelectedTags);

        // Apply filtering based on the new selected tags
        // applyTagFilters(newSelectedTags);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo(0, 0)
    }



    if (isContactsLoading) {
        return <p className="text-muted-foreground">Loading contacts...</p>;
    }
    if (isContactsError) {
        return <p className="text-red-500">Error loading contacts: {contactsError}</p>;
    }




    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Contacts</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <ModeToggle />
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
                        <p className="text-muted-foreground">Manage your contact database</p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-1 items-center gap-2">
                        <Input type="text" placeholder="Search contacts..." className="w-[300px]" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filter by tag
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {/* Filter options go here */}
                                <DropdownMenuItem onClick={() => handleTagFilter('all')}>
                                    All Contacts
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Map through your tags */}
                                {availableTags.map((tag, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => handleTagFilter(tag._id)}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: tag.color || '#888888' }}
                                        />
                                        {tag.name}
                                        {selectedTags.includes(tag._id) && (
                                            <Check className="ml-auto h-4 w-4 text-green-500" />
                                        )}
                                    </DropdownMenuItem>
                                ))}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                        <ImportCsvDialog />
                        {/* <Button variant="outline">Import CSV</Button> */}
                        <div className="p-6">
                            <AddContactDialog />
                        </div>
                        <Button variant={viewMode === "table" ? "outline" : "ghost"} size="icon" onClick={() => setViewMode("table")}>
                            <ListIcon className="w-4 h-4" />
                        </Button>
                        <Button variant={viewMode === "grid" ? "outline" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
                            <LayoutGridIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                {
                    isContactsLoading && <p className="text-muted-foreground">Loading contacts...</p>
                }
                {selectedContactIds.length > 0 && (
                    <div className="border rounded-md p-4 flex justify-between items-center bg-muted">
                        <div className="font-medium">
                            {selectedContactIds.length} contact{selectedContactIds.length > 1 ? 's' : ''} selected
                        </div>
                        <div className="flex gap-2">
                            {/* <Button variant="secondary" onClick={() => console.log("Tag Selected Clicked")}>
                                Tag Selected
                            </Button> */}
                            <Button
                                variant="destructive"
                                onClick={() => handleBulkDelete(selectedContactIds)}
                            >
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                )}


                {viewMode === "table" ? (
                    <div className="rounded-sm border bg-background text-foreground shadow-sm">
                        <Table className={"border-separate border-spacing-y-2"}>
                            <TableHeader>
                                <TableRow className="bg-muted">
                                    <TableHead className="w-10">
                                        <Checkbox
                                            className="cursor-pointer"
                                            checked={selectedContactIds.length === contacts.length}
                                            onCheckedChange={(checked) => {
                                                setSelectedContactIds(checked ? contacts.map((c) => c._id) : []);
                                            }}
                                        />
                                    </TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Last Interaction</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayContacts.map((contact, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedContactIds.includes(contact._id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedContactIds((prev) =>
                                                        checked
                                                            ? [...prev, contact._id]
                                                            : prev.filter((id) => id !== contact._id)
                                                    );
                                                }}
                                                className={"cursor-pointer"}
                                            /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onClikingContactDetails(contact._id)}>
                                                <Avatar>
                                                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{contact.name}</div>
                                                    <div className="text-sm text-muted-foreground">{contact.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell >
                                            {contact.company ? contact.company.name : '--'}
                                        </TableCell>
                                        <TableCell className="flex gap-1">
                                            {contact.tags.map((tag, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="outline"
                                                    style={{
                                                        borderColor: tag.color || '#888888',
                                                        color: tag.color || '#888888'
                                                    }}
                                                >
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell>{getTimeAgo(contact.updatedAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/contacts/${contact._id}?isEditMode=true`)}>
                                                        <SquarePen /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(contact._id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="text-red-600" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                ) :
                    (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {displayContacts.map((contact, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedContactIds.includes(contact._id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedContactIds((prev) =>
                                                        checked
                                                            ? [...prev, contact._id]
                                                            : prev.filter((id) => id !== contact._id)
                                                    );
                                                }}
                                                className={"cursor-pointer"}
                                            />
                                            <Avatar>
                                                <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="cursor-pointer transition-colors p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:bg-opacity-70" onClick={() => onClikingContactDetails(contact._id)}>
                                                <div className="font-semibold">{contact.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {contact.email}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {contact.company ? contact.company.name : '--'}
                                                </div>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/contacts/${contact._id}?isEditMode=true`)}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500"
                                                    onClick={() => handleDeleteClick(contact._id)}
                                                >Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {contact.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline"
                                                style={{
                                                    borderColor: tag.color || '#888888',
                                                    color: tag.color || '#888888'
                                                }}>{tag.name}</Badge>
                                        ))}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        Last interaction: {getTimeAgo(contact.updatedAt)}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                }

                {/* <div className="flex justify-end mt-4">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="border rounded px-2 py-1"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                /> */}
            </div>
        </>
    )
}





export default Contact
