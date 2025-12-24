import { useMutation, useQuery } from "@tanstack/react-query"
import { ExternalLink, Link2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useCustomToast from "@/hooks/useCustomToast"
import { GSCService } from "@/services/gsc"

interface GSCConnectCardProps {
  projectId: string
}

export function GSCConnectCard({ projectId }: GSCConnectCardProps) {
  const { showErrorToast } = useCustomToast()

  const { data: integrationStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["google-integration-status"],
    queryFn: () => GSCService.getGoogleIntegrationStatus(),
  })

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["gsc-properties", projectId],
    queryFn: () => GSCService.listProperties({ projectId }),
    enabled: integrationStatus?.gsc_connected === true,
  })

  const connectMutation = useMutation({
    mutationFn: () => GSCService.startGoogleOAuth("gsc"),
    onSuccess: (data) => {
      window.location.href = data.authorization_url
    },
    onError: (error: any) => {
      showErrorToast(error.message || "Failed to start Google OAuth")
    },
  })

  const isLoading = statusLoading || propertiesLoading
  const isConnected = integrationStatus?.gsc_connected
  const hasProperty = properties && properties.data.length > 0
  const property = properties?.data[0]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Loading...</CardTitle>
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">
              Connect Google Search Console
            </CardTitle>
          </div>
          <CardDescription>
            Connect your Google Search Console account to track keyword
            performance and rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>With GSC connected, you can:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Track search query performance</li>
              <li>Monitor page rankings</li>
              <li>Identify SEO opportunities</li>
              <li>Generate keyword clusters</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => connectMutation.mutate()}
            disabled={connectMutation.isPending}
            className="w-full"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {connectMutation.isPending
              ? "Connecting..."
              : "Connect Google Search Console"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!hasProperty) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Select GSC Property</CardTitle>
            </div>
            <Badge variant="secondary">Connected</Badge>
          </div>
          <CardDescription>
            Connected as {integrationStatus.gsc_email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No GSC property is linked to this project yet. Please select a
            property from your Google Search Console account.
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Property selection will be available in the project settings.
          </p>
        </CardFooter>
      </Card>
    )
  }

  if (!property) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Google Search Console</CardTitle>
          </div>
          <Badge variant="secondary">Connected</Badge>
        </div>
        <CardDescription>Property: {property.site_url}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-medium capitalize">{property.sync_status}</span>
        </div>
        {property.last_sync_at && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last sync:</span>
            <span className="font-medium">
              {new Date(property.last_sync_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
