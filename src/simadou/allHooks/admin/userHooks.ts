import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { publicInstance } from '@/axios/axiosInstance'
import { personnelService } from '@/simadou/allSercices/personnelService'

export const useGetusers = () => {
  return useQuery({
    queryKey: ['users'],

    queryFn: async () => {
      const res = await personnelService.getAll()
      return res
    },
  })
}

export const useAddUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      // const res = await axiosInstance.post("/users", _data);
      // return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      // ...
    },
  })
}
