import type { FormConfig } from "../../Global/types/formConfig";

export const getVersionPtbaFormConfig = (): FormConfig => ({

    fields: [
        // number - Année PTBA
        {
            name: "annee_ptba",
            label: "Année PTBA",
            type: "number",
            placeholder: "Ex: 2024",
            required: true,
            min: 2000,
            max: 2100,
            step: 1,
            gridCols: 1,
        },
        // texte - Version PTBA (optionnel)
        {
            name: "version_ptba",
            label: "Version PTBA",
            type: "text",
            placeholder: "Ex: v1.0, v2.0, bêta...",
            required: false,
            maxLength: 30,
            gridCols: 1,
        },
        // date - Date validation
        {
            name: "date_validation",
            label: "Date validation",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
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
        // file - Document (optionnel)
        {
            name: "documentUrl",
            label: "Document",
            type: "file",
            accept: ".pdf,.doc,.docx",
            maxSize: 10,
            helperText: "Formats acceptés: PDF, DOC, DOCX (max 10MB)",
            required: false,
            gridCols: 2,
        },
        // select - Statut version (optionnel)
        {
            name: "statut_version",
            label: "Statut version",
            type: "select",
            placeholder: "Sélectionner un statut",
            required: false,
            options: [
                { value: 0, label: "En construction" },
                { value: 1, label: "Validée" },
                { value: 2, label: "Archivée" }
            ],
            gridCols: 1,
        },
        // texte - État (optionnel)
        {
            name: "etat",
            label: "État",
            type: "text",
            placeholder: "Ex: Actif, Inactif...",
            required: false,
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
        // select - Personnel (optionnel)
        {
            name: "id_personnel",
            label: "Personnel",
            type: "select",
            placeholder: "Sélectionner un personnel (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})