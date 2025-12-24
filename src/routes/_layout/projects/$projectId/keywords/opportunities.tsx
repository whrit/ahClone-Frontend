import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { Lightbulb } from "lucide-react"
import { Suspense, useState } from "react"

import { GSCService } from "@/services/gsc"
import type { OpportunityRow } from "@/types/gsc"
import { OpportunityType } from "@/types/gsc"
import { GSCConnectCard } from "@/components/Keywords/GSCConnectCard"
import { OpportunityBadge } from "@/components/Keywords/OpportunityBadge"
import { DataTable } from "@/components/Common/DataTable"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/keywords/opportunities"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Opportunities - Keywords - SEO Platform",
      },
    ],
  }),
})

function createOpportunityColumns(): ColumnDef<OpportunityRow>[] {
  return [
    {
      accessorKey: "query",
      header: "Query",
      cell: ({ row }) => (
        <div className="font-medium max-w-md truncate" title={row.getValue("query")}>
          {row.getValue("query")}
        </div>
      ),
    },
    {
      accessorKey: "opportunity_type",
      header: "Type",
      cell: ({ row }) => (
        <OpportunityBadge type={row.getValue("opportunity_type")} />
      ),
    },
    {
      accessorKey: "clicks",
      header: () => <div className="text-right">Clicks</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue<number>("clicks").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "impressions",
      header: () => <div className="text-right">Impressions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue<number>("impressions").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "ctr",
      header: () => <div className="text-right">CTR</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {(row.getValue<number>("ctr") * 100).toFixed(2)}%
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: () => <div className="text-right">Position</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue<number>("position").toFixed(1)}
        </div>
      ),
    },
    {
      accessorKey: "potential_clicks",
      header: () => <div className="text-right">Potential</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium text-green-600 dark:text-green-400">
          +{row.getValue<number>("potential_clicks").toLocaleString()}
        </div>
      ),
    },
  ]
}

function OpportunitiesContent() {
  const { projectId } = Route.useParams()
  const [filterType, setFilterType] = useState<string>("all")

  const { data: integrationStatus } = useQuery({
    queryKey: ["google-integration-status"],
    queryFn: () => GSCService.getGoogleIntegrationStatus(),
  })

  const { data: properties } = useQuery({
    queryKey: ["gsc-properties", projectId],
    queryFn: () => GSCService.listProperties({ projectId }),
    enabled: integrationStatus?.gsc_connected === true,
  })

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["gsc-opportunities", projectId, filterType],
    queryFn: () =>
      GSCService.getOpportunities({
        projectId,
        params: {
          opportunity_type:
            filterType !== "all" ? (filterType as OpportunityType) : undefined,
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const opportunityCounts = {
    [OpportunityType.LOW_CTR]: 0,
    [OpportunityType.POSITION_8_20]: 0,
    [OpportunityType.RISING]: 0,
    [OpportunityType.FALLING]: 0,
  }

  opportunities?.data.forEach((opp) => {
    if (opp.opportunity_type in opportunityCounts) {
      opportunityCounts[opp.opportunity_type as OpportunityType]++
    }
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Low CTR</CardDescription>
            <CardTitle className="text-3xl">
              {opportunityCounts[OpportunityType.LOW_CTR]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              High impressions but low click-through rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Position 8-20</CardDescription>
            <CardTitle className="text-3xl">
              {opportunityCounts[OpportunityType.POSITION_8_20]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Close to first page, easy wins
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rising</CardDescription>
            <CardTitle className="text-3xl">
              {opportunityCounts[OpportunityType.RISING]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Improving positions, momentum building
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Falling</CardDescription>
            <CardTitle className="text-3xl">
              {opportunityCounts[OpportunityType.FALLING]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Declining positions, needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Opportunities</SelectItem>
            <SelectItem value={OpportunityType.LOW_CTR}>Low CTR</SelectItem>
            <SelectItem value={OpportunityType.POSITION_8_20}>
              Position 8-20
            </SelectItem>
            <SelectItem value={OpportunityType.RISING}>Rising</SelectItem>
            <SelectItem value={OpportunityType.FALLING}>Falling</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {opportunities?.data && opportunities.data.length > 0 ? (
        <DataTable columns={createOpportunityColumns()} data={opportunities.data} />
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Lightbulb className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No opportunities found</h3>
          <p className="text-muted-foreground">
            {filterType !== "all"
              ? "Try selecting a different opportunity type"
              : "Check back later for new opportunities"}
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
          <h1 className="text-2xl font-bold tracking-tight">SEO Opportunities</h1>
          <p className="text-muted-foreground">
            Identify quick wins and areas for improvement
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
        <OpportunitiesContent />
      </Suspense>
    </div>
  )
}
