import { apiClient } from "@/axios/api";
import type { SuiviAvancementContratFormData } from "../schemas/suiviAvancementContratSchemas";
import { SuiviAvancementContrat } from "../allTypes";

const ENDPOINT = "/suivi-avancement-contrat/";
const WITH_SOURCES_ENDPOINT = "/suivi-avancement-contrat/with-sources/";

/** Champs suivi envoyés avec sources (JSON ou multipart) */
export type SuiviAvancementContratPayload = Omit<
  SuiviAvancementContratFormData,
  "documents_fichiers"
> & {
  activite_ptba: number;
  id_personnel: number;
  modifier_par: string;
};

export type SuiviAvancementWithSourcesInput = {
  suivi: SuiviAvancementContratPayload;
  fichiers: File[];
};

function appendSuiviFields(fd: FormData, suivi: SuiviAvancementContratPayload) {
  fd.append("date_suivi", suivi.date_suivi);
  fd.append("etat_avancement", suivi.etat_avancement);
  fd.append("statut_activite", suivi.statut_activite);
  fd.append("retard_accuse", suivi.retard_accuse);
  fd.append("difficultes_rencontrees", suivi.difficultes_rencontrees);
  fd.append("pistes_solutions", suivi.pistes_solutions);
  fd.append("observation", suivi.observation);
  fd.append("etat", suivi.etat);
  fd.append("activite_ptba", String(suivi.activite_ptba));
  fd.append("id_personnel", String(suivi.id_personnel));
  fd.append("modifier_par", suivi.modifier_par);
}

function toJsonBody(
  suivi: SuiviAvancementContratPayload,
): Record<string, string | number | { fichier_join: string; suivi_avancement_contrat: number }[]> {
  return {
    date_suivi: suivi.date_suivi,
    etat_avancement: suivi.etat_avancement,
    statut_activite: suivi.statut_activite,
    retard_accuse: suivi.retard_accuse,
    difficultes_rencontrees: suivi.difficultes_rencontrees,
    pistes_solutions: suivi.pistes_solutions,
    observation: suivi.observation,
    etat: suivi.etat,
    activite_ptba: suivi.activite_ptba,
    id_personnel: suivi.id_personnel,
    modifier_par: suivi.modifier_par,
    sources: [],
  };
}

function toMultipartBody(
  suivi: SuiviAvancementContratPayload,
  fichiers: File[],
): FormData {
  const fd = new FormData();
  appendSuiviFields(fd, suivi);
  for (const file of fichiers) {
    fd.append("sources", file, file.name);
  }
  return fd;
}

const suiviAvancementContratService = {
  async getByActivite(idActivite: number): Promise<SuiviAvancementContrat[]> {
    const response = await apiClient.request<SuiviAvancementContrat[]>(
      `${ENDPOINT}?activite_ptba=${idActivite}`,
    );
    return Array.isArray(response) ? response : [];
  },

  async createWithSources(
    input: SuiviAvancementWithSourcesInput,
  ): Promise<SuiviAvancementContrat> {
    const { suivi, fichiers } = input;
    if (fichiers.length > 0) {
      return apiClient.request<SuiviAvancementContrat>(WITH_SOURCES_ENDPOINT, {
        method: "POST",
        data: toMultipartBody(suivi, fichiers),
      });
    }
    return apiClient.request<SuiviAvancementContrat>(WITH_SOURCES_ENDPOINT, {
      method: "POST",
      data: toJsonBody(suivi),
    });
  },

  async updateWithSources(
    id: number,
    input: SuiviAvancementWithSourcesInput,
  ): Promise<SuiviAvancementContrat> {
    const { suivi, fichiers } = input;
    const url = `${WITH_SOURCES_ENDPOINT}${id}/`;
    if (fichiers.length > 0) {
      return apiClient.request<SuiviAvancementContrat>(url, {
        method: "PUT",
        data: toMultipartBody(suivi, fichiers),
      });
    }
    return apiClient.request<SuiviAvancementContrat>(url, {
      method: "PUT",
      data: toJsonBody(suivi),
    });
  },

  async delete(id: number): Promise<void> {
    await apiClient.request(`${ENDPOINT}${id}/`, {
      method: "DELETE",
    });
  },
};

export default suiviAvancementContratService;
