import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { RefreshCw, TrendingUp, MousePointerClick, DollarSign, Target } from "lucide-react"
import { Suspense, useState } from "react"
import { toast } from "sonner"

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
import { Button } from "@/components/ui/button"
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

export const Route = createFileRoute(
  "/_layout/projects/$projectId/ppc/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "PPC - SEO Platform",
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

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

function formatCPC(micros: number): string {
  return formatCurrency(micros)
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toUpperCase()) {
    case "ENABLED":
      return "default"
    case "PAUSED":
      return "secondary"
    case "REMOVED":
      return "destructive"
    default:
      return "outline"
  }
}

function AdsConnectCard() {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const result = await GSCService.startGoogleOAuth("ads")
      window.location.href = result.authorization_url
    } catch (error) {
      toast.error("Failed to start Google Ads connection")
      setIsConnecting(false)
    }
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Connect Google Ads</CardTitle>
        <CardDescription>
          Connect your Google Ads account to analyze campaign performance and find opportunities
          to optimize your paid and organic search strategy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Connect Google Ads
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

function PPCContent() {
  const { projectId } = Route.useParams()
  const [period, setPeriod] = useState<"7" | "14" | "28" | "90">("28")
  const queryClient = useQueryClient()

  const { data: integrationStatus } = useQuery({
    queryKey: ["google-integration-status"],
    queryFn: () => GSCService.getGoogleIntegrationStatus(),
  })

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["ads-campaigns", projectId, period],
    queryFn: () =>
      AdsService.getCampaigns({
        projectId,
        params: {
          period_days: Number.parseInt(period),
        },
      }),
    enabled: integrationStatus?.ads_connected === true,
  })

  const syncMutation = useMutation({
    mutationFn: () => AdsService.triggerSync({ projectId }),
    onSuccess: () => {
      toast.success("Sync started successfully")
      queryClient.invalidateQueries({ queryKey: ["ads-campaigns", projectId] })
    },
    onError: () => {
      toast.error("Failed to start sync")
    },
  })

  if (!integrationStatus?.ads_connected) {
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

  // Calculate totals
  const totals = campaigns?.data.reduce(
    (acc, campaign) => ({
      impressions: acc.impressions + campaign.impressions,
      clicks: acc.clicks + campaign.clicks,
      cost: acc.cost + campaign.cost_micros,
      conversions: acc.conversions + campaign.conversions,
    }),
    { impressions: 0, clicks: 0, cost: 0, conversions: 0 }
  )

  const avgCTR = totals && totals.impressions > 0
    ? totals.clicks / totals.impressions
    : 0

  const avgCPC = totals && totals.clicks > 0
    ? totals.cost / totals.clicks
    : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="28">Last 28 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          {syncMutation.isPending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Data
            </>
          )}
        </Button>
      </div>

      {totals && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Impressions"
            value={formatNumber(totals.impressions)}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Clicks"
            value={formatNumber(totals.clicks)}
            icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Total Cost"
            value={formatCurrency(totals.cost)}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Conversions"
            value={formatNumber(totals.conversions)}
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
            description={`CTR: ${formatPercentage(avgCTR)} | CPC: ${formatCPC(avgCPC)}`}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Performance metrics for your Google Ads campaigns over the last {period} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns?.data && campaigns.data.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Impressions</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">CPC</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.data.map((campaign) => (
                    <TableRow key={campaign.campaign_id}>
                      <TableCell className="font-medium">
                        {campaign.campaign_name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getStatusBadgeVariant(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(campaign.impressions)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(campaign.clicks)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(campaign.ctr)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(campaign.cost_micros)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCPC(campaign.average_cpc_micros)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(campaign.conversions)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <MousePointerClick className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No campaigns found</h3>
              <p className="text-muted-foreground">
                No campaign data available for this period
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
          <h1 className="text-2xl font-bold tracking-tight">PPC Campaigns</h1>
          <p className="text-muted-foreground">
            Monitor and analyze your Google Ads campaign performance
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
        <PPCContent />
      </Suspense>
    </div>
  )
}
