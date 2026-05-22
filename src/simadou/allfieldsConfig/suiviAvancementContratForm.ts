import type { FormConfig } from "../../Global/types/formConfig";

export const getSuiviAvancementContratFormConfig = (): FormConfig => ({

    fields: [
        // date - Date suivi
        {
            name: "date_suivi",
            label: "Date suivi",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // texte - Code suivi (optionnel)
        {
            name: "code_suivi",
            label: "Code suivi",
            type: "text",
            placeholder: "Ex: SUI001, SUIVI01...",
            required: false,
            gridCols: 1,
        },
        // texte - État avancement
        {
            name: "etat_avancement",
            label: "État avancement",
            type: "text",
            placeholder: "Ex: En cours, Terminé, En retard...",
            required: true,
            gridCols: 1,
        },
        // texte - Statut activité
        {
            name: "statut_activite",
            label: "Statut activité",
            type: "text",
            placeholder: "Ex: Planifié, Réalisé, Reporté...",
            required: true,
            gridCols: 1,
        },
        // texte - Retard accusé
        {
            name: "retard_accuse",
            label: "Retard accusé",
            type: "text",
            placeholder: "Raisons et durée du retard",
            required: true,
            gridCols: 2,
        },
        // textarea - Difficultés rencontrées
        {
            name: "difficultes_rencontrees",
            label: "Difficultés rencontrées",
            type: "textarea",
            placeholder: "Difficultés et obstacles identifiés...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        // textarea - Pistes solutions
        {
            name: "pistes_solutions",
            label: "Pistes solutions",
            type: "textarea",
            placeholder: "Solutions proposées...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        // textarea - Observation
        {
            name: "observation",
            label: "Observation",
            type: "textarea",
            placeholder: "Observations complémentaires...",
            rows: 2,
            required: true,
            gridCols: 2,
        },
        // file - Documents (optionnel)
        {
            name: "documents",
            label: "Documents",
            type: "file",
            accept: "application/pdf, image/*, .doc, .docx",
            maxSize: 10,
            helperText: "Formats acceptés: PDF, Images, DOC (max 10MB)",
            required: false,
            gridCols: 2,
        },
        // select - État
        {
            name: "etat",
            label: "État",
            type: "select",
            placeholder: "Sélectionner un état",
            required: true,
            options: [
                { value: "actif", label: "Actif" },
                { value: "inactif", label: "Inactif" },
                { value: "en_cours", label: "En cours" },
                { value: "termine", label: "Terminé" }
            ],
            gridCols: 1,
        },
        // select - Activité PTBA
        {
            name: "activite_ptba",
            label: "Activité PTBA",
            type: "select",
            placeholder: "Sélectionner une activité PTBA",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Sous activité (optionnel)
        {
            name: "sous_activite",
            label: "Sous activité",
            type: "select",
            placeholder: "Sélectionner une sous activité (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Personnel
        {
            name: "id_personnel",
            label: "Personnel",
            type: "select",
            placeholder: "Sélectionner un personnel",
            required: true,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})