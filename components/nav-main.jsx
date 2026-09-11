'use client';
import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavMain({ items }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  return <SidebarGroup className="px-2"><SidebarMenu className="gap-1">
    {items.map((item) => {
      const active = pathname === item.url || pathname.startsWith(item.url + '/');
      return <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={active} tooltip={item.title} className="h-10 rounded-md px-3 font-medium text-muted-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground group-data-[collapsible=icon]:mx-auto">
          <Link href={item.url} aria-current={active ? 'page' : undefined} onClick={() => isMobile && setOpenMobile(false)}>
            <item.icon className="size-4 shrink-0" /><span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>;
    })}
  </SidebarMenu></SidebarGroup>;
}
