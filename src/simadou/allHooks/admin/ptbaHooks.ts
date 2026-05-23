import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ptbaService from '@/simadou/allSercices/ptbaService'

export const useGetPtbas = () => {
    return useQuery({
        queryKey: ['ptba-activites-all'],
        queryFn: () => ptbaService.getAll("001")
    })
}

