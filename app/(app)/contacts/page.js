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
import { MoreHorizontal, ListIcon, LayoutGridIcon, Filter, SquarePen, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { Card } from "@/components/ui/card"

import { useState } from "react";

import { useRouter } from "next/navigation"



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






    const onClikingContactDetails = () => {
        console.log("Contact clicked");
        router.push(`/contacts/${contacts[0].id}`);
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
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">Import CSV</Button>
                        <Button >Add Contact</Button>
                        <Button variant={viewMode === "table" ? "outline" : "ghost"} size="icon" onClick={() => setViewMode("table")}>
                            <ListIcon className="w-4 h-4" />
                        </Button>
                        <Button variant={viewMode === "grid" ? "outline" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
                            <LayoutGridIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {viewMode === "table" ? (
                    <div className="rounded-sm border bg-background text-foreground shadow-sm">
                        <Table className={"border-separate border-spacing-y-2"}>
                            <TableHeader>
                                <TableRow className="bg-muted">
                                    <TableHead className="w-10">
                                        <Checkbox />
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
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3 cursor-pointer" onClick={onClikingContactDetails}>
                                                <Avatar>
                                                    <AvatarFallback>{contact.initials}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{contact.name}</div>
                                                    <div className="text-sm text-muted-foreground">{contact.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{contact.company}</TableCell>
                                        <TableCell className="flex gap-1">
                                            {contact.tags.map((tag, i) => (
                                                <Badge key={i} variant={contact.tagColors[i] || "default"} >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell>{contact.lastInteraction}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => console.log("Edit clicked")}>
                                                        <SquarePen /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => console.log("Delete clicked")}
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
                                            <Checkbox />
                                            <Avatar>
                                                <AvatarFallback>{contact.initials}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold">{contact.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {contact.email}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {contact.company}
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
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {contact.tags.map((tag) => (
                                            <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        Last interaction: {contact.lastInteraction}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Contact
