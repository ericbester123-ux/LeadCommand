import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Bot, KeyRound, Lock, Settings, ShieldCheck } from "lucide-react";
import { ClientManagement } from "@/components/client-management";
import { ClientSwitcher } from "@/components/client-switcher";
import { IntegrationSettings } from "@/components/integration-settings";
import { getLeadCommandUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getLeadCommandUser();

  if (!user) {
    redirect("/login?next=/settings");
  }

  if (!user.isAdmin) {
    return (
      <main className="safe-bottom safe-top flex min-h-screen items-center justify-center bg-background p-4">
        <section className="w-full max-w-lg rounded-lg border border-white/10 bg-card p-6 text-center shadow-gold">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-red-300/30 bg-red-400/10 text-red-100">
            <Lock size={22} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-white">
            Admin Access Required
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Settings and integrations are only visible to Estates Elevate admins.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-gold px-4 py-3 font-semibold text-black transition hover:bg-gold-hover"
            href="/"
          >
            Back to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="safe-bottom safe-top min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_34%),#050505] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
          <div>
            <Link
              className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition hover:text-gold-hover"
              href="/"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <div className="rounded-lg border border-gold/30 bg-gold/10 p-3 text-gold">
                <Settings size={24} />
              </div>
              <div>
                <p className="text-sm text-muted">Admin only</p>
                <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                  Integration Settings
                </h1>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-gold/25 bg-gold/10 px-4 py-3 text-sm text-gold-hover">
              Signed in as {user.name}
            </div>
            <ClientSwitcher />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-card p-5 shadow-gold">
            <ShieldCheck className="text-gold" size={24} />
            <h2 className="mt-4 text-lg font-semibold text-white">
              Admin Controls
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Keep API keys, webhook URLs, and client connection settings away
              from normal agent users.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-card p-5 shadow-gold">
            <KeyRound className="text-gold" size={24} />
            <h2 className="mt-4 text-lg font-semibold text-white">
              API Credentials
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Save credentials server-side. Never expose service keys in
              client-facing code.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-card p-5 shadow-gold">
            <Bot className="text-gold" size={24} />
            <h2 className="mt-4 text-lg font-semibold text-white">
              Retell Through GHL
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              If Retell already calls and updates GHL, LeadCommand only needs
              GHL data. Direct Retell is optional.
            </p>
          </div>
        </section>

        <ClientManagement />

        <IntegrationSettings />
      </div>
    </main>
  );
}
