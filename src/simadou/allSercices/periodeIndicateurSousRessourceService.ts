import { apiClient } from '@/axios/api'
import type {
  DocumentationCmrWritePayload,
  FondCarteWritePayload,
  PeriodeSousRessourceEnregistrement,
  PeriodeSousRessourceType,
  PeriodeSousRessourceWritePayload,
} from '@/simadou/allTypes/periodeIndicateurSousRessource'
import { isSousRessourceWithDocuments } from '@/simadou/allTypes/periodeIndicateurSousRessource'
import { buildSousRessourceDocumentsFormData } from '@/simadou/allfonctionalities/suivi-resultats/suivi-indicateurs/sous-ressource/periodeSousRessourceFormUtils'
import { normalizeApiList } from './apiListUtils'

const PERIODE_BASE_URL = '/periodes-indicateurs/'

const NESTED_LIST_SEGMENTS: Record<PeriodeSousRessourceType, string> = {
  documentations: 'documentations',
  'fonds-carte': 'fonds-carte',
  'tableaux-synthese': 'tableaux-synthese',
}

const RESOURCE_URLS: Record<PeriodeSousRessourceType, string> = {
  'tableaux-synthese': '/tableaux-synthese/',
  documentations: '/documentations-cmr/',
  'fonds-carte': '/fonds-carte/',
}

export type SousRessourceDocumentsInput = {
  newFiles: File[]
  existingDocuments: string[]
}

function buildNestedListUrl(
  periodeId: number,
  resource: PeriodeSousRessourceType
): string {
  return `${PERIODE_BASE_URL}${periodeId}/${NESTED_LIST_SEGMENTS[resource]}/`
}

function buildItemUrl(
  resource: PeriodeSousRessourceType,
  itemId: number
): string {
  return `${RESOURCE_URLS[resource]}${itemId}/`
}

function buildMultipartBody(
  data: PeriodeSousRessourceWritePayload,
  documents?: SousRessourceDocumentsInput
): FormData {
  const payload = data as DocumentationCmrWritePayload | FondCarteWritePayload
  return buildSousRessourceDocumentsFormData(payload, {
    newFiles: documents?.newFiles ?? [],
    existingDocuments: documents?.existingDocuments ?? [],
  })
}

export function createPeriodeSousRessourceService(
  resource: PeriodeSousRessourceType
) {
  return {
    getAll: async (
      periodeId: number
    ): Promise<PeriodeSousRessourceEnregistrement[]> => {
      const response = await apiClient.request<unknown>(
        buildNestedListUrl(periodeId, resource)
      )
      return normalizeApiList<PeriodeSousRessourceEnregistrement>(response)
    },

    create: async (
      data: PeriodeSousRessourceWritePayload,
      documents?: SousRessourceDocumentsInput
    ): Promise<PeriodeSousRessourceEnregistrement> => {
      if (isSousRessourceWithDocuments(resource)) {
        return await apiClient.request<PeriodeSousRessourceEnregistrement>(
          RESOURCE_URLS[resource],
          {
            method: 'POST',
            data: buildMultipartBody(data, documents),
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      }

      return await apiClient.request<PeriodeSousRessourceEnregistrement>(
        RESOURCE_URLS[resource],
        { method: 'POST', data }
      )
    },

    update: async (
      itemId: number,
      data: PeriodeSousRessourceWritePayload,
      documents?: SousRessourceDocumentsInput
    ): Promise<PeriodeSousRessourceEnregistrement> => {
      if (isSousRessourceWithDocuments(resource)) {
        return await apiClient.request<PeriodeSousRessourceEnregistrement>(
          buildItemUrl(resource, itemId),
          {
            method: 'PUT',
            data: buildMultipartBody(data, documents),
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
      }

      return await apiClient.request<PeriodeSousRessourceEnregistrement>(
        buildItemUrl(resource, itemId),
        { method: 'PUT', data }
      )
    },

    delete: async (itemId: number): Promise<void> => {
      await apiClient.request<void>(buildItemUrl(resource, itemId), {
        method: 'DELETE',
      })
    },
  }
}
