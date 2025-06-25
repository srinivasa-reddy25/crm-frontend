'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { SidebarInset } from '@/components/ui/sidebar';


import { UserProvider } from '@/components/providers/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/services/profileApi';


import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

import { usePathname } from 'next/navigation';





import { NavUser } from "@/components/nav-user"

export default function AppLayout({ children }) {
    const {
        data: userData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
    });
    const pathname = usePathname();

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);




    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Failed to load user profile</div>;


    const actualUser = {
        user: {
            name: userData.user?.displayName,
            email: userData.user.email,
            avatar: userData.user.profilePicture,
        }
    }

    return (

        <UserProvider value={{ userData: userData.user, isLoading, isError, error }}>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4 w-full justify-between" >
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{capitalize(pathname.slice(1,))}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                                <ModeToggle />
                            </div>
                            {/* <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" /> */}
                            <div className="flex items-center gap-2">
                                <NavUser user={actualUser.user} />
                            </div>
                        </div>
                    </header>
                    {children}
                </div>
            </SidebarProvider>
        </UserProvider>
    );
}
