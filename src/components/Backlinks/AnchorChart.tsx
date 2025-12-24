import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AnchorData {
  anchor_text: string
  count: number
  percentage: number
}

interface AnchorChartProps {
  data: AnchorData[]
  maxItems?: number
}

export function AnchorChart({ data, maxItems = 10 }: AnchorChartProps) {
  const displayData = data.slice(0, maxItems)
  const maxCount = Math.max(...displayData.map((item) => item.count))

  return (
    <div className="space-y-3">
      {displayData.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium truncate max-w-xs" title={item.anchor_text}>
              {item.anchor_text || <span className="text-muted-foreground italic">No anchor</span>}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary">{item.count}</Badge>
              <span className="text-muted-foreground text-xs w-12 text-right">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all",
                idx === 0
                  ? "bg-primary"
                  : idx === 1
                    ? "bg-blue-500"
                    : idx === 2
                      ? "bg-green-500"
                      : "bg-muted-foreground/50"
              )}
              style={{
                width: `${(item.count / maxCount) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
