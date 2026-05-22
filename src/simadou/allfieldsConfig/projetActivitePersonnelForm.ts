import type { FormConfig } from "../../Global/types/formConfig";

export const getProjetActivePersoFormConfig = (): FormConfig => ({

    fields: [
        // select - Projet (optionnel)
        {
            name: "id_projet",
            label: "Projet",
            type: "select",
            placeholder: "Sélectionner un projet",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // texte - Code projet
        {
            name: "code_projet",
            label: "Code projet",
            type: "text",
            placeholder: "Ex: PRJ001, PROJ01...",
            required: true,
            gridCols: 1,
        },
        // texte - Sigle projet
        {
            name: "sigle_projet",
            label: "Sigle projet",
            type: "text",
            placeholder: "Ex: PAD, PEF, PAS...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé projet
        {
            name: "intitule_projet",
            label: "Intitulé projet",
            type: "text",
            placeholder: "Intitulé complet du projet",
            required: true,
            gridCols: 2,
        },
        // number - Durée projet
        {
            name: "duree_projet",
            label: "Durée projet",
            type: "number",
            placeholder: "Durée en mois",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // date - Date signature
        {
            name: "date_signature_projet",
            label: "Date signature",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // date - Date démarrage
        {
            name: "date_demarrage_projet",
            label: "Date démarrage",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // select - Partenaire projet
        {
            name: "partenaire_projet",
            label: "Partenaire projet",
            type: "select",
            placeholder: "Sélectionner un partenaire",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Programme projet
        {
            name: "programme_projet",
            label: "Programme projet",
            type: "select",
            placeholder: "Sélectionner un programme",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select multiple - Structure projet
        {
            name: "structure_projet",
            label: "Structure projet",
            type: "select",
            placeholder: "Sélectionner une ou plusieurs structures",
            required: true,
            multiple: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
        // select multiple - Signataires projet
        {
            name: "signataires_projet",
            label: "Signataires projet",
            type: "select",
            placeholder: "Sélectionner un ou plusieurs signataires",
            required: true,
            multiple: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
        // select multiple - Partenaires exécution
        {
            name: "partenaires_execution_projet",
            label: "Partenaires exécution",
            type: "select",
            placeholder: "Sélectionner un ou plusieurs partenaires d'exécution",
            required: true,
            multiple: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
        // select multiple - Zone projet
        {
            name: "zone_projet",
            label: "Zone projet",
            type: "select",
            placeholder: "Sélectionner une ou plusieurs localités",
            required: true,
            multiple: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
    ]

})
