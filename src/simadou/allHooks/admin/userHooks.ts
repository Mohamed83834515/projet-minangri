import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { publicInstance } from '@/axios/axiosInstance'

export const useGetusers = () => {
  return useQuery({
    queryKey: ['users'],

    queryFn: async () => {
      const res = await publicInstance.get('/users')
      return res.data.map((user: any) => ({
        ...user,
        username: user.name, 
      }))
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
