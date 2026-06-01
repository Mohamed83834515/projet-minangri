import type { FormConfig } from "../../Global/types/formConfig";

export const getIndicateurTacheFormConfig = (): FormConfig => ({

    fields: [
        // texte - Intitulé indicateur tâche
        {
            name: "intitule_indicateur_tache",
            label: "Intitulé indicateur tâche",
            type: "text",
            placeholder: "Intitulé de l'indicateur",
            required: true,
            gridCols: 1,
        },
        // texte - Unité indicateur tâche
        {
            name: "unite_ind_tache",
            label: "Unité indicateur tâche",
            type: "text",
            placeholder: "Ex: Kg, %, Nbre, FCFA...",
            required: true,
            gridCols: 2,
        },
        // texte - Code indicateur PTBA
        {
            name: "code_indicateur_ptba",
            label: "Code indicateur PTBA",
            type: "text",
            placeholder: "Ex: IND001, PTBA01...",
            required: true,
            gridCols: 2,
        },
        // select - Indicateur CMR
        {
            name: "indicateur_cmr",
            label: "Indicateur CMR",
            type: "select",
            placeholder: "Sélectionner un indicateur CMR",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
        // Trimestre 1
        {
            name: "trimestre1",
            label: "Trimestre 1",
            type: "text",
            placeholder: "Ex: 100, 75%, 2000...",
            required: true,
            gridCols: 2,
        },
        // Trimestre 2
        {
            name: "trimestre2",
            label: "Trimestre 2",
            type: "text",
            placeholder: "Ex: 100, 75%, 2000...",
            required: true,
            gridCols: 2,
        },
        // Trimestre 3
        {
            name: "trimestre3",
            label: "Trimestre 3",
            type: "text",
            placeholder: "Ex: 100, 75%, 2000...",
            required: true,
            gridCols: 2,
        },
        // Trimestre 4
        {
            name: "trimestre4",
            label: "Trimestre 4",
            type: "text",
            placeholder: "Ex: 100, 75%, 2000...",
            required: true,
            gridCols: 2,
        },
    ]

})