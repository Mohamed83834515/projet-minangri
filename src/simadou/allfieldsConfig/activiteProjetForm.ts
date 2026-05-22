import type { FormConfig } from "../../Global/types/formConfig";

export const getActiviteProjetFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code activité projet
        {
            name: "code_activite_projet",
            label: "Code activité projet",
            type: "text",
            placeholder: "Ex: ACT001, ACT01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé activité projet
        {
            name: "intitule_activite_projet",
            label: "Intitulé activité projet",
            type: "text",
            placeholder: "Intitulé de l'activité du projet",
            required: true,
            gridCols: 2,
        },
        // number - Niveau activité projet
        {
            name: "niveau_activite_projet",
            label: "Niveau activité projet",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // select - Parent activité projet (optionnel)
        {
            name: "parent_activite_projet",
            label: "Activité parente",
            type: "select",
            placeholder: "Sélectionner une activité parente (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Code activité programme (optionnel)
        {
            name: "code_activite_programme",
            label: "Code activité programme",
            type: "select",
            placeholder: "Sélectionner une activité programme (optionnel)",
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