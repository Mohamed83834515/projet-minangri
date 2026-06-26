import { apiClient } from '@/axios/api'
import type {
  IndicateurCmrProjet,
  IndicateurCmrProjetFormData,
} from '../allTypes/indicateurCmrProjet'
import { normalizeIndicateurCmrProjetFromApi } from '@/simadou/lib/indicateurCmrProjetUtils'
import { normalizeApiList } from './apiListUtils'

function toIndicateurCmrProjetApiPayload(
  data: Partial<IndicateurCmrProjetFormData>
): Record<string, unknown> {
  const { resultat_cmr, indicateur_iop, referentiel_cmr, code_projet, ...rest } = data
  return {
    ...rest,
    ...(resultat_cmr !== undefined ? { resultat_cmr } : {}),
    ...(indicateur_iop !== undefined ? { indicateur_iop } : {}),
    ...(referentiel_cmr !== undefined
      ? { referentiel_cmr: referentiel_cmr ?? null }
      : {}),
    ...(code_projet !== undefined ? { code_projet: code_projet ?? null } : {}),
  }
}

export const indicateurCmrProjetService = {
  getAll: async (): Promise<IndicateurCmrProjet[]> => {
    const response = await apiClient.request<unknown>('/indicateurs-cmr-projets/')
    return normalizeApiList<Record<string, unknown>>(response).map(
      normalizeIndicateurCmrProjetFromApi
    )
  },

  getByProjet: async (codeProjet: string): Promise<IndicateurCmrProjet[]> => {
    const response = await apiClient.request<unknown>(
      `/indicateurs-cmr-projets/?code_projet=${encodeURIComponent(codeProjet)}`
    )
    return normalizeApiList<Record<string, unknown>>(response).map(
      normalizeIndicateurCmrProjetFromApi
    )
  },

  getById: async (id: number): Promise<IndicateurCmrProjet> => {
    const response = await apiClient.request<Record<string, unknown>>(
      `/indicateurs-cmr-projets/${id}/`
    )
    return normalizeIndicateurCmrProjetFromApi(response)
  },

  create: async (
    data: IndicateurCmrProjetFormData
  ): Promise<IndicateurCmrProjet> => {
    const response = await apiClient.request<Record<string, unknown>>(
      '/indicateurs-cmr-projets/',
      {
        method: 'POST',
        data: toIndicateurCmrProjetApiPayload(data),
      }
    )
    return normalizeIndicateurCmrProjetFromApi(response)
  },

  update: async (
    id: number,
    data: Partial<IndicateurCmrProjetFormData>
  ): Promise<IndicateurCmrProjet> => {
    const response = await apiClient.request<Record<string, unknown>>(
      `/indicateurs-cmr-projets/${id}/`,
      {
        method: 'PUT',
        data: toIndicateurCmrProjetApiPayload(data),
      }
    )
    return normalizeIndicateurCmrProjetFromApi(response)
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.request<void>(`/indicateurs-cmr-projets/${id}/`, {
      method: 'DELETE',
    })
  },
}