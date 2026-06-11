import {
  Bell,
  Bot,
  CalendarCheck,
  Flame,
  LayoutDashboard,
  LineChart,
  Menu,
  PhoneCall,
  Users
} from "lucide-react";
import { CampaignCharts } from "@/components/dashboard-charts";
import { LeadsTable } from "@/components/leads-table";
import { StatCard } from "@/components/stat-card";
import { appointments, leads } from "@/lib/data";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Leads", icon: Users },
  { label: "AI Calls", icon: Bot },
  { label: "Appointments", icon: CalendarCheck },
  { label: "Reports", icon: LineChart }
];

export default function DashboardPage() {
  const hotLeads = leads.filter((lead) => lead.status === "Hot").length;
  const needsAgent = leads.filter((lead) => lead.status === "Needs Agent").length;
  const booked = leads.filter((lead) => lead.status === "Booked").length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_34%),#050505]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-black/40 p-6 lg:block">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              Estates Elevate
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-white">
              LeadCommand
            </h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  index === 0
                    ? "bg-gold text-black"
                    : "text-muted hover:bg-white/5 hover:text-gold-hover"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-10 rounded-lg border border-gold/20 bg-gold/10 p-4">
            <p className="text-sm font-medium text-gold-hover">
              GoHighLevel connected
            </p>
            <p className="mt-2 text-sm text-muted">
              CRM, workflows, calendars, SMS, and email stay in GHL.
            </p>
          </div>
        </aside>

        <section className="flex-1">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-background/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="rounded-lg border border-white/10 p-2 text-white lg:hidden">
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-sm text-muted">Command center</p>
                  <h2 className="text-xl font-semibold text-white md:text-2xl">
                    Today&apos;s Lead Performance
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-lg border border-white/10 p-2 text-muted transition hover:border-gold/40 hover:text-gold-hover">
                  <Bell size={20} />
                </button>
                <div className="hidden rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-sm text-gold-hover sm:block">
                  Live MVP Demo
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-4 md:p-8">
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
                          <p className="text-sm text-muted">
                            {appointment.type}
                          </p>
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
          </div>
        </section>
      </div>
    </main>
  );
}
