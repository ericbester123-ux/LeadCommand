"use client";

import { useEffect, useState } from "react";
import type { ClientProfile } from "@/lib/clients";
import { clientProfiles } from "@/lib/clients";

export function useAvailableClients() {
  const [availableClients, setAvailableClients] =
    useState<ClientProfile[]>(clientProfiles);

  useEffect(() => {
    async function loadClients() {
      const response = await fetch("/api/clients/list", { cache: "no-store" });
      const result = (await response.json()) as { clients?: ClientProfile[] };

      if (result.clients?.length) {
        setAvailableClients(result.clients);
      }
    }

    void loadClients();
  }, []);

  return availableClients;
}
