import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Suspense, useState } from "react"

import { AdsService } from "@/services/ads"
import { GSCService } from "@/services/gsc"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/ppc/overlap"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "SEO + PPC Overlap - SEO Platform",
      },
    ],
  }),
})

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
}

function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

function formatCurrency(micros: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(micros / 1_000_000)
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

function formatPosition(position: number): string {
  return position.toFixed(1)
}

function getOverlapBadge(overlapType: string) {
  switch (overlapType) {
    case "both":
      return <Badge variant="default">Both</Badge>
    case "paid_only":
      return <Badge variant="secondary">Paid Only</Badge>
    case "organic_only":
      return <Badge variant="outline">Organic Only</Badge>
    default:
      return <Badge>{overlapType}</Badge>
  }
}

function getOpportunityIcon(score: number) {
  if (score >= 75) {
    return <TrendingUp className="h-4 w-4 text-green-600" />
  }
  if (score >= 50) {
    return <Minus className="h-4 w-4 text-yellow-600" />
  }
  return <TrendingDown className="h-4 w-4 text-red-600" />
}

function getOpportunityBadgeVariant(score: number): "default" | "secondary" | "destructive" {
  if (score >= 75) return "default"
  if (score >= 50) return "secondary"
  return "destructive"
}

function AdsConnectCard() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Connect Google Ads</CardTitle>
        <CardDescription>
          Connect your Google Ads account to analyze keyword overlap between your paid and
          organic search campaigns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This feature requires both Google Search Console and Google Ads to be connected.
          Please connect your Google Ads account from the PPC dashboard.
        </p>
      </CardContent>
    </Card>
  )
}

function OverlapContent() {
  const { projectId } = Route.useParams()
  const [overlapFilter, setOverlapFilter] = useState<"all" | "both" | "paid_only" | "organic_only">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: integrationStatus } = useQuery({
    queryKey: ["google-integration-status"],
    queryFn: () => GSCService.getGoogleIntegrationStatus(),
  })

  const { data: overlapData, isLoading } = useQuery({
    queryKey: ["ads-overlap", projectId, overlapFilter],
    queryFn: () =>
      AdsService.getOverlap({
        projectId,
        params: {
          overlap_type: overlapFilter === "all" ? undefined : overlapFilter,
          limit: 100,
        },
      }),
    enabled: integrationStatus?.ads_connected === true && integrationStatus?.gsc_connected === true,
  })

  if (!integrationStatus?.ads_connected || !integrationStatus?.gsc_connected) {
    return <AdsConnectCard />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const filteredKeywords = overlapData?.data.filter((keyword) =>
    keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={overlapFilter} onValueChange={(v) => setOverlapFilter(v as typeof overlapFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Keywords</SelectItem>
              <SelectItem value="both">Both SEO & PPC</SelectItem>
              <SelectItem value="paid_only">Paid Only</SelectItem>
              <SelectItem value="organic_only">Organic Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {overlapData?.summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Keywords"
            value={formatNumber(overlapData.summary.total_keywords)}
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Overlap"
            value={formatNumber(overlapData.summary.overlap_count)}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Keywords in both SEO & PPC"
          />
          <MetricCard
            title="Paid Only"
            value={formatNumber(overlapData.summary.paid_only_count)}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Missing organic rankings"
          />
          <MetricCard
            title="Organic Only"
            value={formatNumber(overlapData.summary.organic_only_count)}
            icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
            description="Not advertised"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Keyword Overlap Analysis</CardTitle>
          <CardDescription>
            Compare keyword performance across paid and organic search
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredKeywords && filteredKeywords.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Type</TableHead>
                    <TableHead className="text-right">Paid Clicks</TableHead>
                    <TableHead className="text-right">Paid Cost</TableHead>
                    <TableHead className="text-right">Organic Clicks</TableHead>
                    <TableHead className="text-right">Organic Position</TableHead>
                    <TableHead className="text-right">Opportunity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeywords.map((keyword, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {keyword.keyword}
                      </TableCell>
                      <TableCell className="text-right">
                        {getOverlapBadge(keyword.overlap_type)}
                      </TableCell>
                      <TableCell className="text-right">
                        {keyword.paid_clicks > 0 ? formatNumber(keyword.paid_clicks) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {keyword.paid_cost_micros > 0 ? formatCurrency(keyword.paid_cost_micros) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {keyword.organic_clicks > 0 ? formatNumber(keyword.organic_clicks) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {keyword.organic_position > 0 ? formatPosition(keyword.organic_position) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {getOpportunityIcon(keyword.opportunity_score)}
                          <Badge variant={getOpportunityBadgeVariant(keyword.opportunity_score)}>
                            {keyword.opportunity_score.toFixed(0)}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No keywords found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search filter"
                  : "No keyword overlap data available"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SEO + PPC Overlap</h1>
          <p className="text-muted-foreground">
            Analyze keyword overlap between paid and organic search to optimize your strategy
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
        <OverlapContent />
      </Suspense>
    </div>
  )
}
