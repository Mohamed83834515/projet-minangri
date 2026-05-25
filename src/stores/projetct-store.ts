import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Programme } from '@/simadou/allTypes/programme'

interface ProjectStore {
  activeProgramme: Programme | null
  programmes: Programme[]
  setActiveProgramme: (programme: Programme) => void
  setProgrammes: (programmes: Programme[]) => void
}

export const useProjectStore = create<ProjectStore>()(
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

/** @deprecated Use activeProgramme — kept for gradual migration */
export type Project = Programme
