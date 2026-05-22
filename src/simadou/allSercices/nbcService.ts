import { apiClient } from "../lib/api";
import { Nbc } from "../types/nbc";

const BASE_URL = "/ugl/"; // Note: Les fonctions d'origine utilisaient cet endpoint

export const nbcService = {
  // Récupérer tous les NBC (Note: l'API d'origine utilisait ugl/)
  async getAll(): Promise<Nbc[]> {
    return await apiClient.request<Nbc[]>(BASE_URL);
  },

  // Créer un nouveau NBC
  async create(data: Nbc): Promise<Nbc> {
    return await apiClient.request<Nbc>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  // Mettre à jour un NBC
  async update(id: number, data: Nbc): Promise<Nbc> {
    return await apiClient.request<Nbc>(`${BASE_URL}${id}/`, {
      method: "PUT",
      data,
    });
  },

  // Supprimer un NBC
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  }
};
