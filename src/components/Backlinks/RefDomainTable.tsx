import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RefDomainRow } from "@/types/links"

interface RefDomainTableProps {
  data: RefDomainRow[]
  projectId: string
  onDomainClick?: (domain: string) => void
}

export function RefDomainTable({
  data,
  projectId,
  onDomainClick,
}: RefDomainTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead className="text-right">Backlinks</TableHead>
          <TableHead className="text-right">DoFollow</TableHead>
          <TableHead className="text-right">NoFollow</TableHead>
          <TableHead>First Seen</TableHead>
          <TableHead>Last Seen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((domain) => (
          <TableRow key={domain.ref_domain}>
            <TableCell>
              <div className="flex items-center gap-2">
                {onDomainClick ? (
                  <button
                    type="button"
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
              <Badge variant="secondary">{domain.backlinks}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="default">{domain.dofollow}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline">{domain.nofollow}</Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(domain.first_seen), {
                  addSuffix: true,
                })}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(domain.last_seen), {
                  addSuffix: true,
                })}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
