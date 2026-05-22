import type { FormConfig } from "../../Global/types/formConfig";

export const getObservationPtbaFormConfig = (): FormConfig => ({

    fields: [
        // textarea - Observation
        {
            name: "observation",
            label: "Observation",
            type: "textarea",
            placeholder: "Texte de l'observation...",
            rows: 4,
            required: true,
            gridCols: 2,
        },
        // date - Date observation
        {
            name: "date_observation",
            label: "Date observation",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // select - PTBA (optionnel)
        {
            name: "ptba",
            label: "PTBA",
            type: "select",
            placeholder: "Sélectionner une activité PTBA (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})