import type { FormConfig } from "../../Global/types/formConfig";

export const getTacheActivitePtbaFormConfig = (): FormConfig => ({

    fields: [
        // texte - Intitulé tâche
        {
            name: "intutile_tache_gt",
            label: "Intitulé tâche",
            type: "text",
            placeholder: "Intitulé de la tâche (max 200 caractères)",
            required: true,
            maxLength: 200,
            gridCols: 2,
        },
        // texte - Proportion
        {
            name: "proportion_gt",
            label: "Proportion",
            type: "text",
            placeholder: "Ex: 25%, 50%, 100%",
            required: true,
            maxLength: 10,
            gridCols: 1,
        },
        // texte - Code tâche
        {
            name: "code_tache_gt",
            label: "Code tâche",
            type: "text",
            placeholder: "Code de la tâche (max 200 caractères)",
            required: true,
            maxLength: 200,
            gridCols: 1,
        },
        // date - Date début
        {
            name: "date_debut_gt",
            label: "Date début",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // date - Date fin
        {
            name: "date_fin_gt",
            label: "Date fin",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // date - Date réelle
        {
            name: "date_reelle_gt",
            label: "Date réelle",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // number - N° lot
        {
            name: "n_lot_gt",
            label: "N° lot",
            type: "number",
            placeholder: "Numéro du lot",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Validé
        {
            name: "valider_gt",
            label: "Validé",
            type: "text",
            placeholder: "Ex: Oui, Non, En attente",
            required: true,
            maxLength: 100,
            gridCols: 1,
        },
        // texte - Observation (optionnel)
        {
            name: "observation_gt",
            label: "Observation",
            type: "textarea",
            placeholder: "Observations éventuelles (max 200 caractères)",
            rows: 2,
            required: false,
            maxLength: 200,
            gridCols: 2,
        },
        // texte - Livrable
        {
            name: "livrable_gt",
            label: "Livrable",
            type: "text",
            placeholder: "Livrables attendus (max 100 caractères)",
            required: true,
            maxLength: 100,
            gridCols: 2,
        },
        // select - Personnel
        {
            name: "id_personnel_gt",
            label: "Personnel",
            type: "select",
            placeholder: "Sélectionner un personnel",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Responsable (optionnel)
        {
            name: "responsable_gt",
            label: "Responsable",
            type: "select",
            placeholder: "Sélectionner un responsable (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Activité
        {
            name: "id_activite",
            label: "Activité",
            type: "select",
            placeholder: "Sélectionner une activité PTBA",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})