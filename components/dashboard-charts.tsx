"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { campaignMetrics } from "@/lib/data";

export function CampaignCharts() {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <div className="rounded-lg border border-white/10 bg-card p-5 xl:col-span-3">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Lead Momentum</h2>
          <p className="text-sm text-muted">New leads and booked appointments</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={campaignMetrics}>
              <defs>
                <linearGradient id="leadGold" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#d6d6d6" tickLine={false} />
              <YAxis stroke="#d6d6d6" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#111111",
                  border: "1px solid rgba(212,175,55,0.35)",
                  borderRadius: 8,
                  color: "#ffffff"
                }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#d4af37"
                fill="url(#leadGold)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="booked"
                stroke="#ffffff"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-card p-5 xl:col-span-2">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Ad Spend</h2>
          <p className="text-sm text-muted">Daily paid media pacing</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignMetrics}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#d6d6d6" tickLine={false} />
              <YAxis stroke="#d6d6d6" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#111111",
                  border: "1px solid rgba(212,175,55,0.35)",
                  borderRadius: 8,
                  color: "#ffffff"
                }}
              />
              <Bar dataKey="spend" fill="#d4af37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
