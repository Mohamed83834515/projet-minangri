import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { IndicateurCmrFormData } from '@/simadou/allTypes'
import { indicateurCmrProjetService } from '@/simadou/allSercices/indicateurCmrProjetService'
import {
  cibleCmrProjetService,
  type CibleCmrProjetFormData,
} from '@/simadou/allSercices/cibleCmrProjetService'
import { invalidateAndRefetch } from '@/simadou/allHooks/admin/queryInvalidation'

export const indicateurCmrQueryKeys = {
  all: ['indicateurs-cmr'] as const,
}

export const cibleCmrProjetQueryKeys = {
  all: ['cibles-cmr-projet'] as const,
  byProjet: (codeProjet: string | undefined) =>
    [...cibleCmrProjetQueryKeys.all, 'by-projet', codeProjet] as const,
}

async function invalidateCibleCmrProjetQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  codeProjet?: string
) {
  await invalidateAndRefetch(queryClient, cibleCmrProjetQueryKeys.all)
  if (codeProjet) {
    await invalidateAndRefetch(
      queryClient,
      cibleCmrProjetQueryKeys.byProjet(codeProjet)
    )
  }
}

export function useGetIndicateursCmrProjet() {
  return useQuery({
    queryKey: indicateurCmrQueryKeys.all,
    queryFn: () => indicateurCmrProjetService.getAll(),
  })
}

export function useGetIndicateurCmrProjet(id: number | null | undefined) {
  return useQuery({
    queryKey: [...indicateurCmrQueryKeys.all, id] as const,
    queryFn: () => indicateurCmrProjetService.getById(id!),
    enabled: id != null,
  })
}

export const getIndicateurCmrs = async () => indicateurCmrProjetService.getAll()

export function useCreateIndicateurCmrProjet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IndicateurCmrFormData) => indicateurCmrProjetService.create(data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCmrQueryKeys.all)
    },
  })
}

export function useUpdateIndicateurCmrProjet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IndicateurCmrFormData> }) =>
      indicateurCmrProjetService.update(id, data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCmrQueryKeys.all)
    },
  })
}

export function useDeleteIndicateurCmrProjet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => indicateurCmrProjetService.delete(id),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCmrQueryKeys.all)
    },
  })
}

export function useGetCiblesCmrProjet(codeProjet: string | undefined) {
  return useQuery({
    queryKey: cibleCmrProjetQueryKeys.byProjet(codeProjet),
    queryFn: () => cibleCmrProjetService.getByProjet(codeProjet!),
    enabled: !!codeProjet,
  })
}

export function useGetAllCiblesCmrProjet() {
  return useQuery({
    queryKey: cibleCmrProjetQueryKeys.all,
    queryFn: () => cibleCmrProjetService.getAll(),
  })
}

export function useGetCiblesCmrProjetByIndicateurCrp(
  indicateurCrpId: number | null | undefined
) {
  return useQuery({
    queryKey: [
      ...cibleCmrProjetQueryKeys.all,
      'by-indicateur-crp',
      indicateurCrpId,
    ] as const,
    queryFn: () => cibleCmrProjetService.getByIndicateur(indicateurCrpId!),
    enabled: indicateurCrpId != null,
  })
}

export function useCreateCibleCmrProjet(codeProjet: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CibleCmrProjetFormData) =>
      cibleCmrProjetService.create({
        ...data,
        code_projet: codeProjet ?? data.code_projet ?? null,
      }),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateCibleCmrProjetQueries(queryClient, codeProjet)
    },
  })
}

export function useUpdateCibleCmrProjet(codeProjet: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CibleCmrProjetFormData
    }) => cibleCmrProjetService.update(id, data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateCibleCmrProjetQueries(queryClient, codeProjet)
    },
  })
}

export function useDeleteCibleCmrProjet(codeProjet?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cibleCmrProjetService.delete(id),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateCibleCmrProjetQueries(queryClient, codeProjet)
    },
  })
}
