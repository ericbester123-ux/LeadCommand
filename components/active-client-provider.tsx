"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ClientProfile } from "@/lib/clients";
import { defaultClientProfile } from "@/lib/clients";
import {
  ACTIVE_CLIENT_STORAGE_KEY,
  resolveActiveClientId,
  resolveClientProfile
} from "@/lib/active-client";
import { useAvailableClients } from "@/lib/use-available-clients";

type ActiveClientContextValue = {
  activeClient: ClientProfile;
  availableClients: ClientProfile[];
  selectClient: (clientId: string) => void;
  selectedClientId: string;
};

const ActiveClientContext = createContext<ActiveClientContextValue | null>(null);

type ActiveClientProviderProps = {
  children: ReactNode;
  serverClientId?: string;
};

export function ActiveClientProvider({
  children,
  serverClientId
}: ActiveClientProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { availableClients, loading } = useAvailableClients();
  const urlClientId = searchParams.get("client");
  const [selectedClientId, setSelectedClientId] = useState(
    () => urlClientId ?? serverClientId ?? defaultClientProfile.id
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    const savedClientId = window.localStorage.getItem(ACTIVE_CLIENT_STORAGE_KEY);
    const resolvedClientId = resolveActiveClientId(
      urlClientId,
      serverClientId,
      savedClientId,
      availableClients
    );

    setSelectedClientId(resolvedClientId);

    if (resolvedClientId !== urlClientId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("client", resolvedClientId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [
    availableClients,
    loading,
    pathname,
    router,
    searchParams,
    serverClientId,
    urlClientId
  ]);

  const activeClient = useMemo(() => {
    const resolvedClient = resolveClientProfile(
      selectedClientId,
      availableClients
    );

    if (
      loading &&
      selectedClientId !== defaultClientProfile.id &&
      resolvedClient.id === defaultClientProfile.id
    ) {
      return {
        ...defaultClientProfile,
        id: selectedClientId,
        agentName: "Loading location",
        locationName: "Loading location..."
      };
    }

    return resolvedClient;
  }, [availableClients, loading, selectedClientId]);

  const selectClient = useCallback(
    (clientId: string) => {
      setSelectedClientId(clientId);
      window.localStorage.setItem(ACTIVE_CLIENT_STORAGE_KEY, clientId);

      const params = new URLSearchParams(searchParams.toString());
      params.set("client", clientId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const value = useMemo(
    () => ({
      activeClient,
      availableClients,
      selectClient,
      selectedClientId
    }),
    [activeClient, availableClients, selectClient, selectedClientId]
  );

  return (
    <ActiveClientContext.Provider value={value}>
      {children}
    </ActiveClientContext.Provider>
  );
}

export function useActiveClientContext() {
  const context = useContext(ActiveClientContext);

  if (!context) {
    throw new Error(
      "useActiveClientContext must be used within ActiveClientProvider"
    );
  }

  return context;
}
