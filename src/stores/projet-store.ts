import { create } from 'zustand'
import type { Projet } from '@/simadou/allTypes'

const STATIC_PROJET_CODE = 'PDCVR'

// Créer un projet par défaut avec toutes les propriétés nécessaires
const defaultProjet: Projet = {
  id_projet: 0,
  code_projet: STATIC_PROJET_CODE,
  intitule_projet: 'Chargement du projet PDCVR...',
} as Projet

interface ProjetStore {
  activeProjet: Projet
  projets: Projet[]
  setActiveProjet: (projet: Projet) => void
  setProjets: (projets: Projet[]) => void
}

/** Store interne avec code projet statique PDCVR. */
export const useProjetStore = create<ProjetStore>()((set) => ({
  activeProjet: defaultProjet,
  projets: [],
  setActiveProjet: (projet) => set({ activeProjet: projet }),
  setProjets: (projets) => set({ projets }),
}))

// Hooks personnalisés pour récupérer les informations du projet actif
export const useProjetCode = () => {
  const activeProjet = useProjetStore((state) => state.activeProjet)
  return activeProjet?.code_projet || STATIC_PROJET_CODE
}

export const useProjetIntitule = () => {
  const activeProjet = useProjetStore((state) => state.activeProjet)
  return activeProjet?.intitule_projet || 'Projet PDCVR'
}

export const useProjetId = () => {
  const activeProjet = useProjetStore((state) => state.activeProjet)
  return activeProjet?.id_projet || 0
}