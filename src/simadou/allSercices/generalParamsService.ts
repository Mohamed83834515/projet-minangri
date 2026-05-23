
import { apiClient } from '@/axios/api'
import { GeneralParams } from '../allTypes/generalParams'

const generalParamsServices = {
    async getAll() :   Promise<GeneralParams>{
        return apiClient.request<GeneralParams>('/params')
    }
}


export default generalParamsServices