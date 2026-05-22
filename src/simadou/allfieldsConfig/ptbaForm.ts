import type { FormConfig } from "../../Global/types/formConfig";

export const getPtbaFormConfig = (): FormConfig => ({

    fields: [
        // select multiple - Localités PTBA
        {
            name: "localites_ptba",
            label: "Localités",
            type: "select",
            placeholder: "Sélectionner une ou plusieurs localités",
            required: true,
            multiple: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
        // select multiple - Partenaires concernés
        {
            name: "partenaire_conserne_ptba",
            label: "Partenaires concernés",
            type: "select",
            placeholder: "Sélectionner un ou plusieurs partenaires",
            required: true,
            multiple: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
        // texte - Code activité PTBA
        {
            name: "code_activite_ptba",
            label: "Code activité PTBA",
            type: "text",
            placeholder: "Ex: ACT001, PTBA01...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé activité PTBA
        {
            name: "intitule_activite_ptba",
            label: "Intitulé activité PTBA",
            type: "text",
            placeholder: "Intitulé de l'activité (max 200 caractères)",
            required: true,
            maxLength: 200,
            gridCols: 2,
        },
        // texte - Chronogramme
        {
            name: "chronogramme",
            label: "Chronogramme",
            type: "text",
            placeholder: "Mois concernés (ex: Jan-Mar 2024)",
            required: true,
            maxLength: 100,
            gridCols: 1,
        },
        // textarea - Observation (optionnel)
        {
            name: "observation",
            label: "Observation",
            type: "textarea",
            placeholder: "Observations éventuelles...",
            rows: 3,
            required: false,
            gridCols: 2,
        },
        // texte - Statut activité
        {
            name: "statut_activite",
            label: "Statut activité",
            type: "text",
            placeholder: "Ex: En cours, Planifié, Terminé",
            required: true,
            maxLength: 100,
            gridCols: 1,
        },
        // select - Code CRP (optionnel)
        {
            name: "code_crp",
            label: "Code CRP",
            type: "select",
            placeholder: "Sélectionner un cadre stratégique (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Cadre analytique (optionnel)
        {
            name: "cadre_analytique",
            label: "Cadre analytique",
            type: "select",
            placeholder: "Sélectionner un cadre analytique (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Responsable PTBA (optionnel)
        {
            name: "responsable_ptba",
            label: "Responsable PTBA",
            type: "select",
            placeholder: "Sélectionner un responsable (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Direction PTBA (optionnel)
        {
            name: "direction_ptba",
            label: "Direction PTBA",
            type: "select",
            placeholder: "Sélectionner une direction (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Code programme (optionnel)
        {
            name: "code_programme",
            label: "Code programme",
            type: "select",
            placeholder: "Sélectionner un programme (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // number - Version PTBA
        {
            name: "version_ptba",
            label: "Version PTBA",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // select - Type activité
        {
            name: "type_activite",
            label: "Type activité",
            type: "select",
            placeholder: "Sélectionner un type d'activité",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})