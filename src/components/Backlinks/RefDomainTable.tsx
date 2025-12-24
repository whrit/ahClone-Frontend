import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"

interface RefDomain {
  ref_domain: string
  backlinks_count: number
  dofollow_count: number
  nofollow_count: number
  first_seen: string
  top_anchors: string[]
}

interface RefDomainTableProps {
  data: RefDomain[]
  projectId: string
  onDomainClick?: (domain: string) => void
}

export function RefDomainTable({ data, projectId, onDomainClick }: RefDomainTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead className="text-right">Backlinks</TableHead>
          <TableHead className="text-right">DoFollow</TableHead>
          <TableHead className="text-right">NoFollow</TableHead>
          <TableHead>First Seen</TableHead>
          <TableHead>Top Anchors</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((domain) => (
          <TableRow key={domain.ref_domain}>
            <TableCell>
              <div className="flex items-center gap-2">
                {onDomainClick ? (
                  <button
                    onClick={() => onDomainClick(domain.ref_domain)}
                    className="font-medium hover:text-primary transition-colors text-left"
                  >
                    {domain.ref_domain}
                  </button>
                ) : (
                  <a
                    href={`/projects/${projectId}/links/backlinks?domain=${encodeURIComponent(domain.ref_domain)}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {domain.ref_domain}
                  </a>
                )}
                <a
                  href={`https://${domain.ref_domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">{domain.backlinks_count}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="default">{domain.dofollow_count}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline">{domain.nofollow_count}</Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(domain.first_seen), {
                  addSuffix: true,
                })}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-md">
                {domain.top_anchors.slice(0, 3).map((anchor, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {anchor}
                  </Badge>
                ))}
                {domain.top_anchors.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{domain.top_anchors.length - 3}
                  </Badge>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
