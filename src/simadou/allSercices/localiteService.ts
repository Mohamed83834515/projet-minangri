import { apiClient } from "@/axios/api";
import { Localite } from "../allTypes/localite";

const LOCALITE_URL = "/localite/";
export const localiteService = {
  async getAll(): Promise<Localite[]> {
    return await apiClient.request<Localite[]>(LOCALITE_URL)
  },

  async getById(id: number): Promise<Localite> {
    return await apiClient.request<Localite>(`${LOCALITE_URL}${id}/`)
  },

  async getByParent(parentId: number | null): Promise<Localite[]> {
    if (parentId === null) {
      const all = await this.getAll()
      return all.filter((loc) => loc.parent_loca === null)
    }
    return await apiClient.request<Localite[]>(`/localiteByParent/${parentId}/`)
  },

  // ✅ Correction: Filtrer les localités par niveau côté frontend
  async getByNiveau(niveauId: number): Promise<{ localites: Localite[] }> {
    const allLocalites = await this.getAll()
    // Filtrer les localités dont l'objet niveau_loca a l'id correspondant
    const filtered = allLocalites.filter((loc) => {
      // Si niveau_loca est un objet, comparer son id
      if (loc.niveau_loca && typeof loc.niveau_loca === 'object') {
        return (loc.niveau_loca as any).id_nlc === niveauId
      }
      // Si c'est un nombre (ancienne structure), comparer directement
      return loc.niveau_loca === niveauId
    })
    return { localites: filtered }
  },


  // Récupérer les localités de premier niveau (parent === null)
  async getOneLevel(): Promise<Localite[]> {
    const response = await this.getAll()
    return response.filter((loc) => loc.parent_loca === null)
  },

  async create(data: Localite): Promise<Localite> {
    return await apiClient.request<Localite>(LOCALITE_URL, {
      method: "POST",
      data,
    })
  },

  async update(data: Localite): Promise<Localite> {
    return await apiClient.request<Localite>(`${LOCALITE_URL}${data.id_loca}/`, {
      method: "PUT",
      data,
    })
  },

  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${LOCALITE_URL}${id}/`, {
      method: "DELETE",
    })
  },
}