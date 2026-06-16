import { CalendarCheck, Flame, PhoneCall, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignCharts } from "@/components/dashboard-charts";
import { LeadsTable } from "@/components/leads-table";
import { StatCard } from "@/components/stat-card";
import { getLeadCommandUser } from "@/lib/auth";
import { getClientData, getDashboardStats, resolveActiveClientIdForPage } from "@/lib/data";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: {
    client?: string;
  };
};

export default async function DashboardPage({
  searchParams
}: DashboardPageProps) {
  const user = await getLeadCommandUser();
  const activeClientId = await resolveActiveClientIdForPage(
    searchParams?.client,
    user?.isAdmin ? undefined : user?.clientIds
  );
  const { appointments, campaignMetrics, leads } = await getClientData(
    activeClientId
  );
  const stats = await getDashboardStats(activeClientId);

  return (
    <AppShell
      activeHref="/"
      activeClientId={activeClientId}
      isAdminUser={user?.isAdmin}
      title="Today's Lead Performance"
    >
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="New Leads"
                value={String(stats.newLeads)}
                detail={`${stats.totalLeads} active in pipeline`}
                icon={Users}
              />
              <StatCard
                title="Hot Leads"
                value={String(stats.hotLeads)}
                detail="High intent based on AI call"
                icon={Flame}
              />
              <StatCard
                title="AI Calls Completed"
                value={String(stats.aiCallsCompleted)}
                detail="AI call outcomes synced"
                icon={PhoneCall}
              />
              <StatCard
                title="Appointments"
                value={String(stats.appointments)}
                detail={`${stats.needsAgent} lead needs agent action`}
                icon={CalendarCheck}
              />
            </section>

            <CampaignCharts metrics={campaignMetrics} />

            <section className="grid gap-4 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <LeadsTable leads={leads} />
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-card p-5">
                  <h2 className="text-lg font-semibold text-white">
                    AI Call Highlights
                  </h2>
                  <div className="mt-4 space-y-4">
                    {leads.length ? leads.slice(0, 3).map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{lead.name}</p>
                          <span className="text-xs text-gold-hover">
                            {lead.lastContact}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {lead.aiSummary}
                        </p>
                      </div>
                    )) : (
                      <p className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">
                        No AI call highlights yet for this location.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-card p-5">
                  <h2 className="text-lg font-semibold text-white">
                    Upcoming Appointments
                  </h2>
                  <div className="mt-4 space-y-3">
                    {appointments.length ? appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-white/10 p-4"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {appointment.client}
                          </p>
                          <p className="text-sm text-muted">
                            {appointment.type}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-gold-hover">{appointment.date}</p>
                          <p className="text-muted">{appointment.time}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">
                        No upcoming appointments yet for this location.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
    </AppShell>
  );
}
