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
    id: "client-demo",
    agentName: "Client Demo",
    brokerage: "Estates Elevate",
    locationName: "Client Demo Location",
    ghlLocationId: "demo-location",
    market: "Luxury Buyer & Seller Leads",
    status: "Connected",
    lastSync: "Demo data ready"
  },
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
