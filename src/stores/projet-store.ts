import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Projet } from '@/simadou/allTypes'

interface ProjetStore {
  activeProjet: Projet | null
  projets: Projet[]
  setActiveProjet: (projet: Projet | null) => void
  setProjets: (projets: Projet[]) => void
}

/** Store interne pour la sélection du projet actif. */
export const useProjetStore = create<ProjetStore>()(
  persist(
    (set) => ({
      activeProjet: null,
      projets: [],
      setActiveProjet: (projet) => set({ activeProjet: projet }),
      setProjets: (projets) => set({ projets }),
    }),
    { name: 'active-projet' }
  )
)
