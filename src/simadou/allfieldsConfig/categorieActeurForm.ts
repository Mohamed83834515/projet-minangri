import type { FormConfig } from "../../Global/types/formConfig";

export const getCategorieActeurFormConfig = (): FormConfig => ({

    fields: [
        // texte - Nom de la catégorie
        {
            name: "nom_categorie",
            label: "Nom de la catégorie",
            type: "text",
            placeholder: "Ex: Artiste, Technicien, Producteur...",
            required: true,
            gridCols: 1,
        },
        // texte - Code catégorie
        {
            name: "code_cat",
            label: "Code catégorie",
            type: "text",
            placeholder: "Ex: ART, TECH, PROD...",
            required: true,
            helperText: "Code unique pour identifier la catégorie",
            gridCols: 1,
        },
    ]

})