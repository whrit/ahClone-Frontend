import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { ProjectUpdate } from "@/types/project"
import { ProjectsService } from "@/services/projects"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingButton } from "@/components/ui/loading-button"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteProject } from "@/components/Projects/DeleteProject"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

const generalFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(255),
  seed_url: z
    .string()
    .min(1, { message: "Seed URL is required" })
    .url({ message: "Must be a valid URL" }),
  description: z.string().max(1000).optional().nullable(),
})

type GeneralFormData = z.infer<typeof generalFormSchema>

export const Route = createFileRoute(
  "/_layout/projects/$projectId/settings"
)({
  component: ProjectSettings,
  head: () => ({
    meta: [
      {
        title: "Project Settings - SEO Platform",
      },
    ],
  }),
})

function ProjectSettings() {
  const { projectId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: project, isLoading } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => ProjectsService.readProject({ id: projectId }),
  })

  const form = useForm<GeneralFormData>({
    resolver: zodResolver(generalFormSchema),
    mode: "onBlur",
    criteriaMode: "all",
    values: project
      ? {
          name: project.name,
          seed_url: project.seed_url,
          description: project.description || "",
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: (data: ProjectUpdate) =>
      ProjectsService.updateProject({
        id: projectId,
        requestBody: data,
      }),
    onSuccess: () => {
      showSuccessToast("Project updated successfully")
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] })
    },
  })

  const onSubmit = (data: GeneralFormData) => {
    if (mutation.isPending) return
    mutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate({ to: "/projects/$projectId", params: { projectId } })
          }
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Project Settings
          </h1>
          <p className="text-muted-foreground">{project.name}</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="crawl">Crawl Settings</TabsTrigger>
          <TabsTrigger value="rendering">JS Rendering</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic project information and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Project Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My Website"
                            {...field}
                            disabled={mutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seed_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Seed URL <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            {...field}
                            disabled={mutation.isPending}
                          />
                        </FormControl>
                        <FormDescription>
                          The main URL of your website
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Optional description..."
                            className="resize-none"
                            {...field}
                            value={field.value || ""}
                            disabled={mutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <LoadingButton type="submit" loading={mutation.isPending}>
                    Save Changes
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawl" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crawl Settings</CardTitle>
              <CardDescription>
                Configure how the crawler behaves when auditing your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crawl settings configuration coming soon. This will include
                options for max pages, depth, concurrency, user agent, robots.txt
                handling, and URL patterns.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rendering" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>JavaScript Rendering</CardTitle>
              <CardDescription>
                Configure client-side rendering settings for JavaScript-heavy
                sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                JavaScript rendering settings coming soon. This will include
                options for enabling JS rendering, render mode, max pages to
                render, and timeout settings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Settings</CardTitle>
              <CardDescription>
                Configure automated sync and audit schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Schedule configuration coming soon. This will include options for
                audit frequency, GSC sync frequency, SERP refresh frequency, and
                data retention policies.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="space-y-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Delete Project</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this project and all associated data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DeleteProject
        project={project}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  )
}
