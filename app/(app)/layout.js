import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }) {
    return (

        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* <div className='w-full flex items-center justify-between px-4 py-2 border-b h-16'>

                    </div> */}
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
