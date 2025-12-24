import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  AlertCircle,
  ArrowLeft,
  Download,
  FileSearch,
  FileText,
} from "lucide-react"
import { Suspense } from "react"

import { AuditsService } from "@/services/audits"
import { AuditStatusBadge } from "@/components/Audits/AuditStatusBadge"
import { IssueSeverityBadge } from "@/components/Audits/IssueSeverityBadge"
import { DataTable } from "@/components/Common/DataTable"
import { issueColumns } from "@/components/Audits/issueColumns"
import { pageColumns } from "@/components/Audits/pageColumns"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuditStatus, IssueSeverity } from "@/types/audit"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/audits/$auditId/"
)({
  component: AuditDetail,
})

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

interface SummaryCardProps {
  title: string
  count: number
  severity?: IssueSeverity
  icon: React.ReactNode
}

function SummaryCard({ title, count, severity, icon }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count.toLocaleString()}</div>
        {severity && (
          <div className="mt-2">
            <IssueSeverityBadge severity={severity} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AuditDetailContent() {
  const { projectId, auditId } = Route.useParams()

  const { data: audit, isLoading: auditLoading } = useQuery({
    queryKey: ["audits", projectId, auditId],
    queryFn: () => AuditsService.getAudit({ projectId, auditId }),
    refetchInterval: (query) => {
      // Auto-refresh every 5s if audit is still running
      const isRunning = query.state.data
        ? [
            AuditStatus.QUEUED,
            AuditStatus.CRAWLING,
            AuditStatus.RENDERING,
            AuditStatus.ANALYZING,
            AuditStatus.DIFFING,
          ].includes(query.state.data.status)
        : false
      return isRunning ? 5000 : false
    },
  })

  const { data: issues, isLoading: issuesLoading } = useQuery({
    queryKey: ["audits", projectId, auditId, "issues"],
    queryFn: () =>
      AuditsService.getAuditIssues({ projectId, auditId, skip: 0, limit: 50 }),
    enabled: !!audit && audit.status === AuditStatus.COMPLETED,
  })

  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ["audits", projectId, auditId, "pages"],
    queryFn: () =>
      AuditsService.getAuditPages({ projectId, auditId, skip: 0, limit: 50 }),
    enabled: !!audit && audit.status === AuditStatus.COMPLETED,
  })

  if (auditLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Audit not found</h2>
        <p className="text-muted-foreground">
          The audit you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-4">
          <Link to="/projects/$projectId/audits" params={{ projectId }}>
            Back to Audits
          </Link>
        </Button>
      </div>
    )
  }

  const stats = audit.stats

  const handleExport = () => {
    const url = AuditsService.getExportIssuesUrl(projectId, auditId)
    window.open(url, "_blank")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/projects/$projectId/audits" params={{ projectId }}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to audits</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Audit Results
            </h1>
            <AuditStatusBadge status={audit.status} />
          </div>
          <p className="text-sm text-muted-foreground ml-12">
            Created {formatDate(audit.created_at)}
          </p>
          {audit.error_message && (
            <div className="ml-12 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{audit.error_message}</p>
            </div>
          )}
        </div>
        {audit.status === AuditStatus.COMPLETED && (
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Critical Issues"
            count={stats.issues_critical}
            severity={IssueSeverity.CRITICAL}
            icon={<AlertCircle className="h-4 w-4 text-red-600" />}
          />
          <SummaryCard
            title="High Issues"
            count={stats.issues_high}
            severity={IssueSeverity.HIGH}
            icon={<AlertCircle className="h-4 w-4 text-orange-600" />}
          />
          <SummaryCard
            title="Medium Issues"
            count={stats.issues_medium}
            severity={IssueSeverity.MEDIUM}
            icon={<AlertCircle className="h-4 w-4 text-yellow-600" />}
          />
          <SummaryCard
            title="Low Issues"
            count={stats.issues_low}
            severity={IssueSeverity.LOW}
            icon={<AlertCircle className="h-4 w-4 text-blue-600" />}
          />
        </div>
      )}

      {audit.status === AuditStatus.COMPLETED && (
        <Tabs defaultValue="issues" className="w-full">
          <TabsList>
            <TabsTrigger value="issues">
              <FileSearch className="mr-2 h-4 w-4" />
              Issues ({stats?.total_issues || 0})
            </TabsTrigger>
            <TabsTrigger value="pages">
              <FileText className="mr-2 h-4 w-4" />
              Pages ({stats?.total_pages || 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="issues" className="mt-6">
            {issuesLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : issues && issues.data.length > 0 ? (
              <div className="space-y-4">
                <DataTable columns={issueColumns} data={issues.data} />
                {issues.count > 50 && (
                  <div className="flex justify-center">
                    <Button variant="outline" asChild>
                      <Link
                        to="/projects/$projectId/audits/$auditId/issues"
                        params={{ projectId, auditId }}
                      >
                        View All Issues ({issues.count})
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No issues found</h3>
                <p className="text-muted-foreground">
                  Great job! This audit didn't find any SEO issues.
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="pages" className="mt-6">
            {pagesLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : pages && pages.data.length > 0 ? (
              <div className="space-y-4">
                <DataTable columns={pageColumns} data={pages.data} />
                {pages.count > 50 && (
                  <div className="flex justify-center">
                    <Button variant="outline" asChild>
                      <Link
                        to="/projects/$projectId/audits/$auditId/pages"
                        params={{ projectId, auditId }}
                      >
                        View All Pages ({pages.count})
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No pages crawled</h3>
                <p className="text-muted-foreground">
                  This audit didn't crawl any pages.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {audit.status !== AuditStatus.COMPLETED &&
        audit.status !== AuditStatus.FAILED && (
          <Card>
            <CardHeader>
              <CardTitle>Audit in Progress</CardTitle>
              <CardDescription>
                {audit.progress_message || "Processing..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(audit.progress_pct)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${audit.progress_pct}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}

function AuditDetail() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      }
    >
      <AuditDetailContent />
    </Suspense>
  )
}
