import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoadingButton } from "@/components/ui/loading-button"
import useCustomToast from "@/hooks/useCustomToast"
import { ProjectsService } from "@/services/projects"
import type { ProjectPublic } from "@/types/project"
import { handleError } from "@/utils"

interface DeleteProjectProps {
  project: ProjectPublic
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DeleteProject = ({
  project,
  open,
  onOpenChange,
}: DeleteProjectProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const mutation = useMutation({
    mutationFn: () => ProjectsService.deleteProject({ id: project.id }),
    onSuccess: () => {
      showSuccessToast("Project deleted successfully")
      onOpenChange(false)
      navigate({ to: "/projects" })
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{project.name}"? This action cannot
            be undone. All data associated with this project will be permanently
            removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            Delete Project
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
