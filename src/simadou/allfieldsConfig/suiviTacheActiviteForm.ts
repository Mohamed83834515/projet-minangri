import type { FormConfig } from "../../Global/types/formConfig";

export const getSuiviTacheActiviteFormConfig = (): FormConfig => ({

    fields: [
        // number - Proportion réalisée
        {
            name: "proportion_realisee",
            label: "Proportion réalisée",
            type: "number",
            placeholder: "Ex: 0, 25, 50, 75, 100",
            required: true,
            min: 0,
            max: 100,
            step: 1,
            gridCols: 1,
        },
        // checkbox - Validé
        {
            name: "valide",
            label: "Validé",
            type: "checkbox",
            defaultChecked: false,
            gridCols: 1,
        },
        // date - Date réelle
        {
            name: "date_reele",
            label: "Date réelle",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // textarea - Observation suivi
        {
            name: "observation_suivi",
            label: "Observation suivi",
            type: "textarea",
            placeholder: "Observations sur le suivi...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        // textarea - Livrable suivi
        {
            name: "livrable_suivi",
            label: "Livrable suivi",
            type: "textarea",
            placeholder: "Livrables produits...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        // select - Groupe tâche
        {
            name: "id_groupe_tache",
            label: "Groupe tâche",
            type: "select",
            placeholder: "Sélectionner une tâche",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Activité PTBA
        {
            name: "id_activite_ptba",
            label: "Activité PTBA",
            type: "select",
            placeholder: "Sélectionner une activité PTBA",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})