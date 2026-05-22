import { apiClient } from "../lib/api";
import { PtbaFormData } from "../schemas/ptbaSchemas";
import type { Ptba } from "../types";

const ENDPOINT = "/ptba/";

const ptbaService = {
  async getAll(codeProgramme?: string): Promise<Ptba[]> {
    return apiClient.request(ENDPOINT, {
      method: "GET",
      params: codeProgramme ? { code_programme: codeProgramme } : {},
    });
  },

  async getById(id: number): Promise<Ptba> {
    return apiClient.request(`${ENDPOINT}${id}/`, { method: "GET" });
  },

  async create(data: PtbaFormData): Promise<Ptba> {
    return apiClient.request(ENDPOINT, {
      method: "POST",
      data,
    });
  },

  async update(id: number, data: Partial<PtbaFormData>): Promise<Ptba> {
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

export default ptbaService;
