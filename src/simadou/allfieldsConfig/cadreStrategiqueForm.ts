import type { FormConfig } from "../../Global/types/formConfig";

export const getCadreStrategiqueFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code cadre stratégique
        {
            name: "code_cs",
            label: "Code cadre stratégique",
            type: "text",
            placeholder: "Ex: CS001, CS01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé cadre stratégique
        {
            name: "intutile_cs",
            label: "Intitulé",
            type: "text",
            placeholder: "Intitulé du cadre stratégique",
            required: true,
            gridCols: 2,
        },
        // texte - Abrégé
        {
            name: "abgrege_cs",
            label: "Abrégé",
            type: "text",
            placeholder: "Ex: CS, STRAT, AXE...",
            required: true,
            gridCols: 1,
        },
        // number/select - Niveau (peut être number ou string)
        {
            name: "niveau_cs",
            label: "Niveau",
            type: "text",
            placeholder: "Ex: 1, 2, 3 ou 'A', 'B', 'C'...",
            required: true,
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
        // select - Partenaire (optionnel)
        {
            name: "partenaire_cs",
            label: "Partenaire",
            type: "select",
            placeholder: "Sélectionner un partenaire (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Parent cadre stratégique (optionnel)
        {
            name: "parent_cs",
            label: "Parent",
            type: "select",
            placeholder: "Sélectionner un parent (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Programme (optionnel)
        {
            name: "programme_cs",
            label: "Programme",
            type: "select",
            placeholder: "Sélectionner un programme (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})