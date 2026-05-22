import { apiClient } from "../lib/api";
import { TypeActiviteFormData } from "../schemas/ptbaSchemas";
import type { TypeActivite } from "../types";

const ENDPOINT = "/type_activite/";

const typeActiviteService = {
  async getAll(): Promise<TypeActivite[]> {
    return apiClient.request(ENDPOINT, { method: "GET" });
  },

  async getById(id: number): Promise<TypeActivite> {
    return apiClient.request(`${ENDPOINT}${id}/`, { method: "GET" });
  },

  async create(data: TypeActiviteFormData): Promise<TypeActivite> {
    return apiClient.request(ENDPOINT, {
      method: "POST",
      data,
    });
  },

  async update(
    id: number,
    data: Partial<TypeActiviteFormData>,
  ): Promise<TypeActivite> {
    return apiClient.request(`${ENDPOINT}${id}/`, {
      method: "PUT",
      data,
    });
  },

  async delete(id: number): Promise<void> {
    await apiClient.request(`${ENDPOINT}${id}/`, {
      method: "DELETE",
    });
  },
};

export default typeActiviteService;
