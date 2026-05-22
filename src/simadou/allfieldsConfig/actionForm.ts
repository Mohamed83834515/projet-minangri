import type { FormConfig } from "../../Global/types/formConfig";

export const getActionFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code action
        {
            name: "code_ap",
            label: "Code action",
            type: "text",
            placeholder: "Ex: ACT001, ACT01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé
        {
            name: "intutile",
            label: "Intitulé",
            type: "text",
            placeholder: "Intitulé de l'action",
            required: true,
            gridCols: 2,
        },
        // number - Niveau action
        {
            name: "niveau_ap",
            label: "Niveau action",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Code relai action
        {
            name: "code_relai_ap",
            label: "Code relai action",
            type: "text",
            placeholder: "Code du relai",
            required: true,
            gridCols: 1,
        },
        // select - Parent action (peut être null)
        {
            name: "parent_ap",
            label: "Action parente",
            type: "select",
            placeholder: "Sélectionner une action parente (optionnel)",
            required: false,
            options: [], 
            gridCols: 1,
        },
        // select - Programme
        {
            name: "id_programme",
            label: "Programme",
            type: "select",
            placeholder: "Sélectionner un programme",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})