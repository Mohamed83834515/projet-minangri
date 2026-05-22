import type { FormConfig } from "../../Global/types/formConfig";

export const getNiveauCadreResultatFormConfig = (): FormConfig => ({

    fields: [
        // number - Nombre niveau cadre résultat
        {
            name: "nombre_ncr",
            label: "Nombre niveau cadre résultat",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Libellé niveau cadre résultat
        {
            name: "libelle_ncr",
            label: "Libellé niveau cadre résultat",
            type: "text",
            placeholder: "Ex: Effet, Produit, Impact...",
            required: true,
            gridCols: 2,
        },
        // number - Code number niveau cadre résultat
        {
            name: "code_number_ncr",
            label: "Code number niveau cadre résultat",
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
    ]

})