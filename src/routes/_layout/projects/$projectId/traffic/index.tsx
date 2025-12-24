import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Upload, TrendingUp, Activity, AlertCircle } from "lucide-react"
import { Suspense, useState } from "react"
import { format } from "date-fns"

import { TrafficService } from "@/services/traffic"
import { TrafficChart } from "@/components/Traffic/TrafficChart"
import { CsvImportModal } from "@/components/Traffic/CsvImportModal"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const Route = createFileRoute("/_layout/projects/$projectId/traffic/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Traffic Panel - SEO Platform",
      },
    ],
  }),
})

function formatMetric(value: number | null, type: "number" | "decimal" | "seconds"): string {
  if (value === null) return "—"

  switch (type) {
    case "number":
      return value.toLocaleString()
    case "decimal":
      return value.toFixed(3)
    case "seconds":
      return `${value.toFixed(2)}s`
    default:
      return value.toString()
  }
}

function SourceIndicator({ available }: { available: boolean }) {
  return (
    <Badge variant={available ? "default" : "secondary"}>
      {available ? "Connected" : "Not Connected"}
    </Badge>
  )
}

function TrafficContent() {
  const { projectId } = Route.useParams()
  const [period, setPeriod] = useState<7 | 14 | 28 | 90>(28)
  const [csvModalOpen, setCsvModalOpen] = useState(false)

  const { data: panelData, isLoading: isPanelLoading } = useQuery({
    queryKey: ["traffic-panel", projectId, period],
    queryFn: () => TrafficService.getPanel({ projectId, period }),
  })

  const { data: sources } = useQuery({
    queryKey: ["traffic-sources", projectId],
    queryFn: () => TrafficService.getSources({ projectId }),
  })

  if (isPanelLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const hasData = panelData?.data && panelData.data.length > 0
  const hasAnySources =
    sources?.ga4_connected || sources?.gsc_connected || sources?.crux_available

  return (
    <div className="flex flex-col gap-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Select
            value={period.toString()}
            onValueChange={(v) => setPeriod(Number.parseInt(v) as 7 | 14 | 28 | 90)}
          >
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
        <Button onClick={() => setCsvModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </div>

      {/* Data Sources Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Data Sources
          </CardTitle>
          <CardDescription>Connected traffic data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Google Analytics 4:</span>
              <SourceIndicator available={sources?.ga4_connected ?? false} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Search Console:</span>
              <SourceIndicator available={sources?.gsc_connected ?? false} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Chrome UX Report:</span>
              <SourceIndicator available={sources?.crux_available ?? false} />
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasAnySources && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No data sources connected</AlertTitle>
          <AlertDescription>
            Connect Google Analytics 4, Search Console, or import CSV data to
            view traffic trends.
          </AlertDescription>
        </Alert>
      )}

      {/* Traffic Chart */}
      {hasData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Traffic Trends
            </CardTitle>
            <CardDescription>
              Multi-source traffic data over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficChart data={panelData.data} />
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {hasData && (
        <Card>
          <CardHeader>
            <CardTitle>Traffic Data</CardTitle>
            <CardDescription>
              Detailed breakdown of traffic metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">GA4 Sessions</TableHead>
                    <TableHead className="text-right">GA4 Users</TableHead>
                    <TableHead className="text-right">GSC Clicks</TableHead>
                    <TableHead className="text-right">LCP</TableHead>
                    <TableHead className="text-right">CLS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {panelData.data.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell className="font-medium">
                        {format(new Date(row.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMetric(row.ga4_sessions, "number")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMetric(row.ga4_users, "number")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMetric(row.gsc_clicks, "number")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMetric(row.lcp, "seconds")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMetric(row.cls, "decimal")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasData && hasAnySources && (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No traffic data available</h3>
          <p className="text-muted-foreground">
            No data found for the selected period. Try a different time range or
            import CSV data.
          </p>
        </div>
      )}

      {/* CSV Import Modal */}
      <CsvImportModal
        projectId={projectId}
        open={csvModalOpen}
        onOpenChange={setCsvModalOpen}
      />
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Traffic Panel</h1>
          <p className="text-muted-foreground">
            Multi-source traffic dashboard combining GA4, GSC, and Core Web Vitals
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
        <TrafficContent />
      </Suspense>
    </div>
  )
}
