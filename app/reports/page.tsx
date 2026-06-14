import { DollarSign, LineChart, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignCharts } from "@/components/dashboard-charts";
import { StatCard } from "@/components/stat-card";
import { campaignMetrics } from "@/lib/data";

export default function ReportsPage() {
  const totalLeads = campaignMetrics.reduce((sum, day) => sum + day.leads, 0);
  const totalBooked = campaignMetrics.reduce((sum, day) => sum + day.booked, 0);
  const totalSpend = campaignMetrics.reduce((sum, day) => sum + day.spend, 0);

  return (
    <AppShell activeHref="/reports" title="Reports">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          detail="This campaign period"
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
      <CampaignCharts />
    </AppShell>
  );
}
