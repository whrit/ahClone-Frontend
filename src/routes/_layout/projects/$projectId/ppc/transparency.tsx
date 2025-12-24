import { createFileRoute } from "@tanstack/react-router"
import { Eye, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute(
  "/_layout/projects/$projectId/ppc/transparency",
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Ad Transparency - SEO Platform",
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Ad Transparency
            </h1>
            <Badge variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              Coming Soon
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Competitive ad intelligence and transparency tools
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle>Competitor Ad Transparency</CardTitle>
          </div>
          <CardDescription>
            Analyze competitor advertising strategies and creative approaches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Feature In Development
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We're building powerful ad transparency tools to help you
              understand your competitors' advertising strategies. This feature
              will include:
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Ad Creative Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and analyze competitor ad copy, headlines, and creative
                  elements across search and display networks.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Historical Ad Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track how competitors adjust their advertising strategies over
                  time with historical ad creative archives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Landing Page Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover which landing pages competitors use for their ads and
                  analyze their conversion optimization strategies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Keyword Targeting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Identify which keywords your competitors are bidding on and
                  discover new targeting opportunities.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium">Stay tuned!</p>
            <p className="text-sm text-muted-foreground mt-1">
              This feature will be available in an upcoming release. We'll
              notify you when it's ready.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
