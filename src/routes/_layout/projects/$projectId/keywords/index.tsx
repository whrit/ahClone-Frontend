import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense, useState } from "react"

import { GSCService } from "@/services/gsc"
import { GSCConnectCard } from "@/components/Keywords/GSCConnectCard"
import { QueryTable } from "@/components/Keywords/QueryTable"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/keywords/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Keywords - SEO Platform",
      },
    ],
  }),
})

function KeywordsContent() {
  const { projectId } = Route.useParams()
  const [period, setPeriod] = useState<"7" | "28" | "90">("28")
  const [sortBy, setSortBy] = useState<"clicks" | "impressions" | "ctr" | "position">("clicks")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: integrationStatus } = useQuery({
    queryKey: ["google-integration-status"],
    queryFn: () => GSCService.getGoogleIntegrationStatus(),
  })

  const { data: properties } = useQuery({
    queryKey: ["gsc-properties", projectId],
    queryFn: () => GSCService.listProperties({ projectId }),
    enabled: integrationStatus?.gsc_connected === true,
  })

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - Number.parseInt(period))

  const { data: queries, isLoading } = useQuery({
    queryKey: ["gsc-queries", projectId, period, sortBy],
    queryFn: () =>
      GSCService.getQueries({
        projectId,
        params: {
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          sort_by: sortBy,
          sort_order: "desc",
          limit: 100,
        },
      }),
    enabled:
      integrationStatus?.gsc_connected === true &&
      properties?.data &&
      properties.data.length > 0,
  })

  const hasProperty = properties?.data && properties.data.length > 0

  if (!integrationStatus?.gsc_connected || !hasProperty) {
    return <GSCConnectCard projectId={projectId} />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const filteredQueries = queries?.data.filter((query) =>
    query.query.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as "7" | "28" | "90")}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="28">Last 28 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as typeof sortBy)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clicks">Sort by Clicks</SelectItem>
              <SelectItem value="impressions">Sort by Impressions</SelectItem>
              <SelectItem value="ctr">Sort by CTR</SelectItem>
              <SelectItem value="position">Sort by Position</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredQueries && filteredQueries.length > 0 ? (
        <QueryTable data={filteredQueries} />
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No queries found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search filter"
              : "No query data available for this period"}
          </p>
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
          <h1 className="text-2xl font-bold tracking-tight">Query Explorer</h1>
          <p className="text-muted-foreground">
            Track search query performance from Google Search Console
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
        <KeywordsContent />
      </Suspense>
    </div>
  )
}
