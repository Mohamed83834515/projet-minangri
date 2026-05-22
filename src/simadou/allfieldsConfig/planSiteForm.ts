import type { FormConfig } from "../../Global/types/formConfig";

export const getPlanSiteFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code plan site
        {
            name: "code_ds",
            label: "Code plan site",
            type: "text",
            placeholder: "Ex: DS001, SITE01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé plan site
        {
            name: "intutile_ds",
            label: "Intitulé plan site",
            type: "text",
            placeholder: "Intitulé du plan site",
            required: true,
            gridCols: 2,
        },
        // number - Niveau plan site
        {
            name: "niveau_ds",
            label: "Niveau plan site",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // select - Parent plan site
        {
            name: "parent_ds",
            label: "Parent plan site",
            type: "select",
            placeholder: "Sélectionner un parent",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // texte - Code relai plan site
        {
            name: "code_relai_ds",
            label: "Code relai plan site",
            type: "text",
            placeholder: "Code du relai",
            required: true,
            gridCols: 1,
        },
    ]

})