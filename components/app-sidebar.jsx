"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  NotebookTabs,
  Activity,
  Tags,
  Bot,
} from "lucide-react"


import AuthContext from "@/components/providers/AuthProvider"
import { useContext } from "react"


import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


import { useUser } from "./providers/UserContext"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


// const crmNavigation = [
//   {
//     title: "Home", // Changed from Dashboard
//     url: "/",  // Root URL
//     icon: Home, // Use a home icon
//   },
//   {
//     title: "Dashboard", // Separate dashboard link
//     url: "/dashboard",
//     icon: PieChart,
//   },
//   {
//     title: "Contacts",
//     url: "/contacts",
//     icon: Users,
//   },
//   // Other navigation items...
// ];






export function AppSidebar({ ...props }) {

  const { user } = useContext(AuthContext);
  const {userData} = useUser();

  console.log("DBuser:", userData);
  // console.log("AppSidebar user:", user);

  const actualData = user ? {
    user: {
      name: userData.displayName,
      email: userData.email,
      avatar: userData.profilePicture,
    },
  } : {
    user: {
      name: "Guest",
      email: "",
      avatar: "",
    },
  }

  const navData = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: NotebookTabs,
    },
    {
      title: "Activities",
      url: "/activities",
      icon: Activity,
    },
    {
      title: "Tags",
      url: "/tags",
      icon: Tags,
    },
    {
      title: "AI Assistant",
      url: "/chat",
      icon: Bot,
    }
  ]



  // const { displayName, email, avatar } = user;
  // console.log("AppSidebar user:", user.UserImpl);
  // const User = {
  //   name: displayName || "User",
  //   email: email || "",
  //   avatar: avatar || "/avatars/default.jpg",
  // };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={actualData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
