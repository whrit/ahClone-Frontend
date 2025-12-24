import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Link2, ArrowLeft } from "lucide-react"
import { Suspense, useState } from "react"

import { BacklinkTable } from "@/components/Backlinks/BacklinkTable"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LinksService } from "@/services/links"
import { ProjectsService } from "@/services/projects"

interface BacklinksSearch {
  domain?: string
}

export const Route = createFileRoute(
  "/_layout/projects/$projectId/links/backlinks"
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BacklinksSearch => {
    return {
      domain: search.domain as string | undefined,
    }
  },
  head: () => ({
    meta: [
      {
        title: "Backlinks - SEO Platform",
      },
    ],
  }),
})

function BacklinksContent() {
  const { projectId } = Route.useParams()
  const { domain: refDomainParam } = Route.useSearch()
  const [page, setPage] = useState(1)
  const [domainFilter, setDomainFilter] = useState(refDomainParam || "")
  const limit = 50

  // Fetch project to get the target domain
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => ProjectsService.readProject({ id: projectId }),
  })

  // Extract domain from seed_url
  const targetDomain = project?.seed_url ? new URL(project.seed_url).hostname : ""

  const { data: backlinks, isLoading } = useQuery({
    queryKey: ["backlinks", targetDomain, domainFilter, page],
    queryFn: () =>
      LinksService.getBacklinks({
        domain: targetDomain,
        ref_domain: domainFilter || undefined,
        skip: (page - 1) * limit,
        limit,
      }),
    enabled: !!targetDomain,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const totalPages = Math.ceil((backlinks?.total || 0) / limit)
  const hasData = backlinks?.data && backlinks.data.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Filter by referring domain..."
            value={domainFilter}
            onChange={(e) => {
              setDomainFilter(e.target.value)
              setPage(1) // Reset to first page on filter change
            }}
          />
        </div>
        {domainFilter && (
          <Button
            variant="outline"
            onClick={() => {
              setDomainFilter("")
              setPage(1)
            }}
          >
            Clear Filter
          </Button>
        )}
        {backlinks?.total !== undefined && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{backlinks.total}</Badge>
            <span className="text-sm text-muted-foreground">
              backlink{backlinks.total !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {domainFilter && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Showing backlinks from:</span>
          <Badge variant="outline">{domainFilter}</Badge>
        </div>
      )}

      {hasData ? (
        <>
          <BacklinkTable data={backlinks.data} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12 border rounded-lg bg-muted/50">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Link2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No backlinks found</h3>
          <p className="text-muted-foreground">
            {domainFilter
              ? `No backlinks from ${domainFilter} found`
              : "No backlink data available yet"}
          </p>
        </div>
      )}
    </div>
  )
}

function RouteComponent() {
  const { projectId } = Route.useParams()
  const { domain } = Route.useSearch()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href={`/projects/${projectId}/links`}>
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Backlinks</h1>
          <p className="text-muted-foreground">
            {domain
              ? `Individual backlinks from ${domain}`
              : "Individual backlinks to your site"}
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
        <BacklinksContent />
      </Suspense>
    </div>
  )
}
