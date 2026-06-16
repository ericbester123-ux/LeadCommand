"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Building2, CheckCircle2 } from "lucide-react";
import type { ClientProfile } from "@/lib/clients";
import { clientProfiles, defaultClientProfile } from "@/lib/clients";

const storageKey = "leadcommand-active-client";

type ClientSwitcherProps = {
  activeClientId?: string;
  compact?: boolean;
};

export function ClientSwitcher({
  activeClientId = defaultClientProfile.id,
  compact = false
}: ClientSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableClients, setAvailableClients] =
    useState<ClientProfile[]>(clientProfiles);
  const [selectedClientId, setSelectedClientId] = useState(
    activeClientId
  );

  useEffect(() => {
    async function loadClients() {
      const response = await fetch("/api/clients/list");
      const result = (await response.json()) as { clients?: ClientProfile[] };

      if (result.clients?.length) {
        setAvailableClients(result.clients);
      }
    }

    void loadClients();
  }, []);

  useEffect(() => {
    const savedClientId = window.localStorage.getItem(storageKey);
    const nextClientId =
      activeClientId !== defaultClientProfile.id ? activeClientId : savedClientId;

    if (
      nextClientId &&
      availableClients.some((client) => client.id === nextClientId)
    ) {
      setSelectedClientId(nextClientId);
    }
  }, [activeClientId, availableClients]);

  const activeClient =
    availableClients.find((client) => client.id === selectedClientId) ??
    defaultClientProfile;

  function handleClientChange(clientId: string) {
    setSelectedClientId(clientId);
    window.localStorage.setItem(storageKey, clientId);

    const params = new URLSearchParams(searchParams.toString());
    params.set("client", clientId);
    router.push(`${pathname}?${params.toString()}`);
  }

  if (compact) {
    return (
      <label className="hidden min-w-0 items-center gap-2 rounded-lg border border-gold/25 bg-gold/10 px-3 py-2 text-sm text-gold-hover shadow-gold md:flex">
        <span className="hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-gold xl:inline">
          Location
        </span>
        <select
          aria-label="Switch client location"
          className="w-36 rounded-md border border-white/10 bg-black px-2 py-1.5 text-xs font-medium text-white outline-none transition focus:border-gold lg:w-44 xl:w-52"
          onChange={(event) => handleClientChange(event.target.value)}
          value={selectedClientId}
        >
          {availableClients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.locationName}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <section className="rounded-lg border border-gold/25 bg-gold/10 p-3 shadow-gold">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg border border-gold/30 bg-black/30 p-2 text-gold">
          <Building2 size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Admin Location View
            </p>
            <span
              className={`hidden items-center gap-1 rounded-full border px-2 py-1 text-[11px] sm:inline-flex ${
                activeClient.status === "Connected"
                  ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
                  : "border-gold/35 bg-gold/10 text-gold-hover"
              }`}
            >
              <CheckCircle2 size={12} />
              {activeClient.status}
            </span>
          </div>
          <label className="mt-2 block text-sm text-muted">
            <span className="sr-only">Switch client profile</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-medium text-white outline-none transition focus:border-gold"
              onChange={(event) => handleClientChange(event.target.value)}
              value={selectedClientId}
            >
              {availableClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.agentName} - {client.locationName}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 truncate text-xs text-muted">
            {activeClient.market} | {activeClient.lastSync}
          </p>
        </div>
      </div>
    </section>
  );
}
