import { useCallback, useState } from 'react'

/**
 * Hook générique pour gérer l'état des dialogs + la ligne courante.
 *
 * Usage :
 *   const { open, setOpen, currentRow, setCurrentRow } =
 *     useGenericDialogState<User, 'add' | 'edit' | 'delete' | 'invite'>()
 */
export function useGenericDialogState<TData, TDialog extends string>() {
  const [open, setOpenRaw] = useState<TDialog | null>(null)
  const [currentRow, setCurrentRow] = useState<TData | null>(null)

  // Toggle : si on reclique sur la même action → ferme ; sinon → ouvre
  const setOpen = useCallback((dialog: TDialog | null) => {
    setOpenRaw((prev) => (prev === dialog ? null : dialog))
  }, [])

  const closeAll = useCallback(() => {
    setOpenRaw(null)
    setCurrentRow(null)
  }, [])

  return { open, setOpen, currentRow, setCurrentRow, closeAll }
}