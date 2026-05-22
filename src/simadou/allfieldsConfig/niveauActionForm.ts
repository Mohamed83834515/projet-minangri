import type { FormConfig } from "../../Global/types/formConfig";

export const getNiveauActionFormConfig = (): FormConfig => ({

    fields: [
        // texte - Libellé niveau action
        {
            name: "libelle_niveau_ap",
            label: "Libellé niveau action",
            type: "text",
            placeholder: "Ex: Stratégique, Tactique, Opérationnel...",
            required: true,
            gridCols: 2,
        },
        // number - Taille code niveau action
        {
            name: "taille_code_niveau_ap",
            label: "Taille code niveau action",
            type: "number",
            placeholder: "Ex: 2, 3, 4...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // select - Code programme
        {
            name: "code_programme",
            label: "Code programme",
            type: "select",
            placeholder: "Sélectionner un programme",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})