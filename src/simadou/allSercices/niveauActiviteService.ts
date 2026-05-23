import { apiClient } from "@/axios/api";
import { NiveauActiviteProjet } from "../allTypes";

const BASE_URL = "/niveau_activite_config/";

export const niveauActiviteService = {
  // Récupérer tous les niveaux d'activités (filtrés par projet)
  async getAll(code_projet: string): Promise<NiveauActiviteProjet[]> {
    const response = await apiClient.request<NiveauActiviteProjet[]>(BASE_URL);
    return response.filter((niveau) => niveau.code_projet === code_projet);
  },

  // Créer plusieurs niveaux d'activités
  async createMany(data: NiveauActiviteProjet[]): Promise<any[]> {
    const promises = data.map((item) => {
      const { ...form } = item;
      return apiClient.request(BASE_URL, {
        method: "POST",
        data: form,
      });
    });
    return await Promise.all(promises);
  },

  // Mettre à jour un niveau d'activité
  async update(
    id: number,
    data: Partial<NiveauActiviteProjet>,
  ): Promise<NiveauActiviteProjet> {
    return await apiClient.request<NiveauActiviteProjet>(`${BASE_URL}${id}/`, {
      method: "PUT",
      data,
    });
  },

  // Supprimer un niveau d'activité (Note: l'URL dans delete.ts était activite_projet/)
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`/activite_projet/${id}/`, {
      method: "DELETE",
    });
  },
};
