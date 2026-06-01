import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Programme } from '@/simadou/allTypes/programme'

interface ProgrammeStore {
  activeProgramme: Programme | null
  programmes: Programme[]
  setActiveProgramme: (programme: Programme) => void
  setProgrammes: (programmes: Programme[]) => void
}

/** Store interne pour la sélection du programme actif. */
export const useProgrammeStore = create<ProgrammeStore>()(
  persist(
    (set) => ({
      activeProgramme: null,
      programmes: [],
      setActiveProgramme: (programme) => set({ activeProgramme: programme }),
      setProgrammes: (programmes) => set({ programmes }),
    }),
    { name: 'active-programme' }
  )
)

/**
 * @deprecated Utiliser `useProgrammeStore` à la place.
 * Conservé temporairement pour les imports existants.
 */
export const useProjectStore = useProgrammeStore

/** @deprecated Utiliser le type `Programme` directement. */
export type Project = Programme
