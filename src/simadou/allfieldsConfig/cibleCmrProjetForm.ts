import type { FormConfig } from "../../Global/types/formConfig";

export const getCibleCmrProjetFormConfig = (): FormConfig => ({

    fields: [
        // date - Année
        {
            name: "annee",
            label: "Année",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // number - Valeur cible indicateur CRP
        {
            name: "valeur_cible_indcateur_crp",
            label: "Valeur cible indicateur CRP",
            type: "number",
            placeholder: "Ex: 100, 500, 1000...",
            required: true,
            min: 0,
            step: 1,
            gridCols: 1,
        },
        // select - Code indicateur CRP (optionnel)
        {
            name: "code_indicateur_crp",
            label: "Code indicateur CRP",
            type: "select",
            placeholder: "Sélectionner un indicateur CRP (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Code UG (optionnel)
        {
            name: "code_ug",
            label: "Code UG",
            type: "select",
            placeholder: "Sélectionner un code UG (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Code projet (optionnel)
        {
            name: "code_projet",
            label: "Code projet",
            type: "select",
            placeholder: "Sélectionner un projet (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})