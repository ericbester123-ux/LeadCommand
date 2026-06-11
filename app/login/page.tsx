import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_35%),#050505] p-4">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-card p-6 shadow-gold">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          Estates Elevate
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">LeadCommand</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Sign in with Supabase Auth to access the client-facing command center.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
