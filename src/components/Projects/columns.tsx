import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "@tanstack/react-router"

import type { ProjectPublic } from "@/types/project"
import { ProjectActionsMenu } from "./ProjectActionsMenu"

function formatDate(date: string | null): string {
  if (!date) return "Never"
  const d = new Date(date)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export const columns: ColumnDef<ProjectPublic>[] = [
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => (
      <Link
        to="/projects/$projectId"
        params={{ projectId: row.original.id }}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "seed_url",
    header: "Seed URL",
    cell: ({ row }) => (
      <a
        href={row.original.seed_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline max-w-xs truncate block"
      >
        {row.original.seed_url}
      </a>
    ),
  },
  {
    accessorKey: "last_audit_at",
    header: "Last Audit",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.last_audit_at)}
      </span>
    ),
  },
  {
    accessorKey: "last_gsc_sync_at",
    header: "Last GSC Sync",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.last_gsc_sync_at)}
      </span>
    ),
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.updated_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ProjectActionsMenu project={row.original} />
      </div>
    ),
  },
]
