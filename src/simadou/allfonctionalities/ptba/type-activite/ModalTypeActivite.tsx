import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddTypeActivite from "./AddTypeActivite"
import { DIALOG_SIZES } from "@/Global/Forms/dialog"
import { TypeActivite } from "@/simadou/allTypes/entities"
import ListeTypeActivite from "./ListeTypeActivite"

export default function TypeActiviteDialog({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [mode, setMode] = useState<"list" | "add" | "edit">("list")
    const [currentRow, setCurrentRow] = useState<TypeActivite | null>(null)

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

    const goEdit = (row: TypeActivite) => {
        setMode("edit")
        setCurrentRow(row)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className={DIALOG_SIZES.xl}>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "list"
                            ? "Types d'activités"
                            : mode === "add"
                                ? "Ajouter"
                                : "Modifier"}
                    </DialogTitle>
                </DialogHeader>

                {mode === "list" && (
                    <ListeTypeActivite
                        key="list-mode"
                        onAdd={goAdd}
                        onEdit={goEdit}
                    />
                )}

                {mode === "add" && (
                    <AddTypeActivite
                        key="add-mode"
                        currentRow={null}
                        onBack={goList}
                        onCancel={goList}
                        onSuccess={goList}
                    />
                )}

                {mode === "edit" && currentRow && (
                    <AddTypeActivite
                        key={`edit-mode-${currentRow.code_type}`}
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