import { apiClient } from '@/axios/api'
import type { PartBailleur, PartBailleurApiPayload } from '@/simadou/allTypes/partBailleur'
import { filterPartsForActiviteGrid, filterPartsForActiviteGridRelaxed } from '@/simadou/lib/partBailleurUtils'
import { normalizeApiList } from './apiListUtils'

const ENDPOINT = '/parts-bailleurs/'

export type PartBailleurActiviteQuery = {
  activitePtbaId: number
  projetId: number
  versionPtbaId: number
  codeProjet?: string
  anneePtbaYear?: number
}

const partBailleurService = {
  async getAll(): Promise<PartBailleur[]> {
    const response = await apiClient.request<unknown>(ENDPOINT, { method: 'GET' })
    return normalizeApiList<PartBailleur>(response)
  },

  async getForActivite(
    query: PartBailleurActiviteQuery
  ): Promise<PartBailleur[]> {
    const {
      activitePtbaId,
      projetId,
      versionPtbaId,
      codeProjet,
      anneePtbaYear,
    } = query

    const applyFilter = (items: PartBailleur[]) =>
      filterPartsForActiviteGrid(
        items,
        activitePtbaId,
        projetId,
        versionPtbaId,
        codeProjet,
        anneePtbaYear
      )

    const paramVariants: Record<string, number>[] = [
      {
        activite_ptba: activitePtbaId,
        projet: projetId,
        annee: versionPtbaId,
      },
      { activite_ptba: activitePtbaId, projet: projetId },
      { activite_ptba: activitePtbaId },
      { activite_ptba_id: activitePtbaId },
    ]

    for (const params of paramVariants) {
      try {
        const response = await apiClient.request<unknown>(ENDPOINT, {
          method: 'GET',
          params,
        })
        const items = normalizeApiList<PartBailleur>(response)
        if (items.length === 0) continue

        const filtered = applyFilter(items)
        if (filtered.length > 0) return filtered

        const relaxed = filterPartsForActiviteGridRelaxed(
          items,
          activitePtbaId,
          projetId,
          codeProjet
        )
        if (relaxed.length > 0) return relaxed
      } catch {
        // Repli sur la variante suivante
      }
    }

    const all = await this.getAll()
    return applyFilter(all)
  },

  async create(data: PartBailleurApiPayload): Promise<PartBailleur> {
    return apiClient.request<PartBailleur>(ENDPOINT, {
      method: 'POST',
      data,
    })
  },

  async update(
    id: number,
    data: PartBailleurApiPayload
  ): Promise<PartBailleur> {
    return apiClient.request<PartBailleur>(`${ENDPOINT}${id}/`, {
      method: 'PUT',
      data,
    })
  },

  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${ENDPOINT}${id}/`, { method: 'DELETE' })
  },
}

export default partBailleurService
