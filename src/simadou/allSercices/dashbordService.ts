import { apiClient } from "@/axios/api";
import { } from "../allTypes";
import { AvancementDirection } from "../allTypes/dashboardType";


export const dashboardService = {
    // Get all acteurs
    avancementParDirections: async (codeProgramme: string): Promise<AvancementDirection[]> => {
        const response = await apiClient.request<AvancementDirection[]>(
            `ptbas/taux-execution-ugls/?code_programme=${codeProgramme}`);
        return Array.isArray(response) ? response : [];
    },

};
