import { useQuery } from '@tanstack/react-query'
import ptbaService from '@/simadou/allSercices/ptbaService'
import { useActiveProgrammeCode } from '@/hooks/use-active-project'

export const useGetPtbas = () => {
  const codeProgramme = useActiveProgrammeCode()

  return useQuery({
    queryKey: ['ptba-activites-all', codeProgramme],
    queryFn: () => ptbaService.getAll(codeProgramme!),
    enabled: !!codeProgramme,
  })
}
