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

export default function DashboardPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <ModeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">Recent Contacts</h2>
            <p className="text-muted-foreground">No recent contacts</p>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">Upcoming Tasks</h2>
            <p className="text-muted-foreground">No upcoming tasks</p>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">Activity Summary</h2>
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        </div>
        <div className="bg-muted/50 min-h-[300px] flex-1 rounded-xl p-4">
          <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
          <p className="text-muted-foreground">View your CRM performance metrics and analytics.</p>
        </div>
      </div>
    </>
  )
}
