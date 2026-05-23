import { useQuery } from '@tanstack/react-query'
import ptbaService from '@/simadou/allSercices/ptbaService'
import { PROGRAMME_CODE_PTBA } from '@/simadou/constants/programmation'

export const useGetPtbas = () => {
  return useQuery({
    queryKey: ['ptba-activites-all', PROGRAMME_CODE_PTBA],
    queryFn: () => ptbaService.getAll(PROGRAMME_CODE_PTBA),
  })
}
