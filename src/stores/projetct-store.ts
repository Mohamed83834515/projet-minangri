import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  code: string
  nom: string
  periode: string
  description: string
}

interface ProjectStore {
  activeProject: Project | null
  projects: Project[]
  setActiveProject: (project: Project) => void
  setProjects: (projects: Project[]) => void
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      activeProject: null,
      projects: [],
      setActiveProject: (project) => set({ activeProject: project }),
      setProjects: (projects) => set({ projects }),
    }),
    { name: 'active-project' }
  )
)