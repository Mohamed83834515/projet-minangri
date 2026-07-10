import { apiClient } from '@/axios/api'
import type { Convention, ConventionApiPayload } from '@/simadou/allTypes/convention'
import { filterConventionsByProjet } from '@/simadou/lib/conventionUtils'
import { normalizeApiList } from './apiListUtils'

const ENDPOINT = '/conventions/'

export const conventionService = {
  async getAll(): Promise<Convention[]> {
    const response = await apiClient.request<unknown>(ENDPOINT, { method: 'GET' })
    return normalizeApiList<Convention>(response)
  },

  async getByProjet(idProjet: number): Promise<Convention[]> {
    try {
      const byParam = await apiClient.request<unknown>(ENDPOINT, {
        method: 'GET',
        params: { projet: idProjet },
      })
      const items = normalizeApiList<Convention>(byParam)
      if (items.length > 0) return items
    } catch {
      // Repli filtrage client
    }

    const all = await this.getAll()
    return filterConventionsByProjet(all, idProjet)
  },

  async create(data: ConventionApiPayload): Promise<Convention> {
    return apiClient.request<Convention>(ENDPOINT, {
      method: 'POST',
      data: {
        ...data,
        partenaire_conv: data.partenaire_conv ?? null,
      },
    })
  },

  async update(id: number, data: ConventionApiPayload): Promise<Convention> {
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
