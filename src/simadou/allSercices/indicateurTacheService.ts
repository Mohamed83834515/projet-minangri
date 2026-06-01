import { apiClient } from "@/axios/api";
import type {
  IndicateurTache,
  IndicateurTacheRequest,
} from "../allTypes/indicateurTache";

const BASE_URL = "/indicateurs-taches/";
class IndicateurTacheService {
  async getAll(): Promise<IndicateurTache[]> {
    const response = await apiClient.request<IndicateurTache[]>(
      BASE_URL
    );
    return response;
  }

  async getByActivite(idActivite: number): Promise<IndicateurTache[]> {
    const response = await apiClient.request<IndicateurTache[]>(
      `${BASE_URL}?id_activite=${idActivite}`
    );
    return response;
  }

  async getByTache(idTache: number): Promise<IndicateurTache[]> {
    const response = await apiClient.request<IndicateurTache[]>(
      `${BASE_URL}?tache=${idTache}`
    );
    return response;
  }

  async getById(id: number): Promise<IndicateurTache> {
    const response = await apiClient.request<IndicateurTache>(
      `${BASE_URL}${id}/`
    );
    return response;
  }

  async create(data: IndicateurTacheRequest): Promise<IndicateurTache> {
    const response = await apiClient.request<IndicateurTache>(
      BASE_URL,
      {
        method: "POST",
        data,
      }
    );
    return response;
  }

  async update(
    id: number,
    data: Partial<IndicateurTacheRequest>
  ): Promise<IndicateurTache> {
    const response = await apiClient.request<IndicateurTache>(
      `${BASE_URL}${id}/`,
      {
        method: "PUT",
        data,
      }
    );
    return response;
  }

  async delete(id: number): Promise<void> {
    await apiClient.request(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  }
}

export default new IndicateurTacheService();
