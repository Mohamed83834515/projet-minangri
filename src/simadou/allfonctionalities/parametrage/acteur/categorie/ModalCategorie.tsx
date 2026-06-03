// simadou/allfonctionalities/parametrage/categorie-acteur/CategorieActeurDialog.tsx
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DIALOG_SIZES } from "@/Global/Forms/dialog"
import { CategorieActeur } from "@/simadou/allTypes/categorieActeur"
import ListeCategorieActeur from "./ListeCategorie"
import AddCategorieActeur from "./AddCategorie"

export default function CategorieActeurDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [mode, setMode] = useState<"list" | "add" | "edit">("list")
  const [currentRow, setCurrentRow] = useState<CategorieActeur | null>(null)

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

  const goEdit = (row: CategorieActeur) => {
    setMode("edit")
    setCurrentRow(row)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={DIALOG_SIZES.lg}>
        <DialogHeader>
          <DialogTitle>
            {mode === "list"
              ? "Catégories d'acteurs"
              : mode === "add"
                ? "Ajouter une catégorie"
                : "Modifier une catégorie"}
          </DialogTitle>
        </DialogHeader>

        {mode === "list" && (
          <ListeCategorieActeur
            key="list-mode"
            onAdd={goAdd}
            onEdit={goEdit}
          />
        )}

        {mode === "add" && (
          <AddCategorieActeur
            key="add-mode"
            currentRow={null}
            onBack={goList}
            onCancel={goList}
            onSuccess={goList}
          />
        )}

        {mode === "edit" && currentRow && (
          <AddCategorieActeur
            key={`edit-mode-${currentRow.id_categorie}`}
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