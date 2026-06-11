import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ title, value, detail, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-card p-5 shadow-gold">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-3 text-gold">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">{detail}</p>
    </div>
  );
}
