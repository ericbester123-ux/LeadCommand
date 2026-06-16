"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const periods = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" }
];

type ReportPeriodFilterProps = {
  activePeriod: string;
};

export function ReportPeriodFilter({ activePeriod }: ReportPeriodFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function changePeriod(period: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-card p-4">
      <div>
        <h2 className="font-semibold text-white">Reporting Period</h2>
        <p className="text-sm text-muted">Filter dashboard totals and charts.</p>
      </div>
      <div className="inline-flex rounded-lg border border-white/10 bg-black p-1">
        {periods.map((period) => {
          const active = period.value === activePeriod;
          return (
            <button
              className={`min-h-10 rounded-md px-4 text-sm font-medium transition ${
                active
                  ? "bg-gold text-black"
                  : "text-muted hover:text-gold-hover"
              }`}
              key={period.value}
              onClick={() => changePeriod(period.value)}
              type="button"
            >
              {period.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
