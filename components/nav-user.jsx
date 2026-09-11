'use client';
import { useContext } from 'react';
import Link from 'next/link';
import { ChevronUp, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import AuthContext from './providers/AuthProvider';

export function NavUser({ user }) {
  const { isMobile, state, setOpenMobile } = useSidebar();
  const { logout } = useContext(AuthContext);
  const collapsed = state === 'collapsed' && !isMobile;
  const initials = user.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return <SidebarMenu><SidebarMenuItem><DropdownMenu>
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton size="lg" aria-label="Account menu" tooltip={user.name} className="h-14 rounded-lg data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:mx-auto">
        <Avatar className="size-8 shrink-0 rounded-full"><AvatarImage src={user.avatar} alt="" /><AvatarFallback className="bg-muted text-xs font-medium text-foreground">{initials}</AvatarFallback></Avatar>
        <div className="grid min-w-0 flex-1 gap-1 text-left text-sm leading-tight"><span className="truncate font-medium">{user.name}</span><span className="truncate text-xs text-muted-foreground">{user.email}</span></div>
        <ChevronUp className="ml-auto size-4 shrink-0 text-muted-foreground" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent side={collapsed ? 'right' : 'top'} align="start" sideOffset={8} className="min-w-0 rounded-xl p-1.5 shadow-lg" style={{ width: collapsed ? '14rem' : 'var(--radix-dropdown-menu-trigger-width)' }}>
      <DropdownMenuLabel className="min-w-0 px-2 py-2.5"><p className="truncate text-sm font-medium">{user.name}</p><p className="mt-1 truncate text-xs font-normal text-muted-foreground" title={user.email}>{user.email}</p></DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="h-10 rounded-md"><Link href="/profile" onClick={() => isMobile && setOpenMobile(false)}><User className="size-4" />Profile</Link></DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout} className="h-10 rounded-md"><LogOut className="size-4" />Log out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu></SidebarMenuItem></SidebarMenu>;
}
