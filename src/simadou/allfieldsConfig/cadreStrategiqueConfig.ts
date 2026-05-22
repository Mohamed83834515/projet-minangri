import type { FormConfig } from "../../Global/types/formConfig";

export const getCadreStrategiqueConfigFormConfig = (): FormConfig => ({

    fields: [
        // number - Nombre
        {
            name: "nombre",
            label: "Nombre",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Libellé
        {
            name: "libelle_nsc",
            label: "Libellé",
            type: "text",
            placeholder: "Ex: Effet, Produit, Impact...",
            required: true,
            gridCols: 2,
        },
        // select - Type (1: Effet, 2: Produit, 3: Impact)
        {
            name: "type_nsc",
            label: "Type",
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
        // select - État (optionnel)
        {
            name: "etat",
            label: "État",
            type: "select",
            placeholder: "Sélectionner un état (optionnel)",
            required: false,
            options: [
                { value: 1, label: "Actif" },
                { value: 0, label: "Inactif" }
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