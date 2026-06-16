"use client";

import { useEffect, useState } from "react";
import type { ClientProfile } from "@/lib/clients";
import { clientProfiles } from "@/lib/clients";

const clientsCacheKey = "leadcommand-available-clients";
let cachedClients: ClientProfile[] | null = null;

function readCachedClients() {
  if (cachedClients) {
    return cachedClients;
  }

  try {
    const storedClients = window.sessionStorage.getItem(clientsCacheKey);

    if (storedClients) {
      cachedClients = JSON.parse(storedClients) as ClientProfile[];
      return cachedClients;
    }
  } catch {
    return null;
  }

  return null;
}

function writeCachedClients(clients: ClientProfile[]) {
  cachedClients = clients;

  try {
    window.sessionStorage.setItem(clientsCacheKey, JSON.stringify(clients));
  } catch {
    // Cache is only a speed boost. The app still works if storage is blocked.
  }
}

export function useAvailableClients() {
  const initialClients = readCachedClients();
  const [availableClients, setAvailableClients] = useState<ClientProfile[]>(
    initialClients ?? clientProfiles
  );
  const [loading, setLoading] = useState(!initialClients);

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await fetch("/api/clients/list", { cache: "no-store" });
        const result = (await response.json()) as { clients?: ClientProfile[] };

        if (result.clients?.length) {
          writeCachedClients(result.clients);
          setAvailableClients(result.clients);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadClients();
  }, []);

  return { availableClients, loading };
}
