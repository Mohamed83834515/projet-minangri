import type { FormConfig } from "../../Global/types/formConfig";

export const getActiviteProgrammeFormConfig = (): FormConfig => ({

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
            placeholder: "Intitulé de l'activité programme",
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
        // select - Parent activité programme (optionnel)
        {
            name: "parent_ap",
            label: "Activité parente",
            type: "select",
            placeholder: "Sélectionner une activité parente (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Programme (optionnel)
        {
            name: "id_programme",
            label: "Programme",
            type: "select",
            placeholder: "Sélectionner un programme (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})