"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm text-muted">
        Email
        <input
          className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-muted/60 focus:border-gold"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="agent@example.com"
          type="email"
          value={email}
        />
      </label>
      <label className="block text-sm text-muted">
        Password
        <input
          className="mt-2 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-muted/60 focus:border-gold"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="********"
          type="password"
          value={password}
        />
      </label>
      {message ? (
        <p className="rounded-lg border border-red-300/30 bg-red-400/10 p-3 text-sm text-red-100">
          {message}
        </p>
      ) : null}
      <button
        className="w-full rounded-lg bg-gold px-4 py-3 text-center font-semibold text-black transition hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <Link
        href="/"
        className="block rounded-lg border border-white/10 px-4 py-3 text-center text-sm font-medium text-muted transition hover:border-gold/40 hover:text-gold-hover"
      >
        View Demo Dashboard
      </Link>
    </form>
  );
}
