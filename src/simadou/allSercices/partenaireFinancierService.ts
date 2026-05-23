import { apiClient } from "@/axios/api";
import { PartenaireFinancier } from "../allTypes/partenaireFinancier";

const BASE_URL = "/partenaire_financier/";

export const partenaireFinancierService = {
  // Récupérer tous les partenaires financiers
  async getAll(): Promise<PartenaireFinancier[]> {
    return await apiClient.request<PartenaireFinancier[]>(BASE_URL);
  },

  // Récupérer un partenaire par ID
  async getById(id: number): Promise<PartenaireFinancier> {
    return await apiClient.request<PartenaireFinancier>(`${BASE_URL}${id}/`);
  },

  // Créer un nouveau partenaire
  async create(data: PartenaireFinancier): Promise<PartenaireFinancier> {
    return await apiClient.request<PartenaireFinancier>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  // Mettre à jour un partenaire
  async update(data: PartenaireFinancier): Promise<PartenaireFinancier> {
    return await apiClient.request<PartenaireFinancier>(`${BASE_URL}${data.id_partenaire}/`, {
      method: "PUT",
      data,
    });
  },

  // Supprimer un partenaire
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  }
};
