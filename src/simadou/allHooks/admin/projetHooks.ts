import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useActiveProgrammeId } from '@/hooks/use-active-programme'
import { projetBelongsToProgramme } from '@/simadou/allTypes/projet'
import { projetService } from '@/simadou/allSercices/projetService'
import type { ProjectCreateSubmitData } from '@/simadou/schemas/projetSchema'

export const projetQueryKeys = {
  all: ['projets'] as const,
  byProgramme: (idProgramme: number | undefined) =>
    [...projetQueryKeys.all, idProgramme] as const,
}

export function useGetProjets() {
  const idProgramme = useActiveProgrammeId()

  return useQuery({
    queryKey: projetQueryKeys.byProgramme(idProgramme),
    queryFn: () => projetService.getAll(),
    enabled: idProgramme != null,
    select: (projets) =>
      idProgramme != null
        ? projets.filter((p) => projetBelongsToProgramme(p, idProgramme))
        : [],
  })
}

export function useCreateProjet(idProgramme: number | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProjectCreateSubmitData) => {
      if (idProgramme == null) {
        return Promise.reject(new Error('Programme actif requis'))
      }
      return projetService.create({
        ...data,
        programme_projet: idProgramme,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projetQueryKeys.all })
    },
  })
}
