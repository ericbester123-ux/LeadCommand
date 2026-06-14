import Link from "next/link";
import {
  Bell,
  Bot,
  CalendarCheck,
  LayoutDashboard,
  LineChart,
  Menu,
  Settings,
  Users
} from "lucide-react";
import { isAdmin } from "@/lib/current-user";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Leads", icon: Users, href: "/leads" },
  { label: "AI Caller", icon: Bot, href: "/ai-caller" },
  { label: "Appointments", icon: CalendarCheck, href: "/appointments" },
  { label: "Reports", icon: LineChart, href: "/reports" }
];

const adminNavItems = isAdmin
  ? [{ label: "Settings", icon: Settings, href: "/settings" }]
  : [];

type AppShellProps = {
  activeHref: string;
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
};

export function AppShell({
  activeHref,
  children,
  eyebrow = "Command center",
  title
}: AppShellProps) {
  const allNavItems = [...navItems, ...adminNavItems];

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
            {allNavItems.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                    active
                      ? "bg-gold text-black"
                      : "text-muted hover:bg-white/5 hover:text-gold-hover"
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
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

        <section className="flex-1 pb-28 lg:pb-0">
          <header className="safe-top sticky top-0 z-20 border-b border-white/10 bg-background/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Open navigation"
                  className="min-h-11 min-w-11 rounded-lg border border-white/10 p-2 text-white lg:hidden"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-xs text-muted sm:text-sm">{eyebrow}</p>
                  <h2 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
                    {title}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  aria-label="Notifications"
                  className="min-h-11 min-w-11 rounded-lg border border-white/10 p-2 text-muted transition hover:border-gold/40 hover:text-gold-hover"
                >
                  <Bell size={20} />
                </button>
                <div className="hidden rounded-lg border border-gold/25 bg-gold/10 px-4 py-2 text-sm text-gold-hover sm:block">
                  Live MVP Demo
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-4 md:p-8">{children}</div>
        </section>
      </div>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-background/95 px-3 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl gap-2 overflow-x-auto">
          {allNavItems.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 min-w-[76px] flex-col items-center justify-center gap-1 rounded-lg px-3 text-xs font-medium transition ${
                  active
                    ? "bg-gold text-black"
                    : "text-muted hover:bg-white/5 hover:text-gold-hover"
                }`}
                href={item.href}
                key={item.label}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
