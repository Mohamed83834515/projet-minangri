import { apiClient } from "../lib/api";
import { Localite } from "../types/localite";

const BASE_URL = "/localite/";

export const localiteService = {
  // Récupérer toutes les localités
  async getAll(): Promise<Localite[]> {
    return await apiClient.request<Localite[]>(BASE_URL);
  },

  // Récupérer une localité par ID
  async getById(id: number): Promise<Localite> {
    return await apiClient.request<Localite>(`${BASE_URL}${id}/`);
  },

  // Récupérer les localités par parent
  async getByParent(id: number | null): Promise<Localite[]> {
    return await apiClient.request<Localite[]>(`/localiteByParent/${id}/`);
  },

  // Récupérer les localités de premier niveau (parent === null)
  async getOneLevel(): Promise<Localite[]> {
    const response = await this.getAll();
    return response.filter((loc) => loc.parent_loca === null);
  },

  // Créer une nouvelle localité
  async create(data: Localite): Promise<Localite> {
    return await apiClient.request<Localite>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  // Mettre à jour une localité
  async update(data: Localite): Promise<Localite> {
    return await apiClient.request<Localite>(`${BASE_URL}${data.id_loca}/`, {
      method: "PUT",
      data,
    });
  },

  // Supprimer une localité
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  }
};
