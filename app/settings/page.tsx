import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  KeyRound,
  Lock,
  Settings,
  ShieldCheck
} from "lucide-react";
import { integrations } from "@/lib/integrations";
import { currentUser, isAdmin } from "@/lib/current-user";

const statusStyles = {
  Connected: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  "Needs Setup": "border-gold/40 bg-gold/15 text-gold-hover",
  Optional: "border-white/15 bg-white/5 text-muted"
};

export default function SettingsPage() {
  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
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
            className="mt-6 inline-flex rounded-lg bg-gold px-4 py-3 font-semibold text-black transition hover:bg-gold-hover"
            href="/"
          >
            Back to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_34%),#050505] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
          <div>
            <Link
              className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold-hover"
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
                <h1 className="text-3xl font-semibold text-white">
                  Integration Settings
                </h1>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gold/25 bg-gold/10 px-4 py-3 text-sm text-gold-hover">
            Signed in as {currentUser.name}
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
              Store sensitive tokens in environment variables or secure database
              records, never in client-facing code.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-card p-5 shadow-gold">
            <Bot className="text-gold" size={24} />
            <h2 className="mt-4 text-lg font-semibold text-white">
              AI Caller Setup
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Connect Retell call outcomes to GHL contacts and LeadCommand call
              summaries.
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-card">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-lg font-semibold text-white">Integrations</h2>
            <p className="text-sm text-muted">
              Configure the systems that power LeadCommand behind the scenes.
            </p>
          </div>
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {integrations.map((integration) => (
              <article
                className="rounded-lg border border-white/10 bg-white/[0.03] p-5 transition hover:border-gold/35"
                key={integration.name}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-gold/25 bg-gold/10 p-3 text-gold">
                      <integration.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {integration.name}
                      </h3>
                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[integration.status]}`}
                      >
                        {integration.status}
                      </span>
                    </div>
                  </div>
                  {integration.status === "Connected" ? (
                    <CheckCircle2 className="text-emerald-200" size={20} />
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {integration.description}
                </p>
                <button className="mt-5 rounded-lg border border-gold/30 px-4 py-2 text-sm font-medium text-gold-hover transition hover:bg-gold/10">
                  Configure
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
