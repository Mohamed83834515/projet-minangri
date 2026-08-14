import { create } from 'zustand'
import type { Projet } from '@/simadou/allTypes'

const STATIC_PROJET_CODE = 'PDCVR'

// Créer un projet par défaut avec toutes les propriétés nécessaires
const defaultProjet: Projet = {
  id_projet: 0,
  code_projet: STATIC_PROJET_CODE,
  intitule_projet: 'Projet PDCVR',
  // Ajoute ici toutes les autres propriétés requises par le type Projet
  // avec des valeurs par défaut
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