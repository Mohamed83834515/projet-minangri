import { apiClient } from '@/axios/api'
import type { Convention } from '@/simadou/allTypes/convention'
import type { ConventionFormData } from '@/simadou/schemas/conventionSchema'

const ENDPOINT = '/conventions/'

export const conventionService = {
  async getAll(): Promise<Convention[]> {
    return apiClient.request<Convention[]>(ENDPOINT, { method: 'GET' })
  },

  async getById(id: number): Promise<Convention> {
    return apiClient.request<Convention>(`${ENDPOINT}${id}/`, { method: 'GET' })
  },

  async create(data: ConventionFormData): Promise<Convention> {
    return apiClient.request<Convention>(ENDPOINT, {
      method: 'POST',
      data: {
        ...data,
        partenaire_conv: data.partenaire_conv ?? null,
      },
    })
  },

  async update(
    id: number,
    data: ConventionFormData
  ): Promise<Convention> {
    return apiClient.request<Convention>(`${ENDPOINT}${id}/`, {
      method: 'PUT',
      data: {
        ...data,
        partenaire_conv: data.partenaire_conv ?? null,
      },
    })
  },

  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${ENDPOINT}${id}/`, {
      method: 'DELETE',
    })
  },
}
