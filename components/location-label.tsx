"use client";

import { MapPin } from "lucide-react";
import { useActiveClientContext } from "@/components/active-client-provider";

export function LocationLabel() {
  const { activeClient } = useActiveClientContext();

  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-muted">
      <MapPin className="shrink-0 text-gold" size={14} />
      <span className="truncate">
        Viewing{" "}
        <span className="font-medium text-white">{activeClient.locationName}</span>
      </span>
    </div>
  );
}
