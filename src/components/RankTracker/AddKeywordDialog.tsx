import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddKeywordDialogProps {
  projectId: string
  onAddKeyword: (data: {
    keyword: string
    locale: string
    device: "desktop" | "mobile" | "tablet"
  }) => Promise<void>
}

export function AddKeywordDialog({
  projectId,
  onAddKeyword,
}: AddKeywordDialogProps) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [locale, setLocale] = useState("us")
  const [device, setDevice] = useState<"desktop" | "mobile" | "tablet">(
    "desktop",
  )
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!keyword.trim()) {
        throw new Error("Keyword is required")
      }
      await onAddKeyword({
        keyword: keyword.trim(),
        locale,
        device,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rank-tracker", projectId] })
      toast.success("Keyword added successfully")
      setOpen(false)
      setKeyword("")
      setLocale("us")
      setDevice("desktop")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add keyword")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Keyword
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Keyword to Track</DialogTitle>
          <DialogDescription>
            Add a new keyword to monitor its ranking position in search results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="keyword">Keyword</Label>
            <Input
              id="keyword"
              placeholder="Enter keyword to track"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !addMutation.isPending) {
                  addMutation.mutate()
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="locale">Location</Label>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger id="locale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="es">Spain</SelectItem>
                <SelectItem value="it">Italy</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="device">Device</Label>
            <Select
              value={device}
              onValueChange={(v) =>
                setDevice(v as "desktop" | "mobile" | "tablet")
              }
            >
              <SelectTrigger id="device">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? "Adding..." : "Add Keyword"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
