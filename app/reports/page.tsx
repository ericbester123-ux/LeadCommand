import { DollarSign, LineChart, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignCharts } from "@/components/dashboard-charts";
import { ReportPeriodFilter } from "@/components/report-period-filter";
import { StatCard } from "@/components/stat-card";
import { getLeadCommandUser } from "@/lib/auth";
import { getClientData, resolveActiveClientIdForPage } from "@/lib/data";
import type { CampaignMetric } from "@/lib/types";

export const dynamic = "force-dynamic";

type ReportsPageProps = {
  searchParams?: {
    client?: string;
    period?: string;
  };
};

function getPeriodMetrics(items: CampaignMetric[], period?: string) {
  if (period === "day") {
    return items.slice(-1);
  }

  if (period === "month") {
    return [...items, ...items, ...items, ...items].map((item, index) => ({
      ...item,
      name: `W${Math.floor(index / 7) + 1}`
    }));
  }

  return items;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const user = await getLeadCommandUser();
  const activeClientId = await resolveActiveClientIdForPage(
    searchParams?.client,
    user?.isAdmin ? undefined : user?.clientIds
  );
  const period = ["day", "week", "month"].includes(searchParams?.period ?? "")
    ? searchParams?.period ?? "week"
    : "week";
  const { campaignMetrics } = await getClientData(activeClientId);
  const filteredMetrics = getPeriodMetrics(campaignMetrics, period);
  const totalLeads = filteredMetrics.reduce((sum, day) => sum + day.leads, 0);
  const totalBooked = filteredMetrics.reduce((sum, day) => sum + day.booked, 0);
  const totalSpend = filteredMetrics.reduce((sum, day) => sum + day.spend, 0);

  return (
    <AppShell
      activeClientId={activeClientId}
      activeHref="/reports"
      isAdminUser={user?.isAdmin}
      title="Reports"
    >
      <ReportPeriodFilter activePeriod={period} />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          detail={`Selected ${period} period`}
          icon={Target}
          title="Leads Generated"
          value={String(totalLeads)}
        />
        <StatCard
          detail="Consults and tours booked"
          icon={LineChart}
          title="Appointments Booked"
          value={String(totalBooked)}
        />
        <StatCard
          detail="Demo ad spend"
          icon={DollarSign}
          title="Media Spend"
          value={`$${totalSpend}`}
        />
      </section>
      <CampaignCharts metrics={filteredMetrics} />
    </AppShell>
  );
}
