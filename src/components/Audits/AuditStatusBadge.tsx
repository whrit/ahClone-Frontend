import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AuditStatus } from "@/types/audit"

interface AuditStatusBadgeProps {
  status: AuditStatus
  className?: string
}

export function AuditStatusBadge({ status, className }: AuditStatusBadgeProps) {
  const isInProgress = [
    AuditStatus.QUEUED,
    AuditStatus.CRAWLING,
    AuditStatus.RENDERING,
    AuditStatus.ANALYZING,
    AuditStatus.DIFFING,
  ].includes(status)

  const statusConfig: Record<
    AuditStatus,
    {
      label: string
      variant: "default" | "secondary" | "destructive" | "outline"
      color?: string
    }
  > = {
    [AuditStatus.QUEUED]: {
      label: "Queued",
      variant: "secondary",
    },
    [AuditStatus.CRAWLING]: {
      label: "Crawling",
      variant: "default",
    },
    [AuditStatus.RENDERING]: {
      label: "Rendering",
      variant: "default",
    },
    [AuditStatus.ANALYZING]: {
      label: "Analyzing",
      variant: "default",
    },
    [AuditStatus.DIFFING]: {
      label: "Diffing",
      variant: "default",
    },
    [AuditStatus.COMPLETED]: {
      label: "Completed",
      variant: "outline",
      color: "text-green-600 border-green-600",
    },
    [AuditStatus.FAILED]: {
      label: "Failed",
      variant: "destructive",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      className={cn("flex items-center gap-1", config.color, className)}
    >
      {isInProgress && <Loader2 className="h-3 w-3 animate-spin" />}
      {config.label}
    </Badge>
  )
}
