import { apiClient } from "../lib/api";
import { SuiviDecaissementPtba } from "../types/decaissementPtba";

const BASE_URL = "/suivi_decaissement_ptba/";

export const decaissementPtbaService = {
  // Récupérer tous les décaissements PTBA
  async getAll(): Promise<SuiviDecaissementPtba[]> {
    return await apiClient.request<SuiviDecaissementPtba[]>(BASE_URL);
  },

  // Récupérer un décaissement par ID
  async getById(id: number): Promise<SuiviDecaissementPtba> {
    return await apiClient.request<SuiviDecaissementPtba>(`${BASE_URL}${id}/`);
  },

  // Créer un nouveau décaissement
  async create(
    data: Partial<SuiviDecaissementPtba>,
  ): Promise<SuiviDecaissementPtba> {
    return await apiClient.request<SuiviDecaissementPtba>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  // Mettre à jour un décaissement
  async update(
    id: number,
    data: Partial<SuiviDecaissementPtba>,
  ): Promise<SuiviDecaissementPtba> {
    return await apiClient.request<SuiviDecaissementPtba>(`${BASE_URL}${id}/`, {
      method: "PUT",
      data,
    });
  },

  // Supprimer un décaissement
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  },
};
