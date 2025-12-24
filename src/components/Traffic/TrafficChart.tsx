import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { format } from "date-fns"
import type { TrafficDataPoint } from "@/types/traffic"

interface TrafficChartProps {
  data: TrafficDataPoint[]
  className?: string
}

interface ChartDataPoint {
  date: string
  formattedDate: string
  ga4_sessions: number | null
  gsc_clicks: number | null
}

export function TrafficChart({ data, className }: TrafficChartProps) {
  // Format data for recharts
  const chartData: ChartDataPoint[] = data.map((point) => ({
    date: point.date,
    formattedDate: format(new Date(point.date), "MMM d"),
    ga4_sessions: point.ga4_sessions,
    gsc_clicks: point.gsc_clicks,
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No traffic data available</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={350}>
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
            className="text-xs text-muted-foreground"
            tick={{ fill: "currentColor" }}
            label={{
              value: "Traffic",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value) =>
              value !== null && value !== undefined ? Number(value).toLocaleString() : "N/A"
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="ga4_sessions"
            name="GA4 Sessions"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 3 }}
            activeDot={{ r: 5 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="gsc_clicks"
            name="GSC Clicks"
            stroke="hsl(142.1 76.2% 36.3%)"
            strokeWidth={2}
            dot={{ fill: "hsl(142.1 76.2% 36.3%)", r: 3 }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
