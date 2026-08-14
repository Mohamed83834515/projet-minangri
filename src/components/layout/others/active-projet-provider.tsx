import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { projetService } from '@/simadou/allSercices/projetService'
import { useProjetStore } from '@/stores/projet-store'
import { projetQueryKeys } from '@/simadou/allHooks/admin/projetHooks'

const STATIC_PROJET_CODE = 'PDCVR'

export function ActiveProjetProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const setProjets = useProjetStore((s) => s.setProjets)
  const setActiveProjet = useProjetStore((s) => s.setActiveProjet)
  const activeProjet = useProjetStore((s) => s.activeProjet)

  const { data: allProjets = [] } = useQuery({
    queryKey: projetQueryKeys.getAllWithOutProgramme,
    queryFn: () => projetService.getAllWithOutProgramme(),
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    // Filtrer les projets pour ne garder que ceux avec le code PDCVR
    const pdcvrProjets = allProjets.filter(
      (projet) => projet.code_projet === STATIC_PROJET_CODE
    )

    setProjets(pdcvrProjets)

    // Si on a des projets PDCVR, sélectionner le premier
    if (pdcvrProjets.length > 0) {
      // Vérifier si le projet actif est déjà un PDCVR valide
      const currentIsValid = activeProjet && pdcvrProjets.some(
        (p) => p.id_projet === activeProjet.id_projet
      )

      if (!currentIsValid) {
        setActiveProjet(pdcvrProjets[0])
      }
    }
  }, [allProjets, setProjets, setActiveProjet, activeProjet])

  return children
}