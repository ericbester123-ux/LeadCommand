import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SaveRequest = {
  slug?: string;
  values?: Record<string, string>;
};

const secretWords = ["key", "token", "secret"];

function maskConfig(values: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      const isSecret = secretWords.some((word) =>
        key.toLowerCase().includes(word)
      );
      return [key, isSecret && value ? "configured" : value];
    })
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as SaveRequest;

  if (!body.slug || !body.values) {
    return NextResponse.json(
      { message: "Missing integration details." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const config = maskConfig(body.values);

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      message:
        "Configuration accepted for this session. Add SUPABASE_SERVICE_ROLE_KEY to persist integration settings securely."
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase.from("integrations").upsert(
    {
      name: body.slug,
      status: "Configured",
      config,
      updated_at: new Date().toISOString()
    },
    { onConflict: "name" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Configuration saved securely."
  });
}
