import type { FormConfig } from "../../Global/types/formConfig";

export const getProgrammeFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code programme
        {
            name: "code_programme",
            label: "Code programme",
            type: "text",
            placeholder: "Ex: PROG001, PRG01...",
            required: true,
            gridCols: 1,
        },
        // texte - Sigle programme
        {
            name: "sigle_programme",
            label: "Sigle programme",
            type: "text",
            placeholder: "Ex: PAD, PEF, PAS...",
            required: true,
            gridCols: 1,
        },
        // texte - Nom programme
        {
            name: "nom_programme",
            label: "Nom programme",
            type: "text",
            placeholder: "Nom complet du programme",
            required: true,
            gridCols: 2,
        },
        // textarea - Vision programme
        {
            name: "vision_programme",
            label: "Vision du programme",
            type: "textarea",
            placeholder: "Vision et ambitions du programme...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        // textarea - Objectif programme
        {
            name: "objectif_programme",
            label: "Objectif du programme",
            type: "textarea",
            placeholder: "Objectifs principaux du programme...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        // date - Année début
        {
            name: "annee_debut_programme",
            label: "Année début",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // date - Année fin
        {
            name: "annee_fin_programme",
            label: "Année fin",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // checkbox - Actif
        {
            name: "actif_programme",
            label: "Programme actif",
            type: "checkbox",
            defaultChecked: true,
            gridCols: 2,
        },
    ]

})