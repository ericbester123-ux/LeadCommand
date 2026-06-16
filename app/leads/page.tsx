import { Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LeadsTable } from "@/components/leads-table";
import { StatCard } from "@/components/stat-card";
import { getLeadCommandUser } from "@/lib/auth";
import { getClientData, getSelectedClientId } from "@/lib/data";

export const dynamic = "force-dynamic";

type LeadsPageProps = {
  searchParams?: {
    client?: string;
  };
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const user = await getLeadCommandUser();
  const activeClientId = getSelectedClientId(
    searchParams?.client,
    user?.isAdmin ? undefined : user?.clientIds
  );
  const { leads } = getClientData(activeClientId);
  const hotLeads = leads.filter((lead) => lead.status === "Hot").length;
  const needsAgent = leads.filter((lead) => lead.status === "Needs Agent").length;
  const booked = leads.filter((lead) => lead.status === "Booked").length;

  return (
    <AppShell
      activeClientId={activeClientId}
      activeHref="/leads"
      isAdminUser={user?.isAdmin}
      title="Leads"
    >
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
      <LeadsTable leads={leads} />
    </AppShell>
  );
}
