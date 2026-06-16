"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Flame, PhoneCall } from "lucide-react";

const notifications = [
  {
    icon: Flame,
    title: "Hot lead detected",
    detail: "A lead reached high-intent status and needs quick review.",
    time: "Just now"
  },
  {
    icon: PhoneCall,
    title: "AI call completed",
    detail: "A new call summary is ready in AI Caller.",
    time: "12 min ago"
  },
  {
    icon: CheckCircle2,
    title: "Appointment booked",
    detail: "A consult was added to the appointment view.",
    time: "Today"
  }
];

export function NotificationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label="Notifications"
        className="relative min-h-11 min-w-11 rounded-lg border border-white/10 p-2 text-muted transition hover:border-gold/40 hover:text-gold-hover"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Bell size={20} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(88vw,360px)] rounded-lg border border-white/10 bg-card p-3 shadow-2xl">
          <div className="border-b border-white/10 px-2 pb-3">
            <p className="font-semibold text-white">Notifications</p>
            <p className="mt-1 text-xs text-muted">
              Important lead and appointment activity.
            </p>
          </div>
          <div className="mt-3 space-y-2">
            {notifications.map((notification) => (
              <article
                className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                key={notification.title}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border border-gold/25 bg-gold/10 p-2 text-gold">
                    <notification.icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted">
                        {notification.time}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      {notification.detail}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
