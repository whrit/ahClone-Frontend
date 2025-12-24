import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, XCircle } from "lucide-react"
import type { CrawledPagePublic } from "@/types/audit"

function getStatusColor(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return "text-green-600"
  if (statusCode >= 300 && statusCode < 400) return "text-yellow-600"
  if (statusCode >= 400 && statusCode < 500) return "text-orange-600"
  if (statusCode >= 500) return "text-red-600"
  return "text-gray-600"
}

export const pageColumns: ColumnDef<CrawledPagePublic>[] = [
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <div className="max-w-md truncate" title={row.original.url}>
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {row.original.url}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "status_code",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`text-sm font-medium ${getStatusColor(row.original.status_code)}`}
      >
        {row.original.status_code}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div
        className="max-w-xs truncate text-sm"
        title={row.original.title || undefined}
      >
        {row.original.title || (
          <span className="text-muted-foreground">No title</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "word_count",
    header: "Words",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.word_count?.toLocaleString() || "-"}
      </span>
    ),
  },
  {
    accessorKey: "response_time_ms",
    header: "Response Time",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.response_time_ms
          ? `${row.original.response_time_ms}ms`
          : "-"}
      </span>
    ),
  },
  {
    accessorKey: "is_rendered",
    header: "Rendered",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.is_rendered ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-gray-400" />
        )}
      </div>
    ),
  },
]
