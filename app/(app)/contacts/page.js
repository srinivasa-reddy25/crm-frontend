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

import Cookies from "js-cookie"
import { Card } from "@/components/ui/card"

import { useState } from "react";

import { useRouter } from "next/navigation"
import { useEffect } from "react";

import { ImportCsvDialog } from "@/components/ImportCsvDialog"

import { deleteContact } from '@/app/utilities/deletecontact'
import { deteleBulkContacts } from "@/app/utilities/deletecontact"


const contacts = [
    {
        id: "X7d93kA8sLp0wErTgqVn91UyZbNmKj2L",
        initials: "JS",
        name: "John Smith",
        email: "john.smith@techcorp.com",
        company: "TechCorp",
        tags: ["Hot Lead", "VIP"],
        tagColors: ["destructive", "secondary"],
        lastInteraction: "2 days ago"
    },
    {
        id: "Lk7Tq29VmzXnO8RbPd5cYu9AaJrM6s1F",
        initials: "SJ",
        name: "Sarah Johnson",
        email: "sarah.j@startupxyz.com",
        company: "StartupXYZ",
        tags: ["Customer", "Follow-up"],
        tagColors: ["success", "warning"],
        lastInteraction: "1 week ago"
    },
    {
        id: "A9fDs28PbK0zVeLtXqMnR7HwUcGjL3oK",
        initials: "MD",
        name: "Mike Davis",
        email: "mike.davis@globalinc.com",
        company: "GlobalInc",
        tags: ["Prospect"],
        tagColors: ["info"],
        lastInteraction: "3 days ago"
    },
    {
        id: "YpF38Wd7lQmTuVzXoNKr92HaMbJkLt0E",
        initials: "EW",
        name: "Emily Wilson",
        email: "emily.wilson@localbiz.com",
        company: "LocalBiz",
        tags: ["Customer", "VIP"],
        tagColors: ["success", "secondary"],
        lastInteraction: "5 days ago"
    }
];





function Contact() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState("table");
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContactIds, setSelectedContactIds] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);



    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)


    const getInitials = (name) =>
        name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : ''


    const onClikingContactDetails = (contactId) => {
        console.log("Contact clicked", contactId);
        router.push(`/contacts/${contactId}`);
    }


    const handleDeleteClick = async (contactId) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            const result = await deleteContact(contactId);
            console.log("Delete result:", result);
            if (result) {
                alert('Contact deleted successfully!');
                setContacts(prevContacts => prevContacts.filter(contact => contact._id !== contactId));
            }
            else {
                alert('Failed to delete contact. Please try again later.');
            }
        }
    }

    const handleBulkDelete = async () => {
        if (selectedContactIds.length === 0) {
            alert('No contacts selected for deletion.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedContactIds.length} contact(s)?`)) {
            const result = await deteleBulkContacts(selectedContactIds);
            if (result) {
                alert('Contacts deleted successfully!');
                setContacts(prevContacts => prevContacts.filter(contact => !selectedContactIds.includes(contact._id)));
                setSelectedContactIds([]);
            } else {
                alert('Failed to delete contacts. Please try again later.');
            }
        }
    }

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

    const onClickingEditonContactDetails = (contactId) => {
        // console.log("Edit Contact clicked", contactId);
        router.push(`/contacts/${contactId}?isEditMode=true`);
    }

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


    const fetchContacts = async () => {
        const token = Cookies.get('auth');
        try {
            setIsLoading(true);
            // Replace with your actual API endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Contacts:", data.contacts);
            setContacts(data.contacts);
            setError(null);
        } catch (err) {
            console.error('Error fetching contacts:', err);
            setError('Failed to load contacts. Please try again later.');
            // Fallback to demo data if API fails
            setContacts([
                {
                    id: "X7d93kA8sLp0wErTgqVn91UyZbNmKj2L",
                    initials: "JS",
                    name: "John Smith",
                    email: "john.smith@techcorp.com",
                    company: "TechCorp",
                    tags: ["Hot Lead", "VIP"],
                    tagColors: ["destructive", "secondary"],
                    lastInteraction: "2 days ago"
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page)
        // Optionally scroll to top of list
        window.scrollTo(0, 0)
    }


    useEffect(() => {
        const token = Cookies.get("auth")

        const filterByTag = async (tagId) => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts?tag=${tagId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched Contacts:", data.contacts);
                setContacts(data.contacts);
                setError(null);

            } catch (error) {
                console.error('Error fetching contacts:', error);
                setError('Failed to load contacts by tag. Please try again later.');

            }
            finally {
                setIsLoading(false);
            }

            // Handle response
        }

        const filterByMultipleTags = async (tagIds, matchAll = false) => {
            try {
                setIsLoading(true);

                const tagParams = tagIds.join(',');
                const matchType = matchAll ? 'all' : 'any';

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts?tags=${tagParams}&matchType=${matchType}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched Contacts:", data.contacts);
                setContacts(data.contacts);
                setError(null);
            } catch (err) {
                console.error('Error fetching contacts:', err);
                setError('Failed to load contacts by tags . Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }

        if (selectedTags.length === 1) {
            filterByTag(selectedTags[0])
        }
        else if (selectedTags.length === 0 || selectedTags.length === availableTags.length) {
            fetchContacts();
        }
        else {
            filterByMultipleTags(selectedTags, true)
        }


    }, [selectedTags])


    useEffect(() => {

        fetchContacts();

        const fetchTags = async () => {
            console.log('Fetching tags...');
            try {
                // setIsLoadingTags(true);
                // setTagError(null);

                const token = Cookies.get('auth');

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tags');
                }

                const data = await response.json();
                // console.log('Fetched tags:', data.tags);
                setAvailableTags(data.tags || []);
                console.log("Available Tags:", data.tags);
            } catch (error) {
                console.error('Error fetching tags:', error);
                // setTagError('Could not load tags');
            } finally {
                // setIsLoadingTags(false);
            }
        }
        fetchTags();

    }, []);






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
                    isLoading && <p className="text-muted-foreground">Loading contacts...</p>
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
                                {contacts.map((contact, index) => (
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
                                                    <DropdownMenuItem onClick={() => onClickingEditonContactDetails(contact._id)}>
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
                            {contacts.map((contact, index) => (
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
                                                    onClick={() => onClickingEditonContactDetails(contact._id)}
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
