"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import type { Lead, LeadStatus } from "@/lib/types";

const columnHelper = createColumnHelper<Lead>();

const statusStyles: Record<LeadStatus, string> = {
  New: "border-white/15 bg-white/5 text-white",
  "AI Contacted": "border-blue-300/30 bg-blue-400/10 text-blue-100",
  Hot: "border-gold/40 bg-gold/15 text-gold-hover",
  Booked: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  "Needs Agent": "border-red-300/30 bg-red-400/10 text-red-100"
};

const columns = [
  columnHelper.accessor("name", {
    header: "Lead",
    cell: (info) => (
      <div>
        <p className="font-medium text-white">{info.getValue()}</p>
        <p className="text-xs text-muted">{info.row.original.id}</p>
      </div>
    )
  }),
  columnHelper.accessor("source", {
    header: "Source"
  }),
  columnHelper.accessor("neighborhood", {
    header: "Area"
  }),
  columnHelper.accessor("budget", {
    header: "Budget"
  }),
  columnHelper.accessor("score", {
    header: "Score",
    cell: (info) => (
      <span className="font-semibold text-gold-hover">{info.getValue()}</span>
    )
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[info.getValue()]}`}
      >
        {info.getValue()}
      </span>
    )
  }),
  columnHelper.accessor("nextAction", {
    header: "Next Action"
  })
];

type LeadsTableProps = {
  leads: Lead[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-card">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-lg font-semibold text-white">Priority Leads</h2>
        <p className="text-sm text-muted">
          Sorted by heat, AI outcome, and agent action required
        </p>
      </div>
      {leads.length ? (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-5 py-4 font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-white/10 transition hover:bg-gold/5"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4 text-muted">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="p-6 text-center">
          <p className="font-medium text-white">No leads yet</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Once this location starts receiving leads, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
