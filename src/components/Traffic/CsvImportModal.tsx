import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FileText, Upload, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TrafficService } from "@/services/traffic"

interface CsvImportModalProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CsvImportModal({
  projectId,
  open,
  onOpenChange,
}: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const importMutation = useMutation({
    mutationFn: (file: File) => TrafficService.importCsv({ projectId, file }),
    onSuccess: (data) => {
      toast.success(`Successfully imported ${data.rows_imported} rows`)
      // Invalidate traffic queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["traffic-panel", projectId] })
      onOpenChange(false)
      setFile(null)
    },
    onError: (error: Error) => {
      toast.error(`Failed to import CSV: ${error.message}`)
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.endsWith(".csv")) {
        toast.error("Please select a CSV file")
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = () => {
    if (!file) {
      toast.error("Please select a file")
      return
    }
    importMutation.mutate(file)
  }

  const handleClose = () => {
    if (!importMutation.isPending) {
      setFile(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Traffic Data from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with columns: date, ga4_sessions, ga4_users,
            gsc_clicks, lcp, cls
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("csv-file")?.click()}
                  className="w-full"
                  type="button"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {file ? "Change File" : "Select File"}
                </Button>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    disabled={importMutation.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-2">CSV Format Example:</h4>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {`date,ga4_sessions,ga4_users,gsc_clicks,lcp,cls
2024-01-01,1500,1200,850,2.3,0.05
2024-01-02,1650,1350,920,2.1,0.04`}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={importMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || importMutation.isPending}
          >
            {importMutation.isPending ? "Importing..." : "Import CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
