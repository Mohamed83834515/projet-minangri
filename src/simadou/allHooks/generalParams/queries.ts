import { apiClient } from "@/axios/api"
import { GeneralParams } from "@/simadou/allTypes/generalParams"
import { useQuery } from "@tanstack/react-query"



export const generalParamsKeys = {
  all:    ()  => ['general-params']          as const,
  single: ()  => ['general-params', 'single'] as const,
}





export function useGeneralParamsQuery() {
  return 0
}