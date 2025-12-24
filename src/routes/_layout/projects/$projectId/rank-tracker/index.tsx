import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { RefreshCw, ExternalLink } from "lucide-react"
import { Suspense } from "react"
import { formatDistanceToNow } from "date-fns"

import { SerpService } from "@/services/serp"
import { PositionBadge } from "@/components/RankTracker/PositionBadge"
import { PositionChange } from "@/components/RankTracker/PositionChange"
import { AddKeywordDialog } from "@/components/RankTracker/AddKeywordDialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/rank-tracker/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Rank Tracker - SEO Platform",
      },
    ],
  }),
})

function RefreshButton({
  keywordId,
  projectId,
  disabled,
}: {
  keywordId: string
  projectId: string
  disabled?: boolean
}) {
  const queryClient = useQueryClient()

  const refreshMutation = useMutation({
    mutationFn: () =>
      SerpService.refreshKeyword({
        projectId,
        keywordId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rank-tracker", projectId] })
      toast.success("Keyword refresh queued")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to refresh keyword")
    },
  })

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => refreshMutation.mutate()}
      disabled={disabled || refreshMutation.isPending}
    >
      <RefreshCw
        className={`h-4 w-4 ${refreshMutation.isPending ? "animate-spin" : ""}`}
      />
    </Button>
  )
}

function RankTrackerContent() {
  const { projectId } = Route.useParams()
  const queryClient = useQueryClient()

  const { data: keywords, isLoading } = useQuery({
    queryKey: ["rank-tracker", projectId],
    queryFn: () =>
      SerpService.listKeywordTargets({
        projectId,
        limit: 100,
      }),
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  })

  const refreshAllMutation = useMutation({
    mutationFn: async () => {
      if (!keywords?.data) return

      // Trigger refresh for all active keywords
      const refreshPromises = keywords.data
        .filter((kw) => kw.is_active)
        .map((kw) =>
          SerpService.refreshKeyword({
            projectId,
            keywordId: kw.id,
          })
        )

      await Promise.allSettled(refreshPromises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rank-tracker", projectId] })
      toast.success("All keywords queued for refresh")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to refresh keywords")
    },
  })

  const handleAddKeyword = async (data: {
    keyword: string
    locale: string
    device: "desktop" | "mobile" | "tablet"
  }) => {
    await SerpService.createKeywordTarget({
      projectId,
      body: data,
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const hasKeywords = keywords?.data && keywords.data.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AddKeywordDialog projectId={projectId} onAddKeyword={handleAddKeyword} />
          <Button
            variant="outline"
            onClick={() => refreshAllMutation.mutate()}
            disabled={!hasKeywords || refreshAllMutation.isPending}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshAllMutation.isPending ? "animate-spin" : ""}`}
            />
            Refresh All
          </Button>
        </div>
        {hasKeywords && (
          <div className="text-sm text-muted-foreground">
            {keywords.count} keyword{keywords.count !== 1 ? "s" : ""} tracked
          </div>
        )}
      </div>

      {hasKeywords ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.data.map((keyword) => (
              <TableRow key={keyword.id}>
                <TableCell>
                  <Link
                    to="/projects/$projectId/rank-tracker/$keywordId"
                    params={{ projectId, keywordId: keyword.id }}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {keyword.keyword}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1">
                    {keyword.locale.toUpperCase()} • {keyword.search_engine}
                  </div>
                </TableCell>
                <TableCell>
                  <PositionBadge position={keyword.latest_position} />
                </TableCell>
                <TableCell>
                  <PositionChange change={keyword.position_change} />
                </TableCell>
                <TableCell>
                  {keyword.latest_position !== null && keyword.latest_position > 0 ? (
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(keyword.keyword)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors max-w-xs truncate"
                    >
                      <span className="truncate">
                        {new URL(
                          `https://www.google.com/search?q=${keyword.keyword}`
                        ).hostname}
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">--</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize">{keyword.device}</span>
                </TableCell>
                <TableCell>
                  {keyword.last_refresh_at ? (
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(keyword.last_refresh_at), {
                        addSuffix: true,
                      })}
                      {keyword.last_refresh_status && (
                        <div
                          className={`text-xs mt-1 ${
                            keyword.last_refresh_status === "success"
                              ? "text-green-600 dark:text-green-500"
                              : keyword.last_refresh_status === "failed"
                                ? "text-red-600 dark:text-red-500"
                                : "text-yellow-600 dark:text-yellow-500"
                          }`}
                        >
                          {keyword.last_refresh_status}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Never</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <RefreshButton
                    keywordId={keyword.id}
                    projectId={projectId}
                    disabled={!keyword.is_active}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12 border rounded-lg bg-muted/50">
          <div className="rounded-full bg-muted p-4 mb-4">
            <RefreshCw className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No keywords tracked yet</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            Start tracking keyword positions by adding your first keyword to monitor.
          </p>
          <AddKeywordDialog projectId={projectId} onAddKeyword={handleAddKeyword} />
        </div>
      )}
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rank Tracker</h1>
          <p className="text-muted-foreground">
            Monitor keyword positions in search engine results
          </p>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <RankTrackerContent />
      </Suspense>
    </div>
  )
}
