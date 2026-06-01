import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import type { OpenProps } from '@/simadou/interfaces/interfaceTable'
import ProjetForm from './ProjetForm'

export default function AddProjet({ open, onOpenChange }: OpenProps) {
  const closeDialog = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={DIALOG_SIZES.xl}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Nouveau projet</DialogTitle>
          <DialogDescription>
            Création d&apos;un projet pour le programme actif
          </DialogDescription>
        </DialogHeader>
        <ProjetForm
          open={open}
          onSuccess={closeDialog}
          onClose={closeDialog}
        />
      </DialogContent>
    </Dialog>
  )
}
