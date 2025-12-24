import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { FileSearch, Play } from "lucide-react"
import { Suspense } from "react"
import { createAuditColumns } from "@/components/Audits/auditColumns"
import { DataTable } from "@/components/Common/DataTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import useCustomToast from "@/hooks/useCustomToast"
import { AuditsService } from "@/services/audits"
import { AuditStatus } from "@/types/audit"

export const Route = createFileRoute("/_layout/projects/$projectId/audits/")({
  component: Audits,
  head: () => ({
    meta: [
      {
        title: "Audits - SEO Platform",
      },
    ],
  }),
})

function AuditsContent() {
  const { projectId } = Route.useParams()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const queryClient = useQueryClient()

  const { data: audits, isLoading } = useQuery({
    queryKey: ["audits", projectId],
    queryFn: () => AuditsService.listAudits({ projectId, skip: 0, limit: 100 }),
    refetchInterval: (query) => {
      // Auto-refresh every 5s if there are any running audits
      const hasRunningAudits = query.state.data?.data.some((audit) =>
        [
          AuditStatus.QUEUED,
          AuditStatus.CRAWLING,
          AuditStatus.RENDERING,
          AuditStatus.ANALYZING,
          AuditStatus.DIFFING,
        ].includes(audit.status),
      )
      return hasRunningAudits ? 5000 : false
    },
  })

  const startAuditMutation = useMutation({
    mutationFn: () => AuditsService.startAudit({ projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits", projectId] })
      showSuccessToast("Your audit has been queued and will start shortly.")
    },
    onError: (error: any) => {
      showErrorToast(
        error.message || "An error occurred while starting the audit.",
      )
    },
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!audits || audits.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileSearch className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No audits yet</h3>
        <p className="text-muted-foreground mb-4">
          Run your first audit to identify technical SEO issues
        </p>
        <Button
          onClick={() => startAuditMutation.mutate()}
          disabled={startAuditMutation.isPending}
        >
          <Play className="mr-2 h-4 w-4" />
          {startAuditMutation.isPending ? "Starting..." : "Run Audit"}
        </Button>
      </div>
    )
  }

  return (
    <DataTable columns={createAuditColumns(projectId)} data={audits.data} />
  )
}

function Audits() {
  const { projectId } = Route.useParams()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const queryClient = useQueryClient()

  const startAuditMutation = useMutation({
    mutationFn: () => AuditsService.startAudit({ projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits", projectId] })
      showSuccessToast("Your audit has been queued and will start shortly.")
    },
    onError: (error: any) => {
      showErrorToast(
        error.message || "An error occurred while starting the audit.",
      )
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site Audits</h1>
          <p className="text-muted-foreground">
            Crawl your site and identify technical SEO issues
          </p>
        </div>
        <Button
          onClick={() => startAuditMutation.mutate()}
          disabled={startAuditMutation.isPending}
        >
          <Play className="mr-2 h-4 w-4" />
          {startAuditMutation.isPending ? "Starting..." : "Run Audit"}
        </Button>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <AuditsContent />
      </Suspense>
    </div>
  )
}
