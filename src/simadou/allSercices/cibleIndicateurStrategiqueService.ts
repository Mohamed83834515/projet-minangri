import { apiClient } from "../lib/api";
import { CibleIndicateurStrategique } from "../types/cibleIndicateurStrategique";

const BASE_URL = "/cible_indicateur_strategique/";

export const cibleIndicateurStrategiqueService = {
  // Récupérer toutes les cibles d'indicateurs stratégiques
  async getAll(): Promise<CibleIndicateurStrategique[]> {
    return await apiClient.request<CibleIndicateurStrategique[]>(BASE_URL);
  },

  // Créer une nouvelle cible
  async create(data: CibleIndicateurStrategique): Promise<CibleIndicateurStrategique> {
    return await apiClient.request<CibleIndicateurStrategique>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  // Mettre à jour une cible
  async update(id: number, data: CibleIndicateurStrategique): Promise<CibleIndicateurStrategique> {
    return await apiClient.request<CibleIndicateurStrategique>(`${BASE_URL}${id}/`, {
      method: "PUT",
      data,
    });
  },

  // Supprimer une cible
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  }
};
