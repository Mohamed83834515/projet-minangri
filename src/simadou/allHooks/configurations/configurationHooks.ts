import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/axios/api'
import type {
  Configuration,
  CreateConfiguration,
  ConfigFieldKey,
  ConfigFieldValue,
} from '@/simadou/schemas/configurations.schema'

import { toast } from 'sonner'

export const configKeys = {
  all:     ()    => ['configurations']              as const,
  list:    ()    => ['configurations', 'list']      as const,
  default: ()    => ['configurations', 'default']   as const,
  detail:  (id: number) => ['configurations', 'detail', id] as const,
}

// ── List ──────────────────────────────────────────────────────────────────────
export const useConfigurations = () =>
  useQuery({
    queryKey: configKeys.list(),
    queryFn:  () => apiClient.request<Configuration[]>('/configurations/'),
  })

// ── Default ───────────────────────────────────────────────────────────────────
export const useDefaultConfiguration = () =>
  useQuery({
    queryKey: configKeys.default(),
    queryFn:  () => apiClient.request<Configuration>('/configurations/default'),
  })

// ── Inline patch — single field ───────────────────────────────────────────────
export const usePatchConfigField = (configId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ field, value }: { field: ConfigFieldKey; value: ConfigFieldValue }) =>
      apiClient.request<Configuration>(`/configurations/${configId}`, {
        method: 'PATCH',
        data:   { [field]: value },
      }),

    // Optimistic update
    onMutate: async ({ field, value }) => {
      await queryClient.cancelQueries({ queryKey: configKeys.detail(configId) })
      const previous = queryClient.getQueryData<Configuration>(configKeys.detail(configId))

      queryClient.setQueryData<Configuration>(
        configKeys.detail(configId),
        old => old ? { ...old, [field]: value } : old
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      // Revert on error
      if (context?.previous) {
        queryClient.setQueryData(configKeys.detail(configId), context.previous)
      }
      toast.error('Échec de la mise à jour')
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: configKeys.list() })
    },
  })
}

// ── Set default ───────────────────────────────────────────────────────────────
export const useSetDefaultConfiguration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.request(`/configurations/${id}/default`, { method: 'PATCH' }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: configKeys.list() })
      queryClient.invalidateQueries({ queryKey: configKeys.default() })
      toast.success('Configuration définie par défaut')
    },

    onError: () => toast.error('Échec de la mise à jour'),
  })
}

// ── Create ────────────────────────────────────────────────────────────────────
export const useCreateConfiguration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateConfiguration) =>
      apiClient.request<Configuration>('/configurations/', {
        method: 'POST',
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: configKeys.list() })
      toast.success('Configuration créée')
    },

    onError: () => toast.error('Échec de la création'),
  })
}

// ── Delete ────────────────────────────────────────────────────────────────────
export const useDeleteConfiguration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.request(`/configurations/${id}`, { method: 'DELETE' }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: configKeys.list() })
      toast.success('Configuration supprimée')
    },

    onError: () => toast.error('Échec de la suppression'),
  })
}