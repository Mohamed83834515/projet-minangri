import { apiClient } from "../lib/api";
import { CadreAnalytiqueConfig } from "../types/cadreAnalytiqueConfig";

const BASE_URL = "/cadre_analytique_config/";

export const cadreAnalytiqueConfigService = {
  // Récupérer toutes les configurations (filtrées par programme si nécessaire)
  async getAll(programmeCode?: string | number): Promise<CadreAnalytiqueConfig[]> {
    const response = await apiClient.request<CadreAnalytiqueConfig[]>(BASE_URL);
    if (programmeCode) {
      return response.filter((cadre) => cadre.programme === programmeCode);
    }
    return response;
  },

  // Récupérer les configurations par programme via un endpoint spécifique
  async getByProgramme(programmeId: number): Promise<CadreAnalytiqueConfig[]> {
    return await apiClient.request<CadreAnalytiqueConfig[]>(`/programme/${programmeId}/get_cadres_config/`);
  },

  // Créer une nouvelle configuration
  async create(data: CadreAnalytiqueConfig): Promise<CadreAnalytiqueConfig> {
    const { ...form } = data;
    return await apiClient.request<CadreAnalytiqueConfig>(BASE_URL, {
      method: "POST",
      data: form,
    });
  },

  // Mettre à jour une configuration
  async update(data: CadreAnalytiqueConfig): Promise<CadreAnalytiqueConfig> {
    const { id_csa, ...form } = data;
    return await apiClient.request<CadreAnalytiqueConfig>(`${BASE_URL}${id_csa}/`, {
      method: "PUT",
      data: form,
    });
  },

  // Supprimer une configuration
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  }
};
