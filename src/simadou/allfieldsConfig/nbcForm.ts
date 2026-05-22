import type { FormConfig } from "../../Global/types/formConfig";

export const getNbcFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code number NBC
        {
            name: "code_number_nbc",
            label: "Code number NBC",
            type: "text",
            placeholder: "Ex: NBC001, NBC01...",
            required: true,
            gridCols: 1,
        },
        // number - Nombre NBC
        {
            name: "nombre_nbc",
            label: "Nombre NBC",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Libellé NBC
        {
            name: "libelle_nbc",
            label: "Libellé NBC",
            type: "text",
            placeholder: "Libellé du NBC",
            required: true,
            gridCols: 2,
        },
    ]

})