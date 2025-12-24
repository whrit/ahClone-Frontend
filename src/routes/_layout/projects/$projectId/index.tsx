import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  BarChart3,
  ExternalLink,
  FileSearch,
  Link2,
  MousePointerClick,
  Search,
  Settings,
} from "lucide-react"

import { ProjectsService } from "@/services/projects"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/_layout/projects/$projectId/")({
  component: ProjectOverview,
})

function formatDate(date: string | null | undefined): string {
  if (!date) return "Never"
  const d = new Date(date)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(d)
}

interface ModuleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  lastSync?: string | null
  actionLabel: string
  actionHref?: string
  badge?: string
}

function ModuleCard({
  title,
  description,
  icon,
  lastSync,
  actionLabel,
  actionHref,
  badge,
}: ModuleCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">{icon}</div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Last sync:</span> {formatDate(lastSync)}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild={!!actionHref}>
          {actionHref ? (
            <Link to={actionHref}>
              {actionLabel}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <>
              {actionLabel}
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProjectOverview() {
  const { projectId } = Route.useParams()

  const { data: project, isLoading } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => ProjectsService.readProject({ id: projectId }),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="text-muted-foreground">
          The project you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-4">
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <Button variant="ghost" size="icon" asChild>
              <Link
                to="/projects/$projectId/settings"
                params={{ projectId }}
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a
              href={project.seed_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              {project.seed_url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground max-w-2xl">
              {project.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ModuleCard
          title="Site Audits"
          description="Crawl your site and identify technical SEO issues"
          icon={<FileSearch className="h-5 w-5 text-primary" />}
          lastSync={project.last_audit_at}
          actionLabel="View Audits"
          badge="Coming Soon"
        />

        <ModuleCard
          title="Keywords"
          description="Track keyword positions in Google Search Console"
          icon={<Search className="h-5 w-5 text-primary" />}
          lastSync={project.last_gsc_sync_at}
          actionLabel="View Keywords"
          badge="Coming Soon"
        />

        <ModuleCard
          title="Rank Tracking"
          description="Monitor SERP positions for target keywords"
          icon={<BarChart3 className="h-5 w-5 text-primary" />}
          lastSync={project.last_serp_refresh_at}
          actionLabel="View Rankings"
          badge="Coming Soon"
        />

        <ModuleCard
          title="Backlinks"
          description="Track your backlink profile and link building"
          icon={<Link2 className="h-5 w-5 text-primary" />}
          lastSync={project.last_links_snapshot_at}
          actionLabel="View Backlinks"
          badge="Coming Soon"
        />

        <ModuleCard
          title="PPC Analysis"
          description="Analyze paid search campaigns and competitors"
          icon={<MousePointerClick className="h-5 w-5 text-primary" />}
          lastSync={project.last_ppc_sync_at}
          actionLabel="View PPC"
          badge="Coming Soon"
        />
      </div>
    </div>
  )
}
