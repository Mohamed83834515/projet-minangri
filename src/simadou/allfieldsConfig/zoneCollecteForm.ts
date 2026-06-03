import type { FormConfig } from "../../Global/types/formConfig";

export const getZoneCollecteFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code zone
        {
            name: "code_zone",
            label: "Code zone",
            type: "text",
            placeholder: "Ex: ZC001, ZONE01...",
            required: true,
            gridCols: 1,
        },
        // texte - Nom zone
        {
            name: "nom_zone",
            label: "Nom zone",
            type: "text",
            placeholder: "Nom de la zone de collecte",
            required: true,
            gridCols: 1,
        },
        // texte - Type zone
        {
            name: "type_zone",
            label: "Type zone",
            type: "select",
            placeholder: "Ex: Urbain, Rural, Périurbain...",
            options: [], // Les options seront chargées dynamiquement
            required: true,
            gridCols: 1,
        },
    ]

})