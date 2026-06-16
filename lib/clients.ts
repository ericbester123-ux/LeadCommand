export type ClientProfile = {
  id: string;
  agentName: string;
  brokerage: string;
  locationName: string;
  ghlLocationId: string;
  market: string;
  status: "Connected" | "Needs Setup";
  lastSync: string;
};

export const clientProfiles: ClientProfile[] = [
  {
    id: "client-eric-trst",
    agentName: "Eric Trst",
    brokerage: "Estates Elevate",
    locationName: "Eric Trst",
    ghlLocationId: "",
    market: "",
    status: "Needs Setup",
    lastSync: "Awaiting integration setup"
  }
];

export const defaultClientProfile = clientProfiles[0];

export function getClientProfile(clientId?: string) {
  return (
    clientProfiles.find((client) => client.id === clientId) ??
    defaultClientProfile
  );
}
