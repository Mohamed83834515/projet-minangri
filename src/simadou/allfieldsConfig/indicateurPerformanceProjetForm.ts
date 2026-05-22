import type { FormConfig } from "../../Global/types/formConfig";

export const getIndicateurPerformanceProjetFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code indicateur performance
        {
            name: "code_indicateur_performance",
            label: "Code indicateur performance",
            type: "text",
            placeholder: "Ex: IND001, PERF01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé indicateur tâche
        {
            name: "intitule_indicateur_tache",
            label: "Intitulé indicateur tâche",
            type: "text",
            placeholder: "Intitulé de l'indicateur",
            required: true,
            gridCols: 2,
        },
        // select - Code activité projet (optionnel)
        {
            name: "code_activite_projet",
            label: "Code activité projet",
            type: "select",
            placeholder: "Sélectionner une activité projet (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Unité indicateur performance (optionnel)
        {
            name: "unite_indicateur_performance",
            label: "Unité indicateur",
            type: "select",
            placeholder: "Sélectionner une unité (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Code projet (optionnel)
        {
            name: "code_projet",
            label: "Code projet",
            type: "select",
            placeholder: "Sélectionner un projet (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})