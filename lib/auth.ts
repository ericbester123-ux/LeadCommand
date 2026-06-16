import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export type LeadCommandRole = "admin" | "agent";

export type LeadCommandUser = {
  clientIds: string[];
  id: string;
  email: string;
  name: string;
  role: LeadCommandRole;
  isAdmin: boolean;
};

function getNameFromEmail(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isConfiguredAdmin(email: string) {
  const adminEmails = process.env.LEADCOMMAND_ADMIN_EMAILS ?? "";

  return adminEmails
    .split(",")
    .map((adminEmail) => adminEmail.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

async function ensureAgentProfile(
  userId: string,
  fullName: string,
  role: LeadCommandRole
) {
  const admin = getSupabaseAdminClient();
  const payload = {
    id: userId,
    full_name: fullName,
    role,
    updated_at: new Date().toISOString()
  };

  if (admin) {
    await admin.from("agents").upsert(payload, { onConflict: "id" });
    return;
  }

  const supabase = createServerComponentClient({ cookies });
  const { data: profile } = await supabase
    .from("agents")
    .select("full_name, role")
    .eq("id", userId)
    .maybeSingle();

  if (profile) {
    if (profile.role !== role) {
      await supabase
        .from("agents")
        .update({ role, updated_at: payload.updated_at })
        .eq("id", userId);
    }

    return;
  }

  await supabase.from("agents").insert({
    id: userId,
    full_name: fullName,
    role: role === "admin" ? "agent" : role
  });
}

export async function getLeadCommandUser(): Promise<LeadCommandUser | null> {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user.email) {
    return null;
  }

  const email = session.user.email;
  const fallbackName =
    session.user.user_metadata?.full_name ??
    session.user.user_metadata?.name ??
    getNameFromEmail(email);
  const role: LeadCommandRole = isConfiguredAdmin(email) ? "admin" : "agent";
  let clientIds: string[] = [];

  const { data: memberships } = await supabase
    .from("client_memberships")
    .select("client_id")
    .eq("agent_id", session.user.id);

  if (memberships) {
    clientIds = memberships
      .map((membership) => membership.client_id)
      .filter(Boolean);
  }

  await ensureAgentProfile(session.user.id, fallbackName, role);

  const { data: profile } = await supabase
    .from("agents")
    .select("full_name, role")
    .eq("id", session.user.id)
    .maybeSingle();

  return {
    id: session.user.id,
    clientIds,
    email,
    name: profile?.full_name ?? fallbackName,
    role,
    isAdmin: role === "admin"
  };
}
