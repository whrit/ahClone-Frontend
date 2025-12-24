import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Type, ArrowUpDown } from "lucide-react"
import { Suspense, useState } from "react"

import { AnchorChart } from "@/components/Backlinks/AnchorChart"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LinksService } from "@/services/links"
import { ProjectsService } from "@/services/projects"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/links/anchors"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Anchor Texts - SEO Platform",
      },
    ],
  }),
})

function AnchorsContent() {
  const { projectId } = Route.useParams()
  const [sortBy, setSortBy] = useState<"count" | "domains">("count")
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

  // Fetch project to get the domain
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => ProjectsService.readProject({ id: projectId }),
  })

  // Extract domain from seed_url
  const domain = project?.seed_url ? new URL(project.seed_url).hostname : ""

  const { data: anchors, isLoading } = useQuery({
    queryKey: ["anchor-texts", domain, sortBy],
    queryFn: () =>
      LinksService.getAnchorTexts({
        domain,
        skip: 0,
        limit: 100,
      }),
    enabled: !!domain,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const hasData = anchors?.data && anchors.data.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "chart" ? "default" : "outline"}
            onClick={() => setViewMode("chart")}
            size="sm"
          >
            Chart View
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
            size="sm"
          >
            Table View
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as typeof sortBy)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="count">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" />
                  Sort by Backlinks
                </div>
              </SelectItem>
              <SelectItem value="domains">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" />
                  Sort by Domains
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {anchors?.total !== undefined && (
            <Badge variant="secondary">{anchors.total} unique anchors</Badge>
          )}
        </div>
      </div>

      {hasData ? (
        <>
          {viewMode === "chart" ? (
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">Top Anchor Texts</h3>
              <AnchorChart
                data={anchors.data.map((anchor) => ({
                  anchor_text: anchor.anchor_text,
                  count: anchor.backlinks,
                  percentage: (anchor.backlinks / anchors.total) * 100,
                }))}
                maxItems={20}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anchor Text</TableHead>
                  <TableHead className="text-right">Backlinks</TableHead>
                  <TableHead className="text-right">Ref Domains</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anchors.data.map((anchor, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <span className="font-medium">
                        {anchor.anchor_text || (
                          <span className="text-muted-foreground italic">
                            No anchor text
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{anchor.backlinks}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{anchor.ref_domains}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-muted-foreground">
                        {((anchor.backlinks / anchors.total) * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12 border rounded-lg bg-muted/50">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Type className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No anchor texts found</h3>
          <p className="text-muted-foreground">
            No anchor text data available yet
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
          <h1 className="text-2xl font-bold tracking-tight">Anchor Texts</h1>
          <p className="text-muted-foreground">
            Analyze anchor text distribution across your backlinks
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
        <AnchorsContent />
      </Suspense>
    </div>
  )
}
