import type { FormConfig } from "../../Global/types/formConfig";

export const getCadreResultatFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code cadre résultat
        {
            name: "code_cr",
            label: "Code cadre résultat",
            type: "text",
            placeholder: "Ex: CR001, CR01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé cadre résultat
        {
            name: "intutile_cr",
            label: "Intitulé",
            type: "text",
            placeholder: "Intitulé du cadre résultat",
            required: true,
            gridCols: 2,
        },
        // texte - Abrégé
        {
            name: "abgrege_cr",
            label: "Abrégé",
            type: "text",
            placeholder: "Ex: CR, RES, IND...",
            required: true,
            gridCols: 1,
        },
        // number - Coût axe
        {
            name: "cout_axe",
            label: "Coût axe",
            type: "number",
            placeholder: "Montant du coût",
            required: true,
            min: 0,
            step: 0.01,
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
                { value: "actif", label: "Actif" },
                { value: "inactif", label: "Inactif" },
                { value: "en_cours", label: "En cours" },
                { value: "termine", label: "Terminé" }
            ],
            gridCols: 1,
        },
        // number - Niveau (optionnel)
        {
            name: "niveau_cr",
            label: "Niveau",
            type: "number",
            placeholder: "Ex: 1, 2, 3... (optionnel)",
            required: false,
            min: 1,
            gridCols: 1,
        },
        // select - Partenaire (optionnel)
        {
            name: "partenaire_cr",
            label: "Partenaire",
            type: "select",
            placeholder: "Sélectionner un partenaire (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Parent cadre résultat (optionnel)
        {
            name: "parent_cr",
            label: "Parent",
            type: "select",
            placeholder: "Sélectionner un parent (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Projet (optionnel)
        {
            name: "projet_cr",
            label: "Projet",
            type: "select",
            placeholder: "Sélectionner un projet (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})