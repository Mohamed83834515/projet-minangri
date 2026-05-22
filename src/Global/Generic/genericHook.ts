import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { axiosInstance } from '@/axios/axiosInstance'
import toast from 'react-hot-toast'

interface CrudMessages {
  addSuccess?: string
  addError?: string
  updateSuccess?: string
  updateError?: string
  deleteSuccess?: string
  deleteError?: string
}

interface CrudConfig {
  endpoint: string
  queryKey: string
  messages?: CrudMessages
  idField?: string
}

export const createCrudHooks = <TEntity = any, TFormData = TEntity>(
  config: CrudConfig
) => {
  const { endpoint, queryKey, messages = {}, idField = 'id' } = config

  const defaultMessages: CrudMessages = {
    addSuccess: `${queryKey} ajouté avec succès`,
    addError: `Erreur lors de l'ajout`,
    updateSuccess: `${queryKey} mis à jour avec succès`,
    updateError: `Erreur lors de la mise à jour`,
    deleteSuccess: `${queryKey} supprimé avec succès`,
    deleteError: `Erreur lors de la suppression`,
    ...messages,
  }

  const useAdd = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (data: Partial<TFormData> | Record<string, any>) => {
        const res = await axiosInstance.post<TEntity>(endpoint, data)
        return res.data
      },
      onSuccess: () => {
        toast.success(defaultMessages.addSuccess!)
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message?.[0] ??
          error?.response?.data?.error ??
          defaultMessages.addError
        toast.error(message)
      },
    })
  }

  const useGetAll = (
    options?: Omit<UseQueryOptions<TEntity[]>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<TEntity[]>({
      queryKey: [queryKey, endpoint],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get<TEntity[] | { data: TEntity[] }>(
            endpoint
          )
          const data = (res.data as any)?.data || res.data || []
          if (!Array.isArray(data)) {
            return []
          }
          return data
        } catch (error: any) {
          if (error.response?.status === 403) {
            toast.error(
              `Accès refusé : Vous n'avez pas la permission d'accéder à ${queryKey}`
            )
          } else if (error.response?.status === 401) {
            toast.error('Vous devez vous reconnecter')
          }
          throw error
        }
      },
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return false
        }
        return failureCount < 1
      },
      placeholderData: [],
      ...options,
    })
  }

  const useGetOne = (
    id: number | string,
    options?: Omit<UseQueryOptions<TEntity>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<TEntity>({
      queryKey: [queryKey, endpoint, id],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get<TEntity | { data: TEntity }>(
            `${endpoint}/${id}`
          )
          return (res.data as any)?.data || res.data
        } catch (error: any) {
          if (error.response?.status === 403) {
            toast.error(
              `Accès refusé : Vous n'avez pas la permission d'accéder à ce ${queryKey}`
            )
          } else if (error.response?.status === 401) {
            toast.error('Vous devez vous reconnecter')
          } else if (error.response?.status === 404) {
            toast.error(`${queryKey} introuvable`)
          }
          throw error
        }
      },
      enabled: !!id,
      retry: (failureCount, error: any) => {
        if ([401, 403, 404].includes(error.response?.status)) {
          return false
        }
        return failureCount < 1
      },
      ...options,
    })
  }

  const useUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: number | string
        data: Partial<TFormData> | Record<string, any>
      }) => {
        const res = await axiosInstance.put<TEntity>(`${endpoint}/${id}`, data)
        return res.data
      },
      onSuccess: (_, variables) => {
        toast.success(defaultMessages.updateSuccess!)
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        queryClient.invalidateQueries({
          queryKey: [queryKey, endpoint, variables.id],
        })
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message?.[0] ??
          error?.response?.data?.error ??
          defaultMessages.updateError
        toast.error(message)
      },
    })
  }

  const useUpdateByObject = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (data: TEntity) => {
        const id = (data as any)[idField]
        if (!id)
          throw new Error(`Le champ ${idField} est manquant dans les données`)
        const res = await axiosInstance.put<TEntity>(`${endpoint}/${id}`, data)
        return res.data
      },
      onSuccess: (_, variables) => {
        toast.success(defaultMessages.updateSuccess!)
        const id = (variables as any)[idField]
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        queryClient.invalidateQueries({ queryKey: [queryKey, endpoint, id] })
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message?.[0] ??
          error?.response?.data?.error ??
          defaultMessages.updateError
        toast.error(message)
      },
    })
  }

  const useDelete = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number | string) => {
        const res = await axiosInstance.delete(`${endpoint}/${id}`)
        return res.data
      },
      onSuccess: (_, id) => {
        toast.success(defaultMessages.deleteSuccess!)
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        queryClient.invalidateQueries({ queryKey: [queryKey, endpoint, id] })
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message?.[0] ??
          error?.response?.data?.error ??
          defaultMessages.deleteError
        toast.error(message)
      },
    })
  }

  const useDeleteByObject = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (data: TEntity) => {
        const id = (data as any)[idField]
        if (!id)
          throw new Error(`Le champ ${idField} est manquant dans les données`)
        const res = await axiosInstance.delete(`${endpoint}/${id}`)
        return res.data
      },
      onSuccess: (_, variables) => {
        toast.success(defaultMessages.deleteSuccess!)
        const id = (variables as any)[idField]
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        queryClient.invalidateQueries({ queryKey: [queryKey, endpoint, id] })
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message?.[0] ??
          error?.response?.data?.error ??
          defaultMessages.deleteError
        toast.error(message)
      },
    })
  }

  const usePatch = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: number | string
        data: Partial<TFormData> | Record<string, any>
      }) => {
        const res = await axiosInstance.patch<TEntity>(
          `${endpoint}/${id}`,
          data
        )
        return res.data
      },
      onSuccess: (_, variables) => {
        toast.success(defaultMessages.updateSuccess!)
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        queryClient.invalidateQueries({
          queryKey: [queryKey, endpoint, variables.id],
        })
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message?.[0] ??
          error?.response?.data?.error ??
          defaultMessages.updateError
        toast.error(message)
      },
    })
  }

  return {
    useAdd,
    useGetAll,
    useGetOne,
    usePatch,
    useUpdate,
    useUpdateByObject,
    useDelete,
    useDeleteByObject,
  }
}
