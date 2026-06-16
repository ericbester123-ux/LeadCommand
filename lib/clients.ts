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
    id: "client-estates-demo",
    agentName: "Estates Elevate Demo",
    brokerage: "Estates Elevate",
    locationName: "Main Demo Location",
    ghlLocationId: "demo-location",
    market: "Los Angeles",
    status: "Connected",
    lastSync: "Live test passed"
  },
  {
    id: "client-westside",
    agentName: "Westside Realty Team",
    brokerage: "Westside Realty",
    locationName: "Buyer Leads - Westside",
    ghlLocationId: "pending-location",
    market: "Santa Monica",
    status: "Needs Setup",
    lastSync: "Awaiting GHL token"
  },
  {
    id: "client-luxury",
    agentName: "Luxury Listings Group",
    brokerage: "Luxury Listings Group",
    locationName: "Seller Campaigns",
    ghlLocationId: "pending-location",
    market: "Beverly Hills",
    status: "Needs Setup",
    lastSync: "Awaiting GHL token"
  }
];

export const defaultClientProfile = clientProfiles[0];

export function getClientProfile(clientId?: string) {
  return (
    clientProfiles.find((client) => client.id === clientId) ??
    defaultClientProfile
  );
}
