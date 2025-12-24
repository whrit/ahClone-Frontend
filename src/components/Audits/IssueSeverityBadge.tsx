import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { IssueSeverity } from "@/types/audit"

interface IssueSeverityBadgeProps {
  severity: IssueSeverity
  className?: string
}

export function IssueSeverityBadge({
  severity,
  className,
}: IssueSeverityBadgeProps) {
  const severityConfig: Record<
    IssueSeverity,
    { label: string; className: string }
  > = {
    [IssueSeverity.CRITICAL]: {
      label: "Critical",
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    },
    [IssueSeverity.HIGH]: {
      label: "High",
      className:
        "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
    },
    [IssueSeverity.MEDIUM]: {
      label: "Medium",
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    },
    [IssueSeverity.LOW]: {
      label: "Low",
      className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    },
  }

  const config = severityConfig[severity]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
