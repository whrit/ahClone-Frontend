import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, Download, Filter } from "lucide-react"
import { useState } from "react"
import { issueColumns } from "@/components/Audits/issueColumns"
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
import { IssueSeverity, IssueType } from "@/types/audit"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/audits/$auditId/issues",
)({
  component: AuditIssues,
})

function AuditIssues() {
  const { projectId, auditId } = Route.useParams()
  const [severity, setSeverity] = useState<IssueSeverity | undefined>(undefined)
  const [issueType, setIssueType] = useState<IssueType | undefined>(undefined)
  const [isNew, setIsNew] = useState<boolean | undefined>(undefined)

  const { data: issues, isLoading } = useQuery({
    queryKey: [
      "audits",
      projectId,
      auditId,
      "issues",
      severity,
      issueType,
      isNew,
    ],
    queryFn: () =>
      AuditsService.getAuditIssues({
        projectId,
        auditId,
        skip: 0,
        limit: 1000,
        severity,
        issueType,
        isNew,
      }),
  })

  const handleExport = () => {
    const url = AuditsService.getExportIssuesUrl(projectId, auditId, {
      severity,
      issueType,
      isNew,
    })
    window.open(url, "_blank")
  }

  const handleClearFilters = () => {
    setSeverity(undefined)
    setIssueType(undefined)
    setIsNew(undefined)
  }

  const hasActiveFilters = severity || issueType || isNew !== undefined

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
            <h1 className="text-2xl font-bold tracking-tight">All Issues</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-12">
            {issues ? `${issues.count} total issues` : "Loading..."}
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={!issues}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-muted/20">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="severity-filter" className="text-xs">
              Severity
            </Label>
            <Select
              value={severity || "all"}
              onValueChange={(value) =>
                setSeverity(
                  value === "all" ? undefined : (value as IssueSeverity),
                )
              }
            >
              <SelectTrigger id="severity-filter">
                <SelectValue placeholder="All severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value={IssueSeverity.CRITICAL}>Critical</SelectItem>
                <SelectItem value={IssueSeverity.HIGH}>High</SelectItem>
                <SelectItem value={IssueSeverity.MEDIUM}>Medium</SelectItem>
                <SelectItem value={IssueSeverity.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type-filter" className="text-xs">
              Issue Type
            </Label>
            <Select
              value={issueType || "all"}
              onValueChange={(value) =>
                setIssueType(value === "all" ? undefined : (value as IssueType))
              }
            >
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.values(IssueType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type
                      .split("_")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-filter" className="text-xs">
              Status
            </Label>
            <Select
              value={isNew === undefined ? "all" : isNew ? "new" : "existing"}
              onValueChange={(value) =>
                setIsNew(value === "all" ? undefined : value === "new")
              }
            >
              <SelectTrigger id="new-filter">
                <SelectValue placeholder="All issues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All issues</SelectItem>
                <SelectItem value="new">New only</SelectItem>
                <SelectItem value="existing">Existing only</SelectItem>
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
      ) : issues && issues.data.length > 0 ? (
        <DataTable columns={issueColumns} data={issues.data} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
          <h3 className="text-lg font-semibold">No issues found</h3>
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? "Try adjusting your filters to see more results."
              : "This audit didn't find any issues."}
          </p>
        </div>
      )}
    </div>
  )
}
