import { Plus, X } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CompetitorInputProps {
  competitors: string[]
  onChange: (competitors: string[]) => void
  maxCompetitors?: number
}

export function CompetitorInput({
  competitors,
  onChange,
  maxCompetitors = 5,
}: CompetitorInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    // Basic domain validation
    const domainPattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
    if (!domainPattern.test(trimmed)) {
      return // Invalid domain format
    }

    if (competitors.includes(trimmed)) {
      return // Already exists
    }

    if (competitors.length >= maxCompetitors) {
      return // Max limit reached
    }

    onChange([...competitors, trimmed])
    setInputValue("")
  }

  const handleRemove = (domain: string) => {
    onChange(competitors.filter((c) => c !== domain))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Enter competitor domain (e.g., example.com)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={competitors.length >= maxCompetitors}
        />
        <Button
          onClick={handleAdd}
          disabled={!inputValue.trim() || competitors.length >= maxCompetitors}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {competitors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {competitors.map((competitor) => (
            <Badge key={competitor} variant="secondary" className="gap-1 pr-1">
              {competitor}
              <button
                type="button"
                onClick={() => handleRemove(competitor)}
                className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {maxCompetitors && (
        <p className="text-xs text-muted-foreground">
          {competitors.length} / {maxCompetitors} competitors added
        </p>
      )}
    </div>
  )
}
