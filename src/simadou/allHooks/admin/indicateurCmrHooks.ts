import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { IndicateurCmrFormData } from '@/simadou/allTypes'
import { indicateurCmrService } from '@/simadou/allSercices/indicateurCmrService'
import { invalidateAndRefetch } from '@/simadou/allHooks/admin/queryInvalidation'
import { CibleCmrFormData, cibleCmrService } from '@/simadou/allSercices/cibleCmrService'

export const indicateurCmrQueryKeys = {
  all: ['indicateurs-cmr'] as const,
}

export const cibleCmrQueryKeys = {
  all: ['cibles-cmr'] as const,
  byProjet: (codeProjet: string | undefined) =>
    [...cibleCmrQueryKeys.all, 'by-projet', codeProjet] as const,
}

async function invalidateCibleCmrQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  codeProjet?: string
) {
  await invalidateAndRefetch(queryClient, cibleCmrQueryKeys.all)
  if (codeProjet) {
    await invalidateAndRefetch(
      queryClient,
      cibleCmrQueryKeys.byProjet(codeProjet)
    )
  }
}

export function useGetIndicateursCmr() {
  return useQuery({
    queryKey: indicateurCmrQueryKeys.all,
    queryFn: () => indicateurCmrService.getAll(),
  })
}

export function useGetIndicateurCmr(id: number | null | undefined) {
  return useQuery({
    queryKey: [...indicateurCmrQueryKeys.all, id] as const,
    queryFn: () => indicateurCmrService.getById(id!),
    enabled: id != null,
  })
}

export const getIndicateurCmrs = async () => indicateurCmrService.getAll()

export function useCreateIndicateurCmr() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IndicateurCmrFormData) => indicateurCmrService.create(data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCmrQueryKeys.all)
    },
  })
}

export function useUpdateIndicateurCmr() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IndicateurCmrFormData> }) =>
      indicateurCmrService.update(id, data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCmrQueryKeys.all)
    },
  })
}

export function useDeleteIndicateurCmr() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => indicateurCmrService.delete(id),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCmrQueryKeys.all)
    },
  })
}

export function useGetCiblesCmr(codeProjet: string | undefined) {
  return useQuery({
    queryKey: cibleCmrQueryKeys.byProjet(codeProjet),
    queryFn: () => cibleCmrService.getByProjet(codeProjet!),
    enabled: !!codeProjet,
  })
}

export function useGetAllCiblesCmr() {
  return useQuery({
    queryKey: cibleCmrQueryKeys.all,
    queryFn: () => cibleCmrService.getAll(),
  })
}

export function useGetCiblesCmrByIndicateurCrp(
  indicateurCrpId: number | null | undefined
) {
  return useQuery({
    queryKey: [
      ...cibleCmrQueryKeys.all,
      'by-indicateur-crp',
      indicateurCrpId,
    ] as const,
    queryFn: () => cibleCmrService.getByIndicateur(indicateurCrpId!),
    enabled: indicateurCrpId != null,
  })
}

export function useCreateCibleCmr(codeProjet: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CibleCmrFormData) =>
      cibleCmrService.create(data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateCibleCmrQueries(queryClient, codeProjet)
    },
  })
}

export function useUpdateCibleCmr(codeProjet: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CibleCmrFormData
    }) => cibleCmrService.update(id, data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateCibleCmrQueries(queryClient, codeProjet)
    },
  })
}

export function useDeleteCibleCmr(codeProjet?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cibleCmrService.delete(id),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateCibleCmrQueries(queryClient, codeProjet)
    },
  })
}
