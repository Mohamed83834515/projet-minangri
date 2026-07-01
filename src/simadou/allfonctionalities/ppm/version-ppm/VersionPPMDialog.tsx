import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DIALOG_SIZES } from "@/Global/Forms/dialog"
import ListeVersionPPM from "./ListeVersionPPM"
import AddVersionPPM from "./AddVersionPPM"

export default function FonctionDialog({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [mode, setMode] = useState<"list" | "add" | "edit">("list")
    const [currentRow, setCurrentRow] = useState<any | null>(null)

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setMode("list")
            setCurrentRow(null)
        }
        onOpenChange(newOpen)
    }

    const goList = () => {
        setMode("list")
        setCurrentRow(null)
    }

    const goAdd = () => {
        setMode("add")
        setCurrentRow(null)
    }

    const goEdit = (row: any) => {
        setMode("edit")
        setCurrentRow(row)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className={DIALOG_SIZES.md}>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "list"
                            ? "Versions PPM"
                            : mode === "add"
                                ? "Ajouter une version PPM"
                                : "Modifier une version PPM"}
                    </DialogTitle>
                </DialogHeader>

                {mode === "list" && (
                    <ListeVersionPPM
                        key="list-mode"
                        onAdd={goAdd}
                        onEdit={goEdit}
                    />
                )}

                {mode === "add" && (
                    <AddVersionPPM
                        key="add-mode"
                        currentRow={null}
                        onBack={goList}
                        onCancel={goList}
                        onSuccess={goList}
                    />
                )}

                {mode === "edit" && currentRow && (
                    <AddVersionPPM
                        key={`edit-mode-${currentRow.id_version_ppm}`}
                        currentRow={currentRow}
                        onBack={goList}
                        onCancel={goList}
                        onSuccess={goList}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}