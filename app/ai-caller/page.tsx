import { Bot, PhoneCall } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { getLeadCommandUser } from "@/lib/auth";
import { getClientData, resolveActiveClientIdForPage } from "@/lib/data";

export const dynamic = "force-dynamic";

type AiCallerPageProps = {
  searchParams?: {
    client?: string;
  };
};

export default async function AiCallerPage({
  searchParams
}: AiCallerPageProps) {
  const user = await getLeadCommandUser();
  const activeClientId = await resolveActiveClientIdForPage(
    searchParams?.client,
    user?.isAdmin ? undefined : user?.clientIds
  );
  const { leads } = await getClientData(activeClientId);
  const contacted = leads.filter((lead) => lead.status !== "New").length;
  const needsAgent = leads.filter((lead) => lead.status === "Needs Agent").length;

  return (
    <AppShell
      activeHref="/ai-caller"
      activeClientId={activeClientId}
      isAdminUser={user?.isAdmin}
      title="AI Caller"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          detail="Retell outcomes visible in dashboard"
          icon={PhoneCall}
          title="Calls Completed"
          value={String(contacted)}
        />
        <StatCard
          detail="Leads asking for human help"
          icon={Bot}
          title="Agent Hand-offs"
          value={String(needsAgent)}
        />
        <StatCard
          detail="Demo call completion rate"
          icon={Bot}
          title="Qualification Rate"
          value="82%"
        />
      </section>
      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold text-white">AI Call Summaries</h2>
          <p className="text-sm text-muted">
            What the AI caller learned and what should happen next.
          </p>
        </div>
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {leads.length ? leads.map((lead) => (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
              key={lead.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{lead.name}</h3>
                  <p className="text-sm text-muted">{lead.lastContact}</p>
                </div>
                <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-xs text-gold-hover">
                  {lead.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">
                {lead.aiSummary}
              </p>
              <p className="mt-4 text-sm font-medium text-gold-hover">
                Next: {lead.nextAction}
              </p>
            </article>
          )) : (
            <p className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-muted lg:col-span-2">
              No AI call summaries yet for this location.
            </p>
          )}
        </div>
      </section>
    </AppShell>
  );
}
