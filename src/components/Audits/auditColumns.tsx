import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { Progress } from "@/components/ui/progress"
import type { AuditRunPublic } from "@/types/audit"
import { AuditStatus } from "@/types/audit"
import { AuditStatusBadge } from "./AuditStatusBadge"

function formatDate(date: string | null): string {
  if (!date) return "Not started"
  const d = new Date(date)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(d)
}

function formatDuration(
  startedAt: string | null,
  finishedAt: string | null,
): string {
  if (!startedAt) return "-"
  if (!finishedAt) return "In progress"

  const start = new Date(startedAt)
  const end = new Date(finishedAt)
  const durationMs = end.getTime() - start.getTime()
  const durationSec = Math.floor(durationMs / 1000)

  if (durationSec < 60) return `${durationSec}s`
  if (durationSec < 3600)
    return `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`
  return `${Math.floor(durationSec / 3600)}h ${Math.floor((durationSec % 3600) / 60)}m`
}

export function createAuditColumns(
  projectId: string,
): ColumnDef<AuditRunPublic>[] {
  return [
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <Link
          to="/projects/$projectId/audits/$auditId"
          params={{ projectId, auditId: row.original.id }}
          className="font-medium hover:underline"
        >
          {formatDate(row.original.created_at)}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <AuditStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "progress_pct",
      header: "Progress",
      cell: ({ row }) => {
        const isInProgress = [
          AuditStatus.QUEUED,
          AuditStatus.CRAWLING,
          AuditStatus.RENDERING,
          AuditStatus.ANALYZING,
          AuditStatus.DIFFING,
        ].includes(row.original.status)

        if (!isInProgress)
          return <span className="text-sm text-muted-foreground">-</span>

        return (
          <div className="flex items-center gap-2">
            <Progress value={row.original.progress_pct} className="w-24" />
            <span className="text-sm text-muted-foreground">
              {Math.round(row.original.progress_pct)}%
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "stats",
      header: "Pages",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.stats?.total_pages?.toLocaleString() || "-"}
        </span>
      ),
    },
    {
      accessorKey: "stats.total_issues",
      header: "Issues",
      cell: ({ row }) => {
        const stats = row.original.stats
        if (!stats?.total_issues) {
          return <span className="text-sm text-muted-foreground">-</span>
        }

        return (
          <div className="flex items-center gap-2 text-sm">
            {stats.issues_critical > 0 && (
              <span className="text-red-600 font-medium">
                {stats.issues_critical} C
              </span>
            )}
            {stats.issues_high > 0 && (
              <span className="text-orange-600 font-medium">
                {stats.issues_high} H
              </span>
            )}
            {stats.issues_medium > 0 && (
              <span className="text-yellow-600 font-medium">
                {stats.issues_medium} M
              </span>
            )}
            {stats.issues_low > 0 && (
              <span className="text-blue-600 font-medium">
                {stats.issues_low} L
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "started_at",
      header: "Duration",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDuration(row.original.started_at, row.original.finished_at)}
        </span>
      ),
    },
  ]
}
