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
import type { BacklinkRow } from "@/types/links"

interface BacklinkTableProps {
  data: BacklinkRow[]
}

export function BacklinkTable({ data }: BacklinkTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source URL</TableHead>
          <TableHead>Target URL</TableHead>
          <TableHead>Anchor Text</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>First Seen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((backlink, index) => (
          <TableRow
            key={`${backlink.source_url}-${backlink.target_url}-${index}`}
          >
            <TableCell>
              <a
                href={backlink.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm hover:text-primary transition-colors max-w-xs"
              >
                <span className="truncate" title={backlink.source_url}>
                  {new URL(backlink.source_url).pathname || "/"}
                </span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              <div className="text-xs text-muted-foreground mt-1">
                {backlink.source_domain}
              </div>
            </TableCell>
            <TableCell>
              <a
                href={backlink.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm hover:text-primary transition-colors max-w-xs"
              >
                <span className="truncate" title={backlink.target_url}>
                  {new URL(backlink.target_url).pathname || "/"}
                </span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </TableCell>
            <TableCell>
              <span
                className="text-sm max-w-xs truncate inline-block"
                title={backlink.anchor_text || ""}
              >
                {backlink.anchor_text || (
                  <span className="text-muted-foreground italic">
                    No anchor
                  </span>
                )}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={backlink.is_nofollow ? "outline" : "default"}>
                {backlink.is_nofollow ? "nofollow" : "dofollow"}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(backlink.first_seen), {
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
