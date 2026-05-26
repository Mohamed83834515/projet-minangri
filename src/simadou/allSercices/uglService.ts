import { toast } from "sonner";
import { apiClient } from "@/axios/api";
import type { UGL } from "../allTypes";

const endpoint = "/ugl/";

export const uglService = {
  // Get all UGLs
  getAll: async (): Promise<UGL[]> => {
    try {
      const response = await apiClient.request<UGL[]>(endpoint);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des UGL:", error);
      toast.error("Erreur lors du chargement des unités de gestion");
      throw error;
    }
  },

  // Get UGL by ID
  getById: async (id: number): Promise<UGL> => {
    try {
      return await apiClient.request<UGL>(`${endpoint}${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'UGL ${id}:`, error);
      toast.error("Erreur lors du chargement de l'unité de gestion");
      throw error;
    }
  },

  // Create UGL
  create: async (data: Partial<UGL>): Promise<UGL> => {
    try {
      const response = await apiClient.request<UGL>(endpoint, {
        method: "POST",
        data,
      });
      toast.success("Unité de gestion créée avec succès");
      return response;
    } catch (error) {
      console.error("Erreur lors de la création de l'UGL:", error);
      toast.error("Erreur lors de la création de l'unité de gestion");
      throw error;
    }
  },

  // Update UGL
  update: async (id: number, data: Partial<UGL>): Promise<UGL> => {
    try {
      const response = await apiClient.request<UGL>(`${endpoint}${id}/`, {
        method: "PUT",
        data,
      });
      toast.success("Unité de gestion mise à jour avec succès");
      return response;
    } catch (error) {
      console.error(`Erreur lors de la modification de l'UGL ${id}:`, error);
      toast.error("Erreur lors de la modification de l'unité de gestion");
      throw error;
    }
  },

  // Delete UGL
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.request(`${endpoint}${id}/`, {
        method: "DELETE",
      });
      toast.success("Unité de gestion supprimée avec succès");
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'UGL ${id}:`, error);
      toast.error("Erreur lors de la suppression de l'unité de gestion");
      throw error;
    }
  },
};
