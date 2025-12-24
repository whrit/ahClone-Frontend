import { Badge } from "@/components/ui/badge"
import { OpportunityType } from "@/types/gsc"

interface OpportunityBadgeProps {
  type: OpportunityType | string
  className?: string
}

const opportunityConfig = {
  [OpportunityType.LOW_CTR]: {
    label: "Low CTR",
    variant: "default" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200",
  },
  [OpportunityType.POSITION_8_20]: {
    label: "Position 8-20",
    variant: "default" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200",
  },
  [OpportunityType.RISING]: {
    label: "Rising",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200",
  },
  [OpportunityType.FALLING]: {
    label: "Falling",
    variant: "default" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200",
  },
}

export function OpportunityBadge({ type, className }: OpportunityBadgeProps) {
  const config = opportunityConfig[type as OpportunityType] || {
    label: type,
    variant: "secondary" as const,
    className: "",
  }

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className || ""}`}
    >
      {config.label}
    </Badge>
  )
}

export function getOpportunityTypeLabel(type: OpportunityType | string): string {
  const config = opportunityConfig[type as OpportunityType]
  return config?.label || type
}
