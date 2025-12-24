import type { ColumnDef } from "@tanstack/react-table"
import type { AuditIssuePublic } from "@/types/audit"
import { IssueSeverityBadge } from "./IssueSeverityBadge"
import { Badge } from "@/components/ui/badge"

// Helper to format issue type for display
function formatIssueType(issueType: string): string {
  return issueType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const issueColumns: ColumnDef<AuditIssuePublic>[] = [
  {
    accessorKey: "page_url",
    header: "Page URL",
    cell: ({ row }) => (
      <div className="max-w-md truncate" title={row.original.page_url}>
        <a
          href={row.original.page_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {row.original.page_url}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "issue_type",
    header: "Issue Type",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {formatIssueType(row.original.issue_type)}
      </span>
    ),
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => <IssueSeverityBadge severity={row.original.severity} />,
  },
  {
    accessorKey: "is_new",
    header: "Status",
    cell: ({ row }) =>
      row.original.is_new ? (
        <Badge variant="default" className="bg-blue-600">
          New
        </Badge>
      ) : (
        <Badge variant="outline">Existing</Badge>
      ),
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <div className="max-w-xs truncate text-sm text-muted-foreground">
        {JSON.stringify(row.original.details)}
      </div>
    ),
  },
]
