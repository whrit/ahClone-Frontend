import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Users, ExternalLink } from "lucide-react"
import { Suspense, useState } from "react"

import { CompetitorInput } from "@/components/Backlinks/CompetitorInput"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { LinksService } from "@/services/links"
import { ProjectsService } from "@/services/projects"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/links/competitive"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Competitive Analysis - SEO Platform",
      },
    ],
  }),
})

function CompetitiveContent() {
  const { projectId } = Route.useParams()
  const [competitors, setCompetitors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"overlap" | "gap">("overlap")

  // Fetch project to get the domain
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => ProjectsService.readProject({ id: projectId }),
  })

  // Extract domain from seed_url
  const domain = project?.seed_url ? new URL(project.seed_url).hostname : ""

  const { data: overlapData, isLoading: isLoadingOverlap } = useQuery({
    queryKey: ["competitor-overlap", domain, competitors],
    queryFn: () =>
      LinksService.getCompetitorOverlap({
        domain,
        competitors,
      }),
    enabled: competitors.length > 0 && !!domain,
  })

  const { data: gapData, isLoading: isLoadingGap } = useQuery({
    queryKey: ["competitor-gap", domain, competitors],
    queryFn: () =>
      LinksService.getCompetitorGap({
        domain,
        competitors,
      }),
    enabled: competitors.length > 0 && !!domain,
  })

  const isLoading =
    activeTab === "overlap" ? isLoadingOverlap : isLoadingGap
  const hasCompetitors = competitors.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">Add Competitor Domains</h3>
        <CompetitorInput
          competitors={competitors}
          onChange={setCompetitors}
          maxCompetitors={5}
        />
      </div>

      {hasCompetitors ? (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="overlap">Overlap</TabsTrigger>
            <TabsTrigger value="gap">Link Gap</TabsTrigger>
          </TabsList>

          <TabsContent value="overlap" className="mt-6">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : overlapData?.data && overlapData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Domains linking to both your site and competitor sites
                  </p>
                  <Badge variant="secondary">
                    {overlapData.total} shared domains
                  </Badge>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead className="text-right">Your Site</TableHead>
                      <TableHead className="text-right">Competitor</TableHead>
                      <TableHead className="text-right">Total Links</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overlapData.data.map((item) => (
                      <TableRow key={item.domain}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.domain}</span>
                            <a
                              href={`https://${item.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="default">{item.links_to_a}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{item.links_to_b}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{item.total_backlinks}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 border rounded-lg bg-muted/50">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No overlap found
                </h3>
                <p className="text-muted-foreground">
                  No domains link to both your site and the selected competitors
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gap" className="mt-6">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : gapData?.data && gapData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Domains linking to competitors but not to your site
                  </p>
                  <Badge variant="secondary">
                    {gapData.total} potential opportunities
                  </Badge>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead className="text-right">Backlinks</TableHead>
                      <TableHead className="text-right">Dofollow</TableHead>
                      <TableHead className="text-right">Nofollow</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gapData.data.map((item) => (
                      <TableRow key={item.domain}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.domain}</span>
                            <a
                              href={`https://${item.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{item.backlinks_count}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="default">{item.dofollow_count}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{item.nofollow_count}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 border rounded-lg bg-muted/50">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No link gap found
                </h3>
                <p className="text-muted-foreground">
                  No domains link to competitors but not to your site
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12 border rounded-lg bg-muted/50">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Add competitors to start</h3>
          <p className="text-muted-foreground max-w-md">
            Enter competitor domains above to analyze link overlap and discover link
            building opportunities
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
          <h1 className="text-2xl font-bold tracking-tight">
            Competitive Analysis
          </h1>
          <p className="text-muted-foreground">
            Compare your backlink profile with competitors
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
        <CompetitiveContent />
      </Suspense>
    </div>
  )
}
