import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Globe, Search } from "lucide-react"
import { Suspense, useState } from "react"

import { RefDomainTable } from "@/components/Backlinks/RefDomainTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { LinksService } from "@/services/links"
import { ProjectsService } from "@/services/projects"

export const Route = createFileRoute("/_layout/projects/$projectId/links/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Referring Domains - SEO Platform",
      },
    ],
  }),
})

function RefDomainsContent() {
  const { projectId } = Route.useParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const limit = 50

  // Fetch project to get the domain
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => ProjectsService.readProject({ id: projectId }),
  })

  // Extract domain from seed_url
  const domain = project?.seed_url ? new URL(project.seed_url).hostname : ""

  const { data: refDomains, isLoading } = useQuery({
    queryKey: ["ref-domains", domain, page],
    queryFn: () =>
      LinksService.getRefDomains({
        domain,
        skip: (page - 1) * limit,
        limit,
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

  const filteredDomains = refDomains?.data.filter((domain) =>
    domain.ref_domain.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil((refDomains?.total || 0) / limit)
  const hasData = filteredDomains && filteredDomains.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {refDomains?.total !== undefined && (
          <div className="flex items-center text-sm text-muted-foreground">
            {refDomains.total} referring domain
            {refDomains.total !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {hasData ? (
        <>
          <RefDomainTable data={filteredDomains} projectId={projectId} />

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
            <Globe className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            No referring domains found
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search filter"
              : "No backlink data available yet"}
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
            Referring Domains
          </h1>
          <p className="text-muted-foreground">
            Domains linking to your site with backlink statistics
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
        <RefDomainsContent />
      </Suspense>
    </div>
  )
}
