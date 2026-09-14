'use client';
import { WorkspaceSkeleton } from '@/components/workspace-skeleton';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LabelList } from 'recharts';
import { getDashboardSummary, getContactByCompany, getActivitiesTimeline, getTagDistribution } from '@/services/dashboardApi';

const options = { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false, retry: 2 };
const number = value => Number(value || 0).toLocaleString();

function DistributionTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><p className="text-xs text-muted-foreground">{label || payload[0].payload.name}</p><p className="mt-1 text-sm font-medium">{number(payload[0].value)} {unit}</p></div>;
}

function ChartData({ rows, valueKey, caption }) {
  return <table className="sr-only"><caption>{caption}</caption><thead><tr><th>Name</th><th>Count</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.name}-${index}`}><th>{row.name}</th><td>{row[valueKey]}</td></tr>)}</tbody></table>;
}

function ActivityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{number(payload[0].value)} activities</p></div>;
}

export default function DashboardPage() {
  const summary = useQuery({ queryKey: ['dashboard-summary'], queryFn: getDashboardSummary, ...options });
  const companies = useQuery({ queryKey: ['contacts-by-company'], queryFn: getContactByCompany, ...options });
  const timeline = useQuery({ queryKey: ['activities-timeline'], queryFn: getActivitiesTimeline, ...options });
  const tags = useQuery({ queryKey: ['tag-distribution'], queryFn: getTagDistribution, ...options });
  const metrics = [
    ['Total contacts', summary.data?.totalContacts],
    ['New this week', summary.data?.newContactsThisWeek],
    ['Total activities', summary.data?.totalActivities],
    ['Active tags', summary.data?.activeTags],
  ];
  const companyRows = [...(companies.data || [])].sort((a, b) => b.count - a.count);
  const tagRows = [...(tags.data || [])].sort((a, b) => b.value - a.value);
  const tagTotal = tagRows.reduce((sum, row) => sum + row.value, 0);

  if (summary.isPending || companies.isPending || timeline.isPending || tags.isPending) return <WorkspaceSkeleton variant="dashboard" label="Loading overview" />;
  if (summary.isError) return <div className="workspace-empty" role="alert">Could not load your overview. Please refresh to try again.</div>;

  return <div className="dashboard-grid">
    <section className="metric-strip" aria-label="CRM summary">
      {metrics.map(([label, metric]) => {
        const up = (metric?.trend || 0) >= 0;
        const Trend = up ? ArrowUpRight : ArrowDownRight;
        return <div className="metric-cell" key={label}>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="metric-value">{number(metric?.value)}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Trend className="size-3.5" aria-hidden="true" /><span className="sr-only">{up ? 'Up' : 'Down'} </span><span className="font-medium text-foreground">{Math.abs(metric?.trend || 0)}%</span> vs. last week</p>
        </div>;
      })}
    </section>

    <div className="overview-charts">
      <section className="insight-panel" aria-labelledby="activity-chart-title">
        <div className="insight-header"><h2 id="activity-chart-title">Activity over time</h2><span className="text-xs text-muted-foreground">Activities</span></div>
        <div className="h-64 sm:h-72">
          {timeline.isLoading ? <div className="workspace-loading">Loading activity…</div> : timeline.isError ? <div className="workspace-empty">Activity data is unavailable.</div> : !timeline.data?.length ? <div className="workspace-empty">Your activity will appear here.</div> :
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline.data} margin={{ top: 20, right: 12, bottom: 0, left: -15 }}>
              <defs><linearGradient id="activity-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.12} /><stop offset="100%" stopColor="var(--foreground)" stopOpacity={0.01} /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickMargin={12} minTickGap={30} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickMargin={10} />
              <Tooltip content={<ActivityTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '3 5' }} />
              <Area type="linear" dataKey="count" name="Activities" stroke="var(--foreground)" strokeWidth={1.8} fill="url(#activity-shade)" dot={{ r: 3, fill: 'var(--background)', strokeWidth: 1.5 }} activeDot={{ r: 5, fill: 'var(--foreground)', stroke: 'var(--background)', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>}
        </div>
      </section>
      <section className="insight-panel" aria-labelledby="company-chart-title">
        <div className="insight-header"><h2 id="company-chart-title">Contacts by company</h2><span className="text-xs text-muted-foreground">Contacts</span></div>
        <div style={{ height: Math.max(288, companyRows.length * 48) }}>
          {companies.isLoading ? <div className="workspace-loading">Loading companies…</div> : companies.isError ? <div className="workspace-empty">Company data is unavailable.</div> : !companyRows.length ? <div className="workspace-empty">No company contacts yet.</div> : <>
            <ChartData rows={companyRows} valueKey="count" caption="Contacts by company" />
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyRows} layout="vertical" margin={{ top: 8, right: 30, bottom: 0, left: 0 }} accessibilityLayer>
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 5" />
                <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickMargin={10} />
                <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <Tooltip content={<DistributionTooltip unit="contacts" />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="count" name="Contacts" fill="var(--foreground)" fillOpacity={0.85} radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
                  <LabelList dataKey="count" position="right" fill="var(--foreground)" fontSize={12} offset={8} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>}
        </div>
      </section>
    </div>

    <section className="insight-panel" aria-labelledby="tags-chart-title">
      <div className="insight-header"><h2 id="tags-chart-title">Tag distribution</h2><span className="text-xs text-muted-foreground">{number(tagTotal)} assignments</span></div>
      {tags.isLoading ? <div className="workspace-loading">Loading tags…</div> : tags.isError ? <div className="workspace-empty">Tag data is unavailable.</div> : !tagRows.length ? <div className="workspace-empty">Tags will appear here as you organize your contacts.</div> : <>
        <ChartData rows={tagRows} valueKey="value" caption="Tag distribution" />
        <div className="distribution-chart-scroll" tabIndex={0} role="region" aria-label="Tag distribution chart. Scroll horizontally to see all tags.">
          <div style={{ height: 320, minWidth: Math.max(560, tagRows.length * 70) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tagRows} margin={{ top: 26, right: 20, bottom: 12, left: -20 }} accessibilityLayer>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={78} tickMargin={12} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <Tooltip content={<DistributionTooltip unit="assignments" />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="value" name="Assignments" fill="var(--foreground)" fillOpacity={0.8} radius={[4, 4, 0, 0]} maxBarSize={30} isAnimationActive={false}>
                  <LabelList dataKey="value" position="top" fill="var(--foreground)" fontSize={12} offset={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>}

    </section>
  </div>;
}
