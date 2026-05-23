import { useCallback, useState } from 'react'
import type { NavigateFn } from '@/hooks/use-table-url-state'

/** Local search/navigate pair for GenericTable inside modals (no URL sync). */
export function useEmbeddedTableState() {
  const [search, setSearch] = useState<Record<string, unknown>>({})

  const navigate = useCallback<NavigateFn>(({ search: next }) => {
    setSearch((prev) => {
      if (typeof next === 'function') {
        return { ...prev, ...next(prev) }
      }
      if (next === true) {
        return prev
      }
      return { ...prev, ...next }
    })
  }, [])

  return { search, navigate }
}
