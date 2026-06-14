import { CalendarCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { appointments } from "@/lib/data";

export default function AppointmentsPage() {
  const confirmed = appointments.filter(
    (appointment) => appointment.status === "Confirmed"
  ).length;

  return (
    <AppShell activeHref="/appointments" title="Appointments">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          detail="Synced from calendar source"
          icon={CalendarCheck}
          title="Upcoming"
          value={String(appointments.length)}
        />
        <StatCard
          detail="Ready for the agent"
          icon={CalendarCheck}
          title="Confirmed"
          value={String(confirmed)}
        />
        <StatCard
          detail="Awaiting final confirmation"
          icon={CalendarCheck}
          title="Pending"
          value={String(appointments.length - confirmed)}
        />
      </section>
      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold text-white">
            Upcoming Appointments
          </h2>
          <p className="text-sm text-muted">
            Buyer consults, property tours, and listing appointments.
          </p>
        </div>
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {appointments.map((appointment) => (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
              key={appointment.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">
                    {appointment.client}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{appointment.type}</p>
                </div>
                <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-xs text-gold-hover">
                  {appointment.status}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-lg border border-white/10 p-4 text-sm">
                <span className="text-muted">{appointment.date}</span>
                <span className="font-medium text-white">{appointment.time}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
