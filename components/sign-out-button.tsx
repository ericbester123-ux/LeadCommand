"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.localStorage.removeItem("leadcommand-active-client");
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      aria-label="Sign out"
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-muted transition hover:border-gold/40 hover:text-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
      disabled={loading}
      onClick={handleSignOut}
      type="button"
    >
      <LogOut size={18} />
      <span className="hidden xl:inline">{loading ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}
