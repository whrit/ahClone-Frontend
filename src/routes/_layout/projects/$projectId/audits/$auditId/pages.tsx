import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, Filter } from "lucide-react"
import { useState } from "react"
import { pageColumns } from "@/components/Audits/pageColumns"
import { DataTable } from "@/components/Common/DataTable"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { AuditsService } from "@/services/audits"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/audits/$auditId/pages",
)({
  component: AuditPages,
})

function AuditPages() {
  const { projectId, auditId } = Route.useParams()
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined)
  const [isRendered, setIsRendered] = useState<boolean | undefined>(undefined)

  const { data: pages, isLoading } = useQuery({
    queryKey: ["audits", projectId, auditId, "pages", statusCode, isRendered],
    queryFn: () =>
      AuditsService.getAuditPages({
        projectId,
        auditId,
        skip: 0,
        limit: 1000,
        statusCode,
        isRendered,
      }),
  })

  const handleClearFilters = () => {
    setStatusCode(undefined)
    setIsRendered(undefined)
  }

  const hasActiveFilters = statusCode || isRendered !== undefined

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link
                to="/projects/$projectId/audits/$auditId"
                params={{ projectId, auditId }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to audit</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">All Pages</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-12">
            {pages ? `${pages.count} total pages crawled` : "Loading..."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-muted/20">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-xs">
              Status Code
            </Label>
            <Select
              value={statusCode?.toString() || "all"}
              onValueChange={(value) =>
                setStatusCode(value === "all" ? undefined : parseInt(value, 10))
              }
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All status codes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status codes</SelectItem>
                <SelectItem value="200">200 - OK</SelectItem>
                <SelectItem value="301">301 - Moved Permanently</SelectItem>
                <SelectItem value="302">302 - Found</SelectItem>
                <SelectItem value="404">404 - Not Found</SelectItem>
                <SelectItem value="500">500 - Server Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rendered-filter" className="text-xs">
              JavaScript Rendering
            </Label>
            <Select
              value={
                isRendered === undefined
                  ? "all"
                  : isRendered
                    ? "rendered"
                    : "not-rendered"
              }
              onValueChange={(value) =>
                setIsRendered(
                  value === "all" ? undefined : value === "rendered",
                )
              }
            >
              <SelectTrigger id="rendered-filter">
                <SelectValue placeholder="All pages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pages</SelectItem>
                <SelectItem value="rendered">Rendered only</SelectItem>
                <SelectItem value="not-rendered">Not rendered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : pages && pages.data.length > 0 ? (
        <DataTable columns={pageColumns} data={pages.data} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
          <h3 className="text-lg font-semibold">No pages found</h3>
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? "Try adjusting your filters to see more results."
              : "No pages were crawled in this audit."}
          </p>
        </div>
      )}
    </div>
  )
}
