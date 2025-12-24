import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Suspense } from "react"
import { format } from "date-fns"

import { SerpService } from "@/services/serp"
import { PositionBadge } from "@/components/RankTracker/PositionBadge"
import { PositionChange } from "@/components/RankTracker/PositionChange"
import { RankChart } from "@/components/RankTracker/RankChart"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/rank-tracker/$keywordId"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Keyword Details - Rank Tracker - SEO Platform",
      },
    ],
  }),
})

function KeywordDetailContent() {
  const { projectId, keywordId } = Route.useParams()

  const { data: keyword, isLoading: keywordLoading } = useQuery({
    queryKey: ["rank-tracker", projectId, keywordId],
    queryFn: () =>
      SerpService.getKeywordTarget({
        projectId,
        keywordId,
      }),
  })

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ["rank-tracker", projectId, keywordId, "history"],
    queryFn: () =>
      SerpService.getRankHistory({
        projectId,
        keywordId,
        limit: 90, // Last 90 observations
      }),
  })

  const { data: latestSnapshot, isLoading: snapshotLoading } = useQuery({
    queryKey: ["rank-tracker", projectId, keywordId, "snapshot"],
    queryFn: () =>
      SerpService.getLatestSnapshot({
        projectId,
        keywordId,
      }),
    retry: false, // Don't retry if no snapshot exists
  })

  if (keywordLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!keyword) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <h3 className="text-lg font-semibold">Keyword not found</h3>
        <p className="text-muted-foreground">
          This keyword target could not be found.
        </p>
      </div>
    )
  }

  // Prepare chart data
  const chartData =
    history?.data.map((obs) => ({
      date: obs.observed_at,
      position: obs.rank,
    })) || []

  return (
    <div className="flex flex-col gap-6">
      {/* Header with keyword info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">{keyword.keyword}</h2>
          <PositionBadge position={keyword.latest_position} />
          <PositionChange change={keyword.position_change} />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline">{keyword.locale.toUpperCase()}</Badge>
          <Badge variant="outline" className="capitalize">
            {keyword.device}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {keyword.search_engine}
          </Badge>
          <span>
            Refreshes every {keyword.refresh_frequency_hours} hour
            {keyword.refresh_frequency_hours !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Position History Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Position History</h3>
        {historyLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <RankChart data={chartData} />
        )}
      </Card>

      {/* Observations Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Observations</h3>
        {historyLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : history?.data && history.data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.data.map((obs) => (
                <TableRow key={obs.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(obs.observed_at), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(obs.observed_at), "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PositionBadge position={obs.rank} />
                  </TableCell>
                  <TableCell>
                    {obs.url ? (
                      <a
                        href={obs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm hover:text-primary transition-colors max-w-md truncate"
                      >
                        <span className="truncate">{obs.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {obs.domain ? (
                      <span className="text-sm">{obs.domain}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        obs.status === "success"
                          ? "default"
                          : obs.status === "failed"
                            ? "destructive"
                            : "outline"
                      }
                      className="capitalize"
                    >
                      {obs.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No observations yet. Trigger a refresh to start tracking.
          </div>
        )}
      </Card>

      {/* SERP Snapshot Viewer */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Latest SERP Snapshot</h3>
        {snapshotLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : latestSnapshot?.results && latestSnapshot.results.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Captured {format(new Date(latestSnapshot.captured_at), "PPpp")}
              {latestSnapshot.total_results && (
                <span className="ml-2">
                  ({latestSnapshot.total_results.toLocaleString()} total results)
                </span>
              )}
            </div>
            <div className="space-y-3">
              {latestSnapshot.results.map((result) => (
                <div
                  key={result.position}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <PositionBadge position={result.position} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-primary hover:underline line-clamp-1"
                      >
                        {result.title}
                      </a>
                      <div className="flex items-center gap-1 text-sm text-green-700 dark:text-green-500 mt-1">
                        <span className="truncate">{result.displayed_url || result.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {result.snippet}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No SERP snapshot available yet. Trigger a refresh to capture the current
            search results.
          </div>
        )}
      </Card>
    </div>
  )
}

function RouteComponent() {
  const { projectId } = Route.useParams()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/projects/$projectId/rank-tracker" params={{ projectId }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Keyword Details</h1>
          <p className="text-muted-foreground">
            View position history and SERP snapshots
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
        <KeywordDetailContent />
      </Suspense>
    </div>
  )
}
