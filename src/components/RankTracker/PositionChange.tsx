import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface PositionChangeProps {
  change: number | null
  className?: string
}

export function PositionChange({ change, className }: PositionChangeProps) {
  if (change === null || change === 0) {
    return (
      <span className={cn("flex items-center gap-1 text-muted-foreground", className)}>
        <Minus className="h-4 w-4" />
        <span className="text-sm">--</span>
      </span>
    )
  }

  // Backend calculates: position_change = previous_rank - current_rank
  // Moving from rank 10 to rank 5: 10 - 5 = +5 (positive = improvement)
  // Moving from rank 5 to rank 10: 5 - 10 = -5 (negative = decline)
  const isImprovement = change > 0
  const displayChange = Math.abs(change)

  return (
    <span
      className={cn(
        "flex items-center gap-1 text-sm font-medium",
        isImprovement ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500",
        className
      )}
    >
      {isImprovement ? (
        <>
          <TrendingUp className="h-4 w-4" />
          <span>+{displayChange}</span>
        </>
      ) : (
        <>
          <TrendingDown className="h-4 w-4" />
          <span>-{displayChange}</span>
        </>
      )}
    </span>
  )
}
