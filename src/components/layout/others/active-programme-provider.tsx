import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { programmeService } from '@/simadou/allSercices/programmeService'
import { useProjectStore } from '@/stores/projetct-store'

function isPersistedProgramme(
  value: unknown
): value is { id_programme: number } {
  return (
    typeof value === 'object' &&
    value != null &&
    'id_programme' in value &&
    Number.isFinite(Number((value as { id_programme: unknown }).id_programme))
  )
}

/**
 * Charge les programmes et synchronise le programme actif (persisté ou premier de la liste).
 */
export function ActiveProgrammeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const setActiveProgramme = useProjectStore((s) => s.setActiveProgramme)
  const setProgrammes = useProjectStore((s) => s.setProgrammes)

  const { data: programmes = [] } = useQuery({
    queryKey: ['programmes'],
    queryFn: () => programmeService.getAll(),
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (programmes.length === 0) return

    setProgrammes(programmes)

    const current = useProjectStore.getState().activeProgramme
    const persistedId = isPersistedProgramme(current)
      ? current.id_programme
      : undefined

    const match =
      persistedId != null
        ? programmes.find((p) => p.id_programme === persistedId)
        : undefined

    const next = match ?? programmes[0]

    if (
      !current ||
      current.id_programme !== next.id_programme ||
      current.sigle_programme !== next.sigle_programme ||
      current.code_programme !== next.code_programme
    ) {
      setActiveProgramme(next)
    }
  }, [programmes, setActiveProgramme, setProgrammes])

  return children
}
