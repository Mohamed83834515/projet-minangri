import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DIALOG_SIZES } from "@/Global/Forms/dialog"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function AddLocalite({ open, onOpenChange }: Props) {
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className={DIALOG_SIZES.md}>
                    <DialogHeader>
                        <DialogTitle>
                            Ajouter une localité
                        </DialogTitle>
                        <DialogDescription>
                            Formulaire d'ajout de localité
                        </DialogDescription>
                    </DialogHeader>

                    {/* Contenu du formulaire d'ajout de localité */}
                    <div>
                        {/* Ici vous pouvez ajouter les champs de votre formulaire */}
                        <p>Formulaire d'ajout de localité à implémenter</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
