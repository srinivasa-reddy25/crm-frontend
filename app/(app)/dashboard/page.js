"use client"


import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  UserPlus,
  Activity,
  Tags,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"

import { useQuery } from "@tanstack/react-query"

import { getDashboardSummary } from "@/services/dashboardApi"
import { getContactByCompany } from "@/services/dashboardApi"
import { getActivitiesTimeline } from "@/services/dashboardApi"
import { getTagDistribution } from "@/services/dashboardApi"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


import { useState } from "react"

// const metrics = [
//   {
//     label: "Total Contacts",
//     value: "1,234",
//     subtext: "Active contacts in database",
//     icon: <Users className="w-5 h-5 text-muted-foreground" />,
//     trend: "+12%",
//     trendDirection: "up",
//     color: "text-green-600"
//   },
//   {
//     label: "New This Week",
//     value: "45",
//     subtext: "New contacts added",
//     icon: <UserPlus className="w-5 h-5 text-muted-foreground" />,
//     trend: "+8%",
//     trendDirection: "up",
//     color: "text-green-600"
//   },
//   {
//     label: "Total Activities",
//     value: "2,567",
//     subtext: "All time activities",
//     icon: <Activity className="w-5 h-5 text-muted-foreground" />,
//     trend: "+15%",
//     trendDirection: "up",
//     color: "text-green-600"
//   },
//   {
//     label: "Active Tags",
//     value: "24",
//     subtext: "Tags in use",
//     icon: <Tags className="w-5 h-5 text-muted-foreground" />,
//     trend: "-2%",
//     trendDirection: "down",
//     color: "text-red-500"
//   }
// ]

// const contactsByCompany = [
//   { name: "Acme Inc.", count: 120 },
//   { name: "Globex", count: 98 },
//   { name: "Umbrella", count: 87 },
//   { name: "Initech", count: 75 },
//   { name: "Soylent", count: 60 }
// ]

// const activitiesTimeline = [
//   { date: "Jun 1", count: 10 },
//   { date: "Jun 2", count: 14 },
//   { date: "Jun 3", count: 12 },
//   { date: "Jun 4", count: 18 },
//   { date: "Jun 5", count: 20 },
//   { date: "Jun 6", count: 16 },
//   { date: "Jun 7", count: 22 }
// ]

// const tagDistribution = [
//   { name: "Prospect", value: 45 },
//   { name: "Customer", value: 30 },
//   { name: "Lead", value: 15 },
//   { name: "Inactive", value: 10 }
// ]

const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"]






export default function DashboardPage() {


  const [searchTerm, setSearchTerm] = useState("");


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => getDashboardSummary(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });

  const { data: contactsByCompany } = useQuery({
    queryKey: ["contacts-by-company"],
    queryFn: () => getContactByCompany(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });

  const { data: activitiesTimeline } = useQuery({
    queryKey: ["activities-timeline"],
    queryFn: () => getActivitiesTimeline(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });

  const { data: tagDistribution } = useQuery({
    queryKey: ["tag-distribution"],
    queryFn: () => getTagDistribution(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });

  console.log("Tag distribution data:", tagDistribution);


  const handleSearchInput = (e) => {
    const searchTerm = e.target.value;

    console.log("Search term:", searchTerm);
    setSearchTerm(searchTerm);
  };


  // console.log("Activities timeline data:", activitiesTimeline);


  // console.log("Contacts by company data:", contactsByCompany);


  // console.log("Dashboard data:", data);

  const metrics = [
    {
      label: "Total Contacts",
      value: data?.totalContacts?.value || 0,
      subtext: "Active contacts in database",
      icon: <Users className="w-5 h-5 text-muted-foreground" />,
      trend: `${Math.abs(data?.totalContacts?.trend || 0)}%`,
      trendDirection: data?.totalContacts?.trend >= 0 ? "up" : "down",
      color: data?.totalContacts?.trend >= 0 ? "text-green-600" : "text-red-500"
    },
    {
      label: "New This Week",
      value: data?.newContactsThisWeek?.value || 0,
      subtext: "New contacts added",
      icon: <UserPlus className="w-5 h-5 text-muted-foreground" />,
      trend: `${Math.abs(data?.newContactsThisWeek?.trend || 0)}%`,
      trendDirection: data?.newContactsThisWeek?.trend >= 0 ? "up" : "down",
      color: data?.newContactsThisWeek?.trend >= 0 ? "text-green-600" : "text-red-500"
    },
    {
      label: "Total Activities",
      value: data?.totalActivities?.value || 0,
      subtext: "All time activities",
      icon: <Activity className="w-5 h-5 text-muted-foreground" />,
      trend: `${Math.abs(data?.totalActivities?.trend || 0)}%`,
      trendDirection: data?.totalActivities?.trend >= 0 ? "up" : "down",
      color: data?.totalActivities?.trend >= 0 ? "text-green-600" : "text-red-500"
    },
    {
      label: "Active Tags",
      value: data?.activeTags?.value || 0,
      subtext: "Tags in use",
      icon: <Tags className="w-5 h-5 text-muted-foreground" />,
      trend: `${Math.abs(data?.activeTags?.trend || 0)}%`,
      trendDirection: data?.activeTags?.trend >= 0 ? "up" : "down",
      color: data?.activeTags?.trend >= 0 ? "text-green-600" : "text-red-500"
    }
  ];






  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error loading dashboard data. Please try again later.</p>
      </div>
    );
  }





  return (
    <>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here's what's happening with your CRM.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((card, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                    {card.label}
                    {card.icon}
                  </div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className={`flex items-center text-sm ${card.color}`}>
                    {card.trendDirection === "up" ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {card.trend} from last week
                  </div>
                  <p className="text-xs text-muted-foreground">{card.subtext}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-2">Contacts by Company</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={contactsByCompany} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>


            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-2">Activities Timeline</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={activitiesTimeline}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tag Distribution</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={tagDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      label
                    >
                      {tagDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`}
                        // fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Legend layout="horizontal" verticalAlign="bottom" />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
