import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react"
import { Suspense, useState } from "react"
import { GSCConnectCard } from "@/components/Keywords/GSCConnectCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import useCustomToast from "@/hooks/useCustomToast"
import { GSCService } from "@/services/gsc"
import type { ClusterMemberPublic, ClusterPublic } from "@/types/gsc"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/keywords/clusters",
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Clusters - Keywords - SEO Platform",
      },
    ],
  }),
})

interface ClusterCardProps {
  cluster: ClusterPublic
  projectId: string
}

function ClusterCard({ cluster, projectId }: ClusterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const { data: clusterDetail, isLoading } = useQuery({
    queryKey: ["gsc-cluster-detail", projectId, cluster.id],
    queryFn: () =>
      GSCService.getClusterDetail({ projectId, clusterId: cluster.id }),
    enabled: isExpanded,
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <CardTitle className="text-lg">{cluster.label}</CardTitle>
            </div>
            <CardDescription className="mt-2">
              {cluster.query_count} queries • Algorithm: {cluster.algorithm}
            </CardDescription>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm text-muted-foreground">Total Clicks</div>
            <div className="text-2xl font-bold">
              {cluster.total_clicks.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Impressions</div>
            <div className="text-lg font-semibold">
              {cluster.total_impressions.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Avg Position</div>
            <div className="text-lg font-semibold">
              {cluster.avg_position.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Created</div>
            <div className="text-sm">
              {new Date(cluster.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t pt-4 mt-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-medium mb-3">
                  Member Queries ({clusterDetail?.members.length || 0})
                </div>
                <div className="flex flex-wrap gap-2">
                  {clusterDetail?.members.map((member: ClusterMemberPublic) => (
                    <Badge key={member.id} variant="secondary">
                      {member.query}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ClustersContent() {
  const { projectId } = Route.useParams()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const queryClient = useQueryClient()

  const { data: integrationStatus } = useQuery({
    queryKey: ["google-integration-status"],
    queryFn: () => GSCService.getGoogleIntegrationStatus(),
  })

  const { data: properties } = useQuery({
    queryKey: ["gsc-properties", projectId],
    queryFn: () => GSCService.listProperties({ projectId }),
    enabled: integrationStatus?.gsc_connected === true,
  })

  const { data: clusters, isLoading } = useQuery({
    queryKey: ["gsc-clusters", projectId],
    queryFn: () => GSCService.getClusters({ projectId, limit: 100 }),
    enabled:
      integrationStatus?.gsc_connected === true &&
      properties?.data &&
      properties.data.length > 0,
  })

  const generateClustersMutation = useMutation({
    mutationFn: () => GSCService.generateClusters({ projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsc-clusters", projectId] })
      showSuccessToast(
        "Cluster generation started. This may take a few minutes.",
      )
    },
    onError: (error: any) => {
      showErrorToast(error.message || "Failed to generate clusters")
    },
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

  if (!clusters || clusters.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No clusters yet</h3>
        <p className="text-muted-foreground mb-4">
          Generate keyword clusters to group related queries and identify
          content opportunities
        </p>
        <Button
          onClick={() => generateClustersMutation.mutate()}
          disabled={generateClustersMutation.isPending}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {generateClustersMutation.isPending
            ? "Generating..."
            : "Generate Clusters"}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {clusters.count} cluster{clusters.count !== 1 ? "s" : ""} found
        </div>
        <Button
          onClick={() => generateClustersMutation.mutate()}
          disabled={generateClustersMutation.isPending}
          variant="outline"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {generateClustersMutation.isPending
            ? "Generating..."
            : "Regenerate Clusters"}
        </Button>
      </div>

      <div className="grid gap-4">
        {clusters.data.map((cluster) => (
          <ClusterCard
            key={cluster.id}
            cluster={cluster}
            projectId={projectId}
          />
        ))}
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Keyword Clusters
          </h1>
          <p className="text-muted-foreground">
            Group related keywords to identify content opportunities
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
        <ClustersContent />
      </Suspense>
    </div>
  )
}
