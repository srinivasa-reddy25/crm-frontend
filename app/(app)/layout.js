'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserProvider } from '@/components/providers/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/services/profileApi';
import { ModeToggle } from '@/components/mode-toggle';
import { usePathname } from 'next/navigation';

const titles = { dashboard: 'Dashboard', contacts: 'Contacts', activities: 'Activities', tags: 'Tags', chat: 'AI Assistant', profile: 'Profile' };
export default function AppLayout({ children }) {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['userProfile'], queryFn: getUserProfile });
  const pathname = usePathname();
  const section = pathname.split('/')[1];
  const title = section === 'contacts' && pathname.split('/')[2] ? 'Contact details' : titles[section] || 'Dashboard';
  if (isLoading) return <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground" role="status">Loading your workspace…</div>;
  if (isError) return <div className="p-8 text-sm text-destructive" role="alert">Could not load your profile. Please refresh to try again.</div>;
  return <UserProvider value={{ userData: data.user, isLoading, isError, error }}>
    <SidebarProvider style={{ '--sidebar-width': '13.5rem', '--sidebar-width-icon': '3.5rem' }}>
      <AppSidebar />
      <div className="workspace-shell ml-14 flex min-w-0 flex-1 flex-col md:ml-0">
        <header className="workspace-header flex h-12 shrink-0 items-center justify-between px-4 sm:px-6">
          <h1 className="text-sm font-medium tracking-tight">{title}</h1><ModeToggle />
        </header>
        <main className="crm-content flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </SidebarProvider>
  </UserProvider>;
}
