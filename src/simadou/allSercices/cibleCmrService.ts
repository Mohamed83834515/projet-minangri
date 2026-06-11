import { apiClient } from "@/axios/api";
import type { CibleCmrProjet } from "../allTypes";
import { normalizeApiList } from "./apiListUtils";

export interface CibleCmrFormData {
  annee: string;
  valeur_cible_indcateur_cmr: number;
  code_indicateur_cmr?: number | null;
  localite?: string | null;
}

const BASE_URL = "/cible_cmr/"

export const cibleCmrService = {
  async getAll(): Promise<CibleCmrProjet[]> {
    const response = await apiClient.request<unknown>(BASE_URL);
    const list = normalizeApiList<CibleCmrProjet>(response);
    return list.sort(
      (a, b) => new Date(a.annee).getTime() - new Date(b.annee).getTime(),
    );
  },

  async getById(id_cible_indicateur_crp: number): Promise<CibleCmrProjet> {
    return await apiClient.request<CibleCmrProjet>(
      `${BASE_URL}${id_cible_indicateur_crp}/`,
    );
  },

  async create(data: CibleCmrFormData): Promise<CibleCmrProjet> {
    return await apiClient.request<CibleCmrProjet>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  async update(
    id_cible_indicateur_crp: number,
    data: CibleCmrFormData,
  ): Promise<CibleCmrProjet> {
    return await apiClient.request<CibleCmrProjet>(
      `${BASE_URL}${id_cible_indicateur_crp}/`,
      {
        method: "PUT",
        data,
      },
    );
  },

  async delete(id_cible_indicateur_crp: number): Promise<void> {
    await apiClient.request<void>(
      `${BASE_URL}${id_cible_indicateur_crp}/`,
      {
        method: "DELETE",
      },
    );
  },

  async search(query: string): Promise<CibleCmrProjet[]> {
    const response = await apiClient.request<unknown>(
      `${BASE_URL}search/?q=${encodeURIComponent(query)}`,
    );
    return normalizeApiList<CibleCmrProjet>(response);
  },

  async getByIndicateur(
    code_indicateur_crp: number,
  ): Promise<CibleCmrProjet[]> {
    const response = await apiClient.request<unknown>(
      `${BASE_URL}?code_indicateur_crp=${code_indicateur_crp}`,
    );
    return normalizeApiList<CibleCmrProjet>(response);
  },

  async getByProjet(code_projet: string): Promise<CibleCmrProjet[]> {
    const response = await apiClient.request<unknown>(
      `${BASE_URL}?code_projet=${encodeURIComponent(code_projet)}`,
    );
    return normalizeApiList<CibleCmrProjet>(response);
  },

  async getByAnnee(annee: string): Promise<CibleCmrProjet[]> {
    const response = await apiClient.request<unknown>(
      `${BASE_URL}?annee=${encodeURIComponent(annee)}`,
    );
    return normalizeApiList<CibleCmrProjet>(response);
  },
};
