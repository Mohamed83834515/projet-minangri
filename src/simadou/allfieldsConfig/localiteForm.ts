import type { FormConfig } from "../../Global/types/formConfig";

export const getLocaliteFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code localité
        {
            name: "code_loca",
            label: "Code localité",
            type: "text",
            placeholder: "Ex: LOC001, REG01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé localité
        {
            name: "intitule_loca",
            label: "Intitulé localité",
            type: "text",
            placeholder: "Ex: Dakar, Thiès, Saint-Louis...",
            required: true,
            gridCols: 2,
        },
        // texte - Code national localité
        {
            name: "code_national_loca",
            label: "Code national localité",
            type: "text",
            placeholder: "Ex: SN001, SN002...",
            required: true,
            gridCols: 1,
        },
        // select - Parent localité (optionnel)
        {
            name: "parent_loca",
            label: "Localité parente",
            type: "select",
            placeholder: "Sélectionner une localité parente (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Niveau localité
        {
            name: "niveau_loca",
            label: "Niveau localité",
            type: "select",
            placeholder: "Sélectionner un niveau",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})