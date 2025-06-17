"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function HomePage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <p className="text-muted-foreground">Start using your CRM system</p>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-muted-foreground">No recent activity</p>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">System Status</h2>
            <p className="text-muted-foreground">All systems operational</p>
          </div>
        </div>
        <div className="bg-muted/50 min-h-[300px] flex-1 rounded-xl p-4">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Your CRM System</h2>
          <p className="text-muted-foreground">This is your home page with key information at a glance. Use the sidebar to navigate to specific features.</p>
        </div>
      </div>
    </>
  )
}

