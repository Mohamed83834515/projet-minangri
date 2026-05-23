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
    ]

})

/** Observation liée à une activité déjà connue (champ ptba masqué) */
export const getObservationPtbaFormConfigForActivite = (): FormConfig => ({
    fields: getObservationPtbaFormConfig().fields.filter(
        (f) => f.name !== "ptba",
    ),
})