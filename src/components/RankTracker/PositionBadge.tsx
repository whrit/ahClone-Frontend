import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PositionBadgeProps {
  position: number | null
  className?: string
}

export function PositionBadge({ position, className }: PositionBadgeProps) {
  if (position === null) {
    return (
      <Badge variant="outline" className={cn("font-mono", className)}>
        --
      </Badge>
    )
  }

  // Color coding based on position
  const getVariant = (pos: number) => {
    if (pos <= 3) return "default" // Top 3 - primary color
    if (pos <= 10) return "secondary" // Top 10 - secondary color
    return "outline" // Beyond top 10
  }

  const getBgColor = (pos: number) => {
    if (pos <= 3)
      return "bg-green-600 dark:bg-green-700 text-white border-green-600"
    if (pos <= 10)
      return "bg-blue-600 dark:bg-blue-700 text-white border-blue-600"
    return ""
  }

  return (
    <Badge
      variant={getVariant(position)}
      className={cn("font-mono", getBgColor(position), className)}
    >
      #{position}
    </Badge>
  )
}
