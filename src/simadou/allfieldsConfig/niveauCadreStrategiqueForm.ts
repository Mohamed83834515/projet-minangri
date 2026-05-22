import type { FormConfig } from "../../Global/types/formConfig";

export const getNiveauCadreStrategiqueFormConfig = (): FormConfig => ({

    fields: [
        // number - Nombre niveau cadre stratégique
        {
            name: "nombre_nsc",
            label: "Nombre niveau cadre stratégique",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Libellé niveau cadre stratégique
        {
            name: "libelle_nsc",
            label: "Libellé niveau cadre stratégique",
            type: "text",
            placeholder: "Ex: Effet, Produit, Impact...",
            required: true,
            gridCols: 2,
        },
        // number - Code number niveau cadre stratégique
        {
            name: "code_number_nsc",
            label: "Code number niveau cadre stratégique",
            type: "number",
            placeholder: "Ex: 01, 02, 03...",
            required: true,
            min: 0,
            gridCols: 1,
        },
        // select - Type niveau (1: Effet, 2: Produit, 3: Impact)
        {
            name: "type_niveau",
            label: "Type niveau",
            type: "select",
            placeholder: "Sélectionner un type",
            required: true,
            options: [
                { value: 1, label: "Effet" },
                { value: 2, label: "Produit" },
                { value: 3, label: "Impact" }
            ],
            gridCols: 1,
        },
        // select - Programme (optionnel)
        {
            name: "programme",
            label: "Programme",
            type: "select",
            placeholder: "Sélectionner un programme (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})