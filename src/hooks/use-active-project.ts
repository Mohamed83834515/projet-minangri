// src/hooks/use-active-project.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useProjectStore } from '@/stores/projetct-store'

export function useActiveProject() {
  const { activeProject } = useProjectStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (activeProject) {
      // Invalide TOUT le cache React Query → re-fetch automatique
      queryClient.invalidateQueries()
    }
  }, [activeProject?.id])

  return activeProject
}