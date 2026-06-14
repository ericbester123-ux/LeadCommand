import { Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LeadsTable } from "@/components/leads-table";
import { StatCard } from "@/components/stat-card";
import { leads } from "@/lib/data";

export default function LeadsPage() {
  const hotLeads = leads.filter((lead) => lead.status === "Hot").length;
  const needsAgent = leads.filter((lead) => lead.status === "Needs Agent").length;
  const booked = leads.filter((lead) => lead.status === "Booked").length;

  return (
    <AppShell activeHref="/leads" title="Leads">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          detail="All active client leads"
          icon={Users}
          title="Total Leads"
          value={String(leads.length)}
        />
        <StatCard
          detail="Highest intent prospects"
          icon={Users}
          title="Hot Leads"
          value={String(hotLeads)}
        />
        <StatCard
          detail={`${needsAgent} need action, ${booked} booked`}
          icon={Users}
          title="Agent Focus"
          value={String(needsAgent + booked)}
        />
      </section>
      <LeadsTable />
    </AppShell>
  );
}
