'use client';

import { LayoutDashboard, NotebookTabs, Activity, Tags, Bot, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { useUser } from './providers/UserContext';

const navigation = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Contacts', url: '/contacts', icon: NotebookTabs },
  { title: 'Activities', url: '/activities', icon: Activity },
  { title: 'Tags', url: '/tags', icon: Tags },
  { title: 'AI Assistant', url: '/chat', icon: Bot },
];

export function AppSidebar(props) {
  const { userData } = useUser();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed' && !isMobile;
  const user = { name: userData?.displayName || 'Your account', email: userData?.email || '', avatar: userData?.profilePicture };

  return <>
    {isMobile && <aside className="fixed inset-y-0 left-0 z-20 flex w-14 justify-center border-r bg-sidebar pt-3" aria-label="Navigation rail">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Open sidebar"><BrandMark className="size-8" /></Button>
    </aside>}
    <Sidebar collapsible="icon" className="crm-sidebar" {...props}>
      <SidebarHeader className="h-16 justify-center px-3">
        {collapsed ? <div className="relative size-8 self-center">
          <BrandMark className="sidebar-brand size-8 transition-opacity" />
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Expand sidebar" title="Expand sidebar" className="sidebar-expand absolute inset-0 size-8 opacity-0 transition-opacity focus-visible:opacity-100"><PanelLeftOpen className="size-4" /></Button>
        </div> : <div className="flex min-w-0 items-center justify-between gap-2">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring" aria-label="MyCRM dashboard">
            <BrandMark className="size-8 shrink-0" /><span className="text-base font-semibold tracking-tight">MyCRM</span>
          </Link>
          <Button variant="ghost" size="icon" className="size-7 shrink-0 text-muted-foreground" onClick={toggleSidebar} aria-label="Collapse sidebar" title="Collapse sidebar"><PanelLeftClose className="size-4" /></Button>
        </div>}
      </SidebarHeader>
      <SidebarContent className="pt-3"><NavMain items={navigation} /></SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2"><NavUser user={user} /></SidebarFooter>
    </Sidebar>
  </>;
}
