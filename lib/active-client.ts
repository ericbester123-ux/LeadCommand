import type { ClientProfile } from "@/lib/clients";
import { defaultClientProfile } from "@/lib/clients";

export const ACTIVE_CLIENT_STORAGE_KEY = "leadcommand-active-client";

export function resolveActiveClientId(
  urlClientId: string | null,
  serverClientId: string | undefined,
  savedClientId: string | null,
  availableClients: ClientProfile[]
) {
  const validClientIds = new Set(availableClients.map((client) => client.id));

  if (urlClientId && validClientIds.has(urlClientId)) {
    return urlClientId;
  }

  if (
    serverClientId &&
    serverClientId !== defaultClientProfile.id &&
    validClientIds.has(serverClientId)
  ) {
    return serverClientId;
  }

  if (savedClientId && validClientIds.has(savedClientId)) {
    return savedClientId;
  }

  return availableClients[0]?.id ?? defaultClientProfile.id;
}

export function resolveClientProfile(
  clientId: string | undefined,
  availableClients: ClientProfile[]
) {
  return (
    availableClients.find((client) => client.id === clientId) ??
    defaultClientProfile
  );
}
