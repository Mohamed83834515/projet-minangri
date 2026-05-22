import { apiClient } from "@/lib/api";
import { GeneralParams } from '@/types/generalParams'

const generalParamsServices = {
    async getAll() :   Promise<GeneralParams>{
        return apiClient.request<GeneralParams>('/params')
    }
}


export default generalParamsServices