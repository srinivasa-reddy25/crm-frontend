'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { SidebarInset } from '@/components/ui/sidebar';


import { UserProvider } from '@/components/providers/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/services/profileApi';


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

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Failed to load user profile</div>;


    return (
        <UserProvider value={{ userData: userData.user ,isLoading, isError, error }}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </UserProvider>
    );
}
