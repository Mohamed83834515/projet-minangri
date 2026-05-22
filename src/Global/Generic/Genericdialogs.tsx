import React from 'react'

type OpenProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type WithCurrentRow<TData> = {
  currentRow: TData
}

type GenericDialogsProps<TData, TDialog extends string> = {
  open: TDialog | null
  setOpen: (dialog: TDialog | null) => void
  currentRow: TData | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TData | null>>
  // Map clé composant dialog
  dialogMap: {
    [K in TDialog]?: (
      props: OpenProps & Partial<WithCurrentRow<TData>>
    ) => React.ReactNode
  }
  // Dialogs qui requièrent un currentRow (ex: 'edit', 'delete')
  rowRequiredDialogs?: TDialog[]
  // Délai avant de vider currentRow (pour les animations de fermeture)
  clearRowDelay?: number
}

export function GenericDialogs<TData, TDialog extends string>({
  open,
  setOpen,
  currentRow,
  setCurrentRow,
  dialogMap,
  rowRequiredDialogs = [],
  clearRowDelay = 500,
}: GenericDialogsProps<TData, TDialog>) {
  const makeOpenChange = (key: TDialog) => () => {
    setOpen(key)
    if (rowRequiredDialogs.includes(key)) {
      setTimeout(() => setCurrentRow(null), clearRowDelay)
    }
  }

  return (
    <>
      {(Object.keys(dialogMap) as TDialog[]).map((key) => {
        const renderFn = dialogMap[key]
        if (!renderFn) return null

        const needsRow = rowRequiredDialogs.includes(key)

        // Dialog avec ligne sélectionnée
        if (needsRow) {
          if (!currentRow) return null
          return (
            <React.Fragment key={`${key}-${JSON.stringify(currentRow)}`}>
              {renderFn({ open: open === key, onOpenChange: makeOpenChange(key), currentRow })}
            </React.Fragment>
          )
        }

        // Dialog sans ligne (add, invite…)
        return (
          <React.Fragment key={key}>
            {renderFn({ open: open === key, onOpenChange: makeOpenChange(key) })}
          </React.Fragment>
        )
      })}
    </>
  )
}