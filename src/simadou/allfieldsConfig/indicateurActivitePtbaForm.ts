import type { FormConfig } from "../../Global/types/formConfig";

export const getIndicateurActivitePtbaFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code indicateur activité
        {
            name: "code_indicateur_activite",
            label: "Code indicateur activité",
            type: "text",
            placeholder: "Ex: IND001, ACT01...",
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
        // select - Activité PTBA (optionnel)
        {
            name: "activite_ptba",
            label: "Activité PTBA",
            type: "select",
            placeholder: "Sélectionner une activité PTBA (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Code indicateur performance (optionnel)
        {
            name: "code_indicateur_performance",
            label: "Code indicateur performance",
            type: "select",
            placeholder: "Sélectionner un indicateur performance (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Abrégé unité (optionnel)
        {
            name: "abrege_unite",
            label: "Unité indicateur",
            type: "select",
            placeholder: "Sélectionner une unité (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})