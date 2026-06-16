import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminApiAccess } from "@/lib/admin-api";

type SaveRequest = {
  slug?: string;
  values?: Record<string, string>;
};

const secretWords = ["key", "token", "secret"];

function isSecretField(field: string) {
  return secretWords.some((word) => field.toLowerCase().includes(word));
}

function fieldKey(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export async function POST(request: Request) {
  const accessError = await requireAdminApiAccess();
  if (accessError) {
    return accessError;
  }

  const body = (await request.json()) as SaveRequest;

  if (!body.slug || !body.values) {
    return NextResponse.json(
      { message: "Missing integration details." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      message:
        "Configuration accepted for this session. Add SUPABASE_SERVICE_ROLE_KEY to persist integration settings securely."
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const connectionMode = body.values["Connection Mode"] || null;
  const webhookUrl =
    body.values["Webhook URL"] || body.values["Inbound Webhook URL"] || null;

  const { data: integration, error: integrationError } = await supabase
    .from("integrations")
    .upsert(
      {
        slug: body.slug,
        name: body.slug,
        provider: body.slug,
        status: "configured",
        connection_mode: connectionMode,
        webhook_url: webhookUrl,
        updated_at: new Date().toISOString()
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (integrationError || !integration) {
    return NextResponse.json(
      { message: integrationError?.message ?? "Could not save integration." },
      { status: 500 }
    );
  }

  const credentials = Object.entries(body.values).map(([label, value]) => {
    const isSecret = isSecretField(label);
    return {
      integration_id: integration.id,
      field_key: fieldKey(label),
      field_label: label,
      field_value: isSecret && value ? "configured" : value,
      is_secret: isSecret,
      updated_at: new Date().toISOString()
    };
  });

  const { error } = await supabase.from("integration_credentials").upsert(
    credentials,
    {
      onConflict: "integration_id,field_key"
    },
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Configuration saved securely."
  });
}
