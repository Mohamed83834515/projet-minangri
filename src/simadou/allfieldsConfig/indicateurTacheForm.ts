import type { FormConfig } from "../../Global/types/formConfig";

export const getIndicateurTacheFormConfig = (): FormConfig => ({

    fields: [
        // select - Tâche
        {
            name: "tache",
            label: "Tâche",
            type: "select",
            placeholder: "Sélectionner une tâche",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
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
        // texte - Responsable indicateur tâche
        {
            name: "Responsable_ind_tache",
            label: "Responsable indicateur tâche",
            type: "text",
            placeholder: "Nom du responsable",
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
            gridCols: 1,
        },
        // texte - Code indicateur PTBA
        {
            name: "code_indicateur_ptba",
            label: "Code indicateur PTBA",
            type: "text",
            placeholder: "Ex: IND001, PTBA01...",
            required: true,
            gridCols: 1,
        },
        // select - Indicateur CMR
        {
            name: "indicateur_cmr",
            label: "Indicateur CMR",
            type: "select",
            placeholder: "Sélectionner un indicateur CMR",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Activité PTBA
        {
            name: "id_activite",
            label: "Activité PTBA",
            type: "select",
            placeholder: "Sélectionner une activité PTBA",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})