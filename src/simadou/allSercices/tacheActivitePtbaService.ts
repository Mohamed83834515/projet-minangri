import { apiClient } from "@/axios/api";
import type {
  TacheActiviteByPlanSiteGroup,
} from "../allTypes/dashboardType";
import type { TacheActivitePtba } from "../allTypes/tacheActivitePtba";
import {
  filterTachesByActivite,
  type TacheActivitePtbaApiPayload,
} from "../lib/tacheActivitePtbaUtils";

const BASE_URL = "/tache_activite_ptba/";

class TacheActivitePtbaService {
  async getByPlanSite(params: {
    versionPtba: number
    codeProgramme?: string
  }): Promise<TacheActiviteByPlanSiteGroup[]> {
    const searchParams = new URLSearchParams()
    searchParams.set('version_ptba', String(params.versionPtba))
    if (params.codeProgramme?.trim()) {
      searchParams.set('code_programme', params.codeProgramme.trim())
    }

    return apiClient.request<TacheActiviteByPlanSiteGroup[]>(
      `${BASE_URL}by-plan-site/?${searchParams.toString()}`
    )
  }

  async getAll(url:string): Promise<TacheActivitePtba[]> {
    const response = await apiClient.request<TacheActivitePtba[]>(
      url,
    );
    return response;
  }

  async getByActivite(url:string,idActivite: number): Promise<TacheActivitePtba[]> {
    const response = await apiClient.request<TacheActivitePtba[]>(url);
    return filterTachesByActivite(response, idActivite);
  }

  async getById(url:string, id: number): Promise<TacheActivitePtba> {
    const response = await apiClient.request<TacheActivitePtba>(
      `${url}${id}/`,
    );
    return response;
  }

  async create(url:string, data: TacheActivitePtbaApiPayload): Promise<TacheActivitePtba> {
    const response = await apiClient.request<TacheActivitePtba>(
      url,
      {
        method: "POST",
        data: { ...data, proportion_gt: data.proportion_gt?.toString() },
      },
    );
    return response;
  }

  async update(
    url:string,
    id: number,
    data: Partial<TacheActivitePtbaApiPayload>,
  ): Promise<TacheActivitePtba> {
    const response = await apiClient.request<TacheActivitePtba>(
      `${url}${id}/`,
      {
        method: "PUT",
        data: { ...data, proportion_gt: data.proportion_gt?.toString() },
      },
    );
    return response;
  }

  async delete(url:string, id: number): Promise<void> {
    await apiClient.request(`${url}${id}/`, {
      method: "DELETE",
    });
  }
}

export default new TacheActivitePtbaService();
