import { apiClient } from "../lib/api";
import type { SuiviTacheActiviteFormData } from "../schemas/suiviTacheActiviteSchemas";
import type { SuiviTacheActivite } from "../types";

const ENDPOINT = "/suivi_tache_activite/";

type SuiviFieldsJson = Omit<SuiviTacheActiviteFormData, "livrable_fichier"> & {
  id_activite_ptba: number;
};

function appendSuiviFormFields(
  fd: FormData,
  data: SuiviFieldsJson,
  opts: { livrableAsFiles: File[] } | { livrableAsText: string },
) {
  fd.append("id_activite_ptba", String(data.id_activite_ptba));
  fd.append("id_groupe_tache", String(data.id_groupe_tache));
  fd.append("date_reele", data.date_reele);
  fd.append("observation_suivi", data.observation_suivi);
  fd.append("proportion_realisee", String(data.proportion_realisee));
  fd.append("valide", data.valide ? "true" : "false");
  if ("livrableAsFiles" in opts) {
    for (const file of opts.livrableAsFiles) {
      fd.append("livrable_suivi", file, file.name);
    }
  } else {
    fd.append("livrable_suivi", opts.livrableAsText);
  }
}

const suiviTacheActiviteService = {
  async getByActivite(idActivite: number): Promise<SuiviTacheActivite[]> {
    const response = await apiClient.request<SuiviTacheActivite[]>(
      `${ENDPOINT}?id_activite=${idActivite}`,
    );
    return Array.isArray(response) ? response : [];
  },

  async create(
    data: SuiviTacheActiviteFormData & { id_activite_ptba: number },
  ): Promise<SuiviTacheActivite> {
    const { livrable_fichier, ...rest } = data;
    const json: SuiviFieldsJson = {
      ...rest,
      id_activite_ptba: data.id_activite_ptba,
    };

    if (livrable_fichier.length > 0) {
      const fd = new FormData();
      appendSuiviFormFields(fd, json, { livrableAsFiles: livrable_fichier });
      return apiClient.request(ENDPOINT, { method: "POST", data: fd });
    }

    return apiClient.request(ENDPOINT, {
      method: "POST",
      data: json,
    });
  },

  async update(
    id: number,
    data: SuiviTacheActiviteFormData & { id_activite_ptba?: number },
  ): Promise<SuiviTacheActivite> {
    const { livrable_fichier, ...rest } = data;
    const id_ptba = data.id_activite_ptba;
    if (id_ptba == null) {
      throw new Error("id_activite_ptba requis pour la mise à jour");
    }
    const json: SuiviFieldsJson = { ...rest, id_activite_ptba: id_ptba };

    if (livrable_fichier.length > 0) {
      const fd = new FormData();
      appendSuiviFormFields(fd, json, { livrableAsFiles: livrable_fichier });
      return apiClient.request(`${ENDPOINT}${id}/`, {
        method: "PUT",
        data: fd,
      });
    }

    return apiClient.request(`${ENDPOINT}${id}/`, {
      method: "PUT",
      data: json,
    });
  },

  async delete(id: number): Promise<void> {
    await apiClient.request(`${ENDPOINT}${id}/`, {
      method: "DELETE",
    });
  },
};

export default suiviTacheActiviteService;
