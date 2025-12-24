import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { FolderOpen, Plus } from "lucide-react"
import { Suspense } from "react"
import { DataTable } from "@/components/Common/DataTable"
import PendingItems from "@/components/Pending/PendingItems"
import { columns } from "@/components/Projects/columns"
import { Button } from "@/components/ui/button"
import { ProjectsService } from "@/services/projects"

function getProjectsQueryOptions() {
  return {
    queryFn: () => ProjectsService.readProjects({ skip: 0, limit: 100 }),
    queryKey: ["projects"],
  }
}

export const Route = createFileRoute("/_layout/projects/")({
  component: Projects,
  head: () => ({
    meta: [
      {
        title: "Projects - SEO Platform",
      },
    ],
  }),
})

function ProjectsTableContent() {
  const { data: projects } = useSuspenseQuery(getProjectsQueryOptions())

  if (projects.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No projects yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first project to get started with SEO tracking
        </p>
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </div>
    )
  }

  return <DataTable columns={columns} data={projects.data} />
}

function ProjectsTable() {
  return (
    <Suspense fallback={<PendingItems />}>
      <ProjectsTableContent />
    </Suspense>
  )
}

function Projects() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your SEO projects and track performance
          </p>
        </div>
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>
      <ProjectsTable />
    </div>
  )
}
