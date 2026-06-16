"use client";

import { useMemo, useRef, useState } from "react";
import { integrations } from "@/lib/integrations";

type FieldValues = Record<string, string>;

const defaults: Record<string, FieldValues> = {
  gohighlevel: {
    "Connection Mode": "Private Integration",
    "Location ID": "",
    "Private Integration Access Token": "",
    "API Version": "2021-07-28",
    "Webhook URL": "/api/webhooks/ghl",
    "Webhook Secret": "",
    "Pipeline ID": "",
    "Calendar ID": ""
  },
  "retell-ai": {
    "Connection Mode": "GHL Managed",
    "API Key": "",
    "Agent ID": "",
    "From Number": "",
    "Inbound Webhook URL": "/api/webhooks/retell",
    "Webhook Secret": ""
  },
  "meta-ads": {
    "Connection Mode": "GHL Lead Forms"
  },
  "calendar-sync": {
    "Connection Mode": "GHL Calendar"
  }
};

const statusStyles = {
  Connected: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  "Needs Setup": "border-gold/40 bg-gold/15 text-gold-hover",
  Optional: "border-white/15 bg-white/5 text-muted"
};

function isSecretField(field: string) {
  const normalized = field.toLowerCase();
  return (
    normalized.includes("key") ||
    normalized.includes("token") ||
    normalized.includes("secret")
  );
}

export function IntegrationSettings() {
  const configuratorRef = useRef<HTMLElement>(null);
  const [activeSlug, setActiveSlug] = useState(integrations[0]?.slug ?? "");
  const [values, setValues] = useState<Record<string, FieldValues>>(() =>
    integrations.reduce<Record<string, FieldValues>>((acc, integration) => {
      acc[integration.slug] = {
        ...Object.fromEntries(integration.fields.map((field) => [field, ""])),
        ...(defaults[integration.slug] ?? {})
      };
      return acc;
    }, {})
  );
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, string>>({});

  const activeIntegration = useMemo(
    () =>
      integrations.find((integration) => integration.slug === activeSlug) ??
      integrations[0],
    [activeSlug]
  );

  function updateValue(slug: string, field: string, value: string) {
    setValues((current) => ({
      ...current,
      [slug]: {
        ...(current[slug] ?? {}),
        [field]: value
      }
    }));
  }

  function openConfigurator(slug: string) {
    setActiveSlug(slug);

    window.requestAnimationFrame(() => {
      configuratorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      configuratorRef.current?.focus({ preventScroll: true });
    });
  }

  async function runAction(slug: string, action: "save" | "test") {
    setLoading((current) => ({ ...current, [slug]: action }));
    setMessages((current) => ({ ...current, [slug]: "" }));

    const response = await fetch(`/api/integrations/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, values: values[slug] ?? {} })
    });

    const result = (await response.json()) as { message?: string };

    setMessages((current) => ({
      ...current,
      [slug]: result.message ?? "Action completed."
    }));
    setLoading((current) => ({ ...current, [slug]: "" }));
  }

  if (!activeIntegration) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold text-white">Integrations</h2>
          <p className="text-sm text-muted">
            Configure the systems that power LeadCommand behind the scenes.
          </p>
        </div>
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {integrations.map((integration) => {
            const active = integration.slug === activeSlug;
            return (
              <article
                className={`rounded-lg border bg-white/[0.03] p-5 transition ${
                  active ? "border-gold/45" : "border-white/10"
                }`}
                key={integration.name}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-gold/25 bg-gold/10 p-3 text-gold">
                      <integration.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {integration.name}
                      </h3>
                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[integration.status]}`}
                      >
                        {integration.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {integration.description}
                </p>
                <button
                  aria-controls="integration-configurator"
                  aria-expanded={active}
                  className="mt-5 min-h-11 rounded-lg border border-gold/30 px-4 py-2 text-sm font-medium text-gold-hover transition hover:bg-gold/10"
                  onClick={() => openConfigurator(integration.slug)}
                  type="button"
                >
                  Configure
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="rounded-lg border border-white/10 bg-card"
        id="integration-configurator"
        ref={configuratorRef}
        tabIndex={-1}
      >
        <div className="border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold text-white">
            Configure {activeIntegration.name}
          </h2>
          <p className="text-sm leading-6 text-muted">
            {activeIntegration.adminNote}
          </p>
        </div>

        <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
          <div
            aria-label="Integration configuration tabs"
            className="flex gap-2 overflow-x-auto border-b border-white/10 p-4 lg:block lg:space-y-2 lg:border-b-0 lg:border-r"
            role="tablist"
          >
            {integrations.map((integration) => {
              const active = integration.slug === activeSlug;
              return (
                <button
                  aria-controls={`panel-${integration.slug}`}
                  aria-selected={active}
                  className={`flex min-h-12 min-w-[180px] items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition lg:w-full ${
                    active
                      ? "bg-gold text-black"
                      : "border border-white/10 text-muted hover:border-gold/35 hover:text-gold-hover"
                  }`}
                  id={`tab-${integration.slug}`}
                  key={integration.slug}
                  onClick={() => setActiveSlug(integration.slug)}
                  role="tab"
                  type="button"
                >
                  <integration.icon size={18} />
                  <span>{integration.name}</span>
                </button>
              );
            })}
          </div>

          <div
            aria-labelledby={`tab-${activeIntegration.slug}`}
            className="p-5"
            id={`panel-${activeIntegration.slug}`}
            role="tabpanel"
          >
            {activeIntegration.slug === "retell-ai" ? (
              <div className="mb-5 rounded-lg border border-gold/25 bg-gold/10 p-4 text-sm leading-6 text-gold-hover">
                Recommended: keep Retell managed in GHL first. A direct Retell
                API connection is only needed if LeadCommand must receive raw
                Retell webhooks, transcripts, recordings, or call analysis.
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              {activeIntegration.fields.map((field) => (
                <label className="block text-sm text-muted" key={field}>
                  {field}
                  {field === "Connection Mode" ? (
                    <select
                      className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-gold"
                      onChange={(event) =>
                        updateValue(
                          activeIntegration.slug,
                          field,
                          event.target.value
                        )
                      }
                      value={values[activeIntegration.slug]?.[field] ?? ""}
                    >
                      {activeIntegration.slug === "retell-ai" ? (
                        <>
                          <option>GHL Managed</option>
                          <option>Direct Retell API</option>
                        </>
                      ) : activeIntegration.slug === "gohighlevel" ? (
                        <>
                          <option>Private Integration</option>
                          <option>OAuth App</option>
                        </>
                      ) : activeIntegration.slug === "meta-ads" ? (
                        <>
                          <option>GHL Lead Forms</option>
                          <option>Direct Meta API</option>
                        </>
                      ) : (
                        <>
                          <option>GHL Calendar</option>
                          <option>Manual Calendar Feed</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <input
                      className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-muted/60 focus:border-gold"
                      onChange={(event) =>
                        updateValue(
                          activeIntegration.slug,
                          field,
                          event.target.value
                        )
                      }
                      placeholder={`Enter ${field.toLowerCase()}`}
                      type={isSecretField(field) ? "password" : "text"}
                      value={values[activeIntegration.slug]?.[field] ?? ""}
                    />
                  )}
                </label>
              ))}
            </div>

            {messages[activeIntegration.slug] ? (
              <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">
                {messages[activeIntegration.slug]}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                className="min-h-11 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
                disabled={Boolean(loading[activeIntegration.slug])}
                onClick={() => runAction(activeIntegration.slug, "save")}
                type="button"
              >
                {loading[activeIntegration.slug] === "save"
                  ? "Saving..."
                  : "Save Configuration"}
              </button>
              <button
                className="min-h-11 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-muted transition hover:border-gold/30 hover:text-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
                disabled={Boolean(loading[activeIntegration.slug])}
                onClick={() => runAction(activeIntegration.slug, "test")}
                type="button"
              >
                {loading[activeIntegration.slug] === "test"
                  ? "Testing..."
                  : "Test Connection"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
