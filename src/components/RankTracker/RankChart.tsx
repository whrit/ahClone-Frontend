import { format } from "date-fns"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface RankDataPoint {
  date: string
  position: number | null
}

interface RankChartProps {
  data: RankDataPoint[]
  className?: string
}

export function RankChart({ data, className }: RankChartProps) {
  // Filter out null positions and format for recharts
  const chartData = data
    .filter((point) => point.position !== null)
    .map((point) => ({
      date: point.date,
      position: point.position,
      formattedDate: format(new Date(point.date), "MMM d"),
    }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No ranking data available</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="formattedDate"
            className="text-xs text-muted-foreground"
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            reversed
            domain={[1, "dataMax + 10"]}
            className="text-xs text-muted-foreground"
            tick={{ fill: "currentColor" }}
            label={{ value: "Position", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number | undefined) => [
              `Position #${value ?? "N/A"}`,
              "Rank",
            ]}
          />
          <Line
            type="monotone"
            dataKey="position"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
