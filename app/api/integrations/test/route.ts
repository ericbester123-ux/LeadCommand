import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";

type TestRequest = {
  slug?: string;
  values?: Record<string, string>;
};

function value(values: Record<string, string>, key: string, fallback?: string) {
  return values[key]?.trim() || fallback || "";
}

async function testGoHighLevel(values: Record<string, string>) {
  const apiKey = value(
    values,
    "Private Integration Access Token",
    process.env.GHL_API_KEY
  );
  const locationId = value(values, "Location ID", process.env.GHL_LOCATION_ID);
  const apiVersion = value(
    values,
    "API Version",
    process.env.GHL_API_VERSION ?? "2021-07-28"
  );

  if (!apiKey || !locationId) {
    return {
      ok: false,
      message: "Add a GHL API key and Location ID before testing."
    };
  }

  const response = await fetch(
    `https://services.leadconnectorhq.com/locations/${locationId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: apiVersion,
        Accept: "application/json"
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return {
      ok: false,
      message: `GHL rejected the connection test with status ${response.status}. Check the API key, Location ID, and app permissions.`
    };
  }

  return {
    ok: true,
    message: "GHL connection test passed. LeadCommand can reach this location."
  };
}

async function testRetell(values: Record<string, string>) {
  const mode = value(values, "Connection Mode", "GHL Managed");

  if (mode === "GHL Managed") {
    return {
      ok: true,
      message:
        "Retell is set to GHL Managed. No direct Retell API connection is needed while calls and outcomes are handled in GHL."
    };
  }

  const apiKey = value(values, "API Key", process.env.RETELL_API_KEY);
  const agentId = value(values, "Agent ID", process.env.RETELL_AGENT_ID);

  if (!apiKey || !agentId) {
    return {
      ok: false,
      message: "Add a Retell API key and Agent ID for direct Retell testing."
    };
  }

  const response = await fetch(`https://api.retellai.com/v2/get-agent/${agentId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      ok: false,
      message: `Retell rejected the direct API test with status ${response.status}. If Retell is already managed in GHL, keep Connection Mode as GHL Managed.`
    };
  }

  return {
    ok: true,
    message: "Direct Retell connection test passed."
  };
}

export async function POST(request: Request) {
  const accessError = await requireAdminApiAccess();
  if (accessError) {
    return accessError;
  }

  const body = (await request.json()) as TestRequest;
  const values = body.values ?? {};

  if (body.slug === "gohighlevel") {
    const result = await testGoHighLevel(values);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.slug === "retell-ai") {
    const result = await testRetell(values);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  return NextResponse.json({
    ok: true,
    message:
      "This integration does not have a live API test yet. Save the configuration and connect it during the next integration phase."
  });
}
