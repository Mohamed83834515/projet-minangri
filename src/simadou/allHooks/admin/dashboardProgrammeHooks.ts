import { useActiveProgrammeCode } from "@/hooks/use-active-programme"
import { dashboardService } from "@/simadou/allSercices/dashbordService"
import { useQuery } from "@tanstack/react-query"

export const useGetAvancementDirections = () => {
  const codeProgramme = useActiveProgrammeCode()

  return useQuery({
    queryKey: ['avancement-direction-all', codeProgramme],
    queryFn: () => dashboardService.avancementParDirections(codeProgramme!),
    enabled: !!codeProgramme,
  })
}