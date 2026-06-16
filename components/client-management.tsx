"use client";

import { useEffect, useState } from "react";
import { Building2, MailPlus, Trash2, UserPlus } from "lucide-react";
import type { ClientProfile } from "@/lib/clients";
import { clientProfiles } from "@/lib/clients";

type ClientForm = {
  brokerage: string;
  ghlLocationId: string;
  locationName: string;
  market: string;
  name: string;
};

const emptyClientForm: ClientForm = {
  brokerage: "",
  ghlLocationId: "",
  locationName: "",
  market: "",
  name: ""
};

export function ClientManagement() {
  const [clients, setClients] = useState<ClientProfile[]>(clientProfiles);
  const [clientForm, setClientForm] = useState<ClientForm>(emptyClientForm);
  const [assignClientId, setAssignClientId] = useState(clientProfiles[0]?.id ?? "");
  const [deleteClientId, setDeleteClientId] = useState(clientProfiles[0]?.id ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");

  async function loadClients() {
    const response = await fetch("/api/clients/list", { cache: "no-store" });
    const result = (await response.json()) as {
      clients?: ClientProfile[];
      message?: string;
    };

    if (result.clients?.length) {
      setClients(result.clients);
      setAssignClientId((current) => current || result.clients?.[0]?.id || "");
      setDeleteClientId((current) => current || result.clients?.[0]?.id || "");
    }
  }

  useEffect(() => {
    void loadClients();
  }, []);

  function updateClientForm(field: keyof ClientForm, value: string) {
    setClientForm((current) => ({ ...current, [field]: value }));
  }

  async function saveClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("client");
    setMessage("");

    const response = await fetch("/api/clients/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientForm)
    });
    const result = (await response.json()) as {
      client?: ClientProfile;
      message?: string;
    };

    setMessage(result.message ?? "Client saved.");
    setLoading("");

    if (response.ok) {
      setClientForm(emptyClientForm);

      if (result.client) {
        setClients((current) => {
          const existing = current.some(
            (client) => client.id === result.client?.id
          );

          return existing || !result.client
            ? current
            : [...current, result.client];
        });
        setAssignClientId(result.client.id);
        setDeleteClientId(result.client.id);
      }

      await loadClients();
    }
  }

  async function inviteUser() {
    setLoading("invite");
    setMessage("");

    const response = await fetch("/api/clients/invite-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const result = (await response.json()) as { message?: string };

    setMessage(result.message ?? "Invite processed.");
    setLoading("");
  }

  async function createUserWithPassword() {
    setLoading("create-user");
    setMessage("");

    const response = await fetch("/api/clients/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: assignClientId, email, password })
    });
    const result = (await response.json()) as { message?: string };

    setMessage(result.message ?? "User created.");
    setLoading("");

    if (response.ok) {
      setPassword("");
    }
  }

  async function assignUser() {
    setLoading("assign");
    setMessage("");

    const response = await fetch("/api/clients/assign-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: assignClientId, email })
    });
    const result = (await response.json()) as { message?: string };

    setMessage(result.message ?? "Assignment processed.");
    setLoading("");
  }

  async function deleteClient() {
    const client = clients.find((item) => item.id === deleteClientId);
    const confirmed = window.confirm(
      `Remove ${client?.locationName ?? "this location"} from LeadCommand? This removes the location record and assignments.`
    );

    if (!confirmed) {
      return;
    }

    setLoading("delete-client");
    setMessage("");

    const response = await fetch("/api/clients/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: deleteClientId })
    });
    const result = (await response.json()) as { message?: string };

    setMessage(result.message ?? "Location removed.");
    setLoading("");

    if (response.ok) {
      const remaining = clients.filter((item) => item.id !== deleteClientId);
      setClients(remaining);
      setAssignClientId(remaining[0]?.id ?? "");
      setDeleteClientId(remaining[0]?.id ?? "");
      await loadClients();
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-card">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-lg font-semibold text-white">Client Management</h2>
        <p className="text-sm leading-6 text-muted">
          Add client locations, invite users, and assign users to the locations
          they should be able to access.
        </p>
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-[1.2fr_0.8fr]">
        <form className="space-y-4" onSubmit={saveClient}>
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-gold/25 bg-gold/10 p-3 text-gold">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Create Client Location</h3>
              <p className="text-sm text-muted">
                This creates the record that appears in the admin location
                switcher.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-muted">
              Client Name
              <input
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                onChange={(event) => updateClientForm("name", event.target.value)}
                required
                value={clientForm.name}
              />
            </label>
            <label className="text-sm text-muted">
              Location Name
              <input
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                onChange={(event) =>
                  updateClientForm("locationName", event.target.value)
                }
                required
                value={clientForm.locationName}
              />
            </label>
            <label className="text-sm text-muted">
              Brokerage
              <input
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                onChange={(event) =>
                  updateClientForm("brokerage", event.target.value)
                }
                value={clientForm.brokerage}
              />
            </label>
            <label className="text-sm text-muted">
              Market
              <input
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                onChange={(event) => updateClientForm("market", event.target.value)}
                value={clientForm.market}
              />
            </label>
            <label className="text-sm text-muted md:col-span-2">
              Location ID
              <input
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                onChange={(event) =>
                  updateClientForm("ghlLocationId", event.target.value)
                }
                placeholder="Optional while setting up"
                value={clientForm.ghlLocationId}
              />
            </label>
          </div>
          <button
            className="min-h-11 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading === "client"}
            type="submit"
          >
            {loading === "client" ? "Saving..." : "Save Client Location"}
          </button>
        </form>

        <div className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <MailPlus className="text-gold" size={20} />
              <h3 className="font-semibold text-white">Invite User</h3>
            </div>
            <label className="mt-4 block text-sm text-muted">
              User Email
              <input
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </label>
            <button
              className="mt-4 min-h-11 w-full rounded-lg border border-gold/30 px-4 py-2 text-sm font-medium text-gold-hover transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!email || loading === "invite"}
              onClick={inviteUser}
              type="button"
            >
              {loading === "invite" ? "Sending..." : "Send Invite"}
            </button>
            <p className="mt-3 text-xs leading-5 text-muted">
              Invite sends a Supabase email link where the user can complete
              access setup. Use the password option below when you want to set a
              temporary password yourself.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <UserPlus className="text-gold" size={20} />
              <h3 className="font-semibold text-white">Assign To Location</h3>
            </div>
            <label className="mt-4 block text-sm text-muted">
              Client Location
              <select
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                onChange={(event) => setAssignClientId(event.target.value)}
                value={assignClientId}
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.agentName} - {client.locationName}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm text-muted">
              Temporary Password
              <input
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                type="password"
                value={password}
              />
            </label>
            <button
              className="mt-4 min-h-11 w-full rounded-lg border border-gold/30 px-4 py-2 text-sm font-medium text-gold-hover transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                !email ||
                !password ||
                !assignClientId ||
                loading === "create-user"
              }
              onClick={createUserWithPassword}
              type="button"
            >
              {loading === "create-user"
                ? "Creating..."
                : "Create User With Password"}
            </button>
            <button
              className="mt-3 min-h-11 w-full rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!email || !assignClientId || loading === "assign"}
              onClick={assignUser}
              type="button"
            >
              {loading === "assign" ? "Assigning..." : "Assign User"}
            </button>
          </div>

          <div className="rounded-lg border border-red-300/20 bg-red-400/10 p-5">
            <div className="flex items-center gap-3">
              <Trash2 className="text-red-100" size={20} />
              <h3 className="font-semibold text-white">Remove Location</h3>
            </div>
            <label className="mt-4 block text-sm text-muted">
              Client Location
              <select
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-200"
                onChange={(event) => setDeleteClientId(event.target.value)}
                value={deleteClientId}
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.agentName} - {client.locationName}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="mt-4 min-h-11 w-full rounded-lg border border-red-300/30 px-4 py-2 text-sm font-medium text-red-100 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!deleteClientId || loading === "delete-client"}
              onClick={deleteClient}
              type="button"
            >
              {loading === "delete-client"
                ? "Removing..."
                : "Remove Location"}
            </button>
            <p className="mt-3 text-xs leading-5 text-muted">
              This removes the LeadCommand location record. It does not delete
              anything inside the client&apos;s external systems.
            </p>
          </div>
        </div>
      </div>

      {message ? (
        <p className="mx-5 mb-5 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">
          {message}
        </p>
      ) : null}
    </section>
  );
}
