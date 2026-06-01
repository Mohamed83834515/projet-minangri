
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { DIALOG_SIZES } from "@/Global/Forms/dialog"

import AddVersionPtba from "./AddVersionPtba"
import ListeVersionPtba from "./ListeVersionPtba"
import { VersionPtba } from "@/simadou/allTypes"

type Mode = "list" | "add" | "edit"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function VersionPtbaDialog({
  open,
  onOpenChange,
}: Props) {
  const [mode, setMode] = useState<Mode>("list")

  const [currentRow, setCurrentRow] =
    useState<VersionPtba | null>(null)

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

  const goEdit = (row: VersionPtba) => {
    setMode("edit")
    setCurrentRow(row)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className={DIALOG_SIZES.xl}>
        <DialogHeader>
          <DialogTitle>
            {mode === "list"
              ? "Versions PTBA"
              : mode === "add"
                ? "Ajouter une version"
                : "Modifier la version"}
          </DialogTitle>
        </DialogHeader>

        {mode === "list" && (
          <ListeVersionPtba
            key="list-mode"
            onAdd={goAdd}
            onEdit={goEdit}
          />
        )}

        {mode === "add" && (
          <AddVersionPtba
            key="add-mode"
            currentRow={null}
            onBack={goList}
            onCancel={goList}
            onSuccess={goList}
          />
        )}

        {mode === "edit" && currentRow && (
          <AddVersionPtba
            key={`edit-${currentRow.id_version_ptba}`}
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
