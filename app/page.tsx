import { CalendarCheck, Flame, PhoneCall, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignCharts } from "@/components/dashboard-charts";
import { LeadsTable } from "@/components/leads-table";
import { StatCard } from "@/components/stat-card";
import { appointments, leads } from "@/lib/data";

export default function DashboardPage() {
  const hotLeads = leads.filter((lead) => lead.status === "Hot").length;
  const needsAgent = leads.filter((lead) => lead.status === "Needs Agent").length;
  const booked = leads.filter((lead) => lead.status === "Booked").length;

  return (
    <AppShell activeHref="/" title="Today's Lead Performance">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="New Leads"
          value="32"
          detail="+18% from yesterday"
          icon={Users}
        />
        <StatCard
          title="Hot Leads"
          value={String(hotLeads)}
          detail="High intent based on AI call"
          icon={Flame}
        />
        <StatCard
          title="AI Calls Completed"
          value="24"
          detail="Retell outcomes synced from GHL"
          icon={PhoneCall}
        />
        <StatCard
          title="Appointments"
          value={String(booked + appointments.length)}
          detail={`${needsAgent} lead needs agent action`}
          icon={CalendarCheck}
        />
      </section>

      <CampaignCharts />

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <LeadsTable />
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-card p-5">
            <h2 className="text-lg font-semibold text-white">
              AI Call Highlights
            </h2>
            <div className="mt-4 space-y-4">
              {leads.slice(0, 3).map((lead) => (
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
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-card p-5">
            <h2 className="text-lg font-semibold text-white">
              Upcoming Appointments
            </h2>
            <div className="mt-4 space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 p-4"
                >
                  <div>
                    <p className="font-medium text-white">
                      {appointment.client}
                    </p>
                    <p className="text-sm text-muted">{appointment.type}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gold-hover">{appointment.date}</p>
                    <p className="text-muted">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
