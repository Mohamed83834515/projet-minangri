import type { FormConfig } from "../../Global/types/formConfig";

export const getSuiviTacheActiviteFormConfig = (): FormConfig => ({

    fields: [
        {
            name: "proportion_realisee",
            label: "Proportion réalisée",
            type: "number",
            placeholder: "Ex: 0, 25, 50, 75, 100",
            required: true,
            min: 0,
            max: 100,
            step: 1,
            gridCols: 1,
        },
        {
            name: "valide",
            label: "Validé",
            type: "checkbox",
            defaultChecked: false,
            gridCols: 1,
        },
        {
            name: "date_reele",
            label: "Date réelle",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        {
            name: "observation_suivi",
            label: "Observation suivi",
            type: "textarea",
            placeholder: "Observations sur le suivi...",
            rows: 3,
            required: true,
            gridCols: 2,
        },
        {
            name: "livrable_fichier",
            label: "Fichiers livrables",
            type: "file",
            multiple: true,
            accept: "application/pdf,image/*,.doc,.docx",
            maxSize: 10,
            helperText: "PDF, images ou documents (max 10 Mo par fichier)",
            required: false,
            gridCols: 2,
        },
    ]

})

/** Formulaire suivi tâche dans le contexte d'une tâche déjà sélectionnée */
export const getSuiviTacheActiviteFormConfigForTache = (): FormConfig => ({
    fields: getSuiviTacheActiviteFormConfig().fields.filter(
        (f) => f.name !== "id_groupe_tache" && f.name !== "id_activite_ptba",
    ),
})
