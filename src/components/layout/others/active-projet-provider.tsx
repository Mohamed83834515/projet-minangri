import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { projetService } from '@/simadou/allSercices/projetService'
import { useProjetStore } from '@/stores/projet-store'
import { useProgrammeStore } from '@/stores/programme-store'
import { projetQueryKeys } from '@/simadou/allHooks/admin/projetHooks'

/**
 * Charge les projets filtrés par programme et synchronise le projet actif
 * (persisté ou premier de la liste). Évite toute boucle infinie.
 */
export function ActiveProjetProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const activeProgramme = useProgrammeStore((s) => s.activeProgramme)
  const idProgramme = activeProgramme?.id_programme

  const setActiveProjet = useProjetStore((s) => s.setActiveProjet)
  const setProjets = useProjetStore((s) => s.setProjets)

  // Référence stable pour éviter la dépendance cyclique dans useEffect
  const prevProjetsIdsRef = useRef<string>('')
  const prevProgrammeIdRef = useRef<number | undefined>(undefined)

  const { data: allProjets = [] } = useQuery({
    queryKey: projetQueryKeys.byProgramme(idProgramme),
    queryFn: () => projetService.getAll(idProgramme!),
    enabled: idProgramme != null,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!idProgramme) {
      prevProjetsIdsRef.current = ''
      prevProgrammeIdRef.current = undefined
      setProjets([])
      setActiveProjet(null)
      return
    }

    // Signature stable des projets reçus (évite le re-render infini)
    const newIdsSignature = allProjets.map((p) => p.id_projet).join(',')
    const programmeChanged = prevProgrammeIdRef.current !== idProgramme

    if (newIdsSignature === prevProjetsIdsRef.current && !programmeChanged) {
      // Aucun changement réel — ne pas mettre à jour le store
      return
    }

    prevProjetsIdsRef.current = newIdsSignature
    prevProgrammeIdRef.current = idProgramme

    setProjets(allProjets)

    if (allProjets.length === 0) {
      setActiveProjet(null)
      return
    }

    const current = useProjetStore.getState().activeProjet
    const persistedId = current?.id_projet

    const next =
      (persistedId != null
        ? allProjets.find((p) => p.id_projet === persistedId)
        : undefined) ?? allProjets[0]

    if (!current || current.id_projet !== next.id_projet) {
      setActiveProjet(next)
    }
  }, [allProjets, idProgramme, setActiveProjet, setProjets])

  return children
}

