import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/Common/DataTable"
import type { GSCQueryRow } from "@/types/gsc"

export function createQueryColumns(): ColumnDef<GSCQueryRow>[] {
  return [
    {
      accessorKey: "query",
      header: "Query",
      cell: ({ row }) => (
        <div className="font-medium max-w-md truncate" title={row.getValue("query")}>
          {row.getValue("query")}
        </div>
      ),
    },
    {
      accessorKey: "clicks",
      header: () => <div className="text-right">Clicks</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue<number>("clicks").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "impressions",
      header: () => <div className="text-right">Impressions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue<number>("impressions").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "ctr",
      header: () => <div className="text-right">CTR</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {(row.getValue<number>("ctr") * 100).toFixed(2)}%
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: () => <div className="text-right">Position</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue<number>("position").toFixed(1)}
        </div>
      ),
    },
  ]
}

interface QueryTableProps {
  data: GSCQueryRow[]
}

export function QueryTable({ data }: QueryTableProps) {
  return <DataTable columns={createQueryColumns()} data={data} />
}
