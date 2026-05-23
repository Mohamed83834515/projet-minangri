import { apiClient } from "@/axios/api";
import { ZoneCollecte } from "../allTypes/zoneCollecte";

const BASE_URL = "/zone_collecte/";

export const zoneCollecteService = {
  // Récupérer toutes les zones de collecte
  async getAll(): Promise<ZoneCollecte[]> {
    return await apiClient.request<ZoneCollecte[]>(BASE_URL);
  },

  // Récupérer une zone par ID
  async getById(id: number): Promise<ZoneCollecte> {
    return await apiClient.request<ZoneCollecte>(`${BASE_URL}${id}/`);
  },

  // Créer une nouvelle zone
  async create(data: ZoneCollecte): Promise<ZoneCollecte> {
    return await apiClient.request<ZoneCollecte>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  // Mettre à jour une zone
  async update(data: ZoneCollecte): Promise<ZoneCollecte> {
    const { id_zone_collecte, ...form } = data;
    return await apiClient.request<ZoneCollecte>(`${BASE_URL}${id_zone_collecte}/`, {
      method: "PUT",
      data: form,
    });
  },

  // Supprimer une zone
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  }
};
