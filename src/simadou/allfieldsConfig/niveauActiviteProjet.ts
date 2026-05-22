import type { FormConfig } from "../../Global/types/formConfig";

export const getNiveauActiviteProjetFormConfig = (): FormConfig => ({

    fields: [
        // number - Nombre niveau activité projet
        {
            name: "nombre_niveau_activite_projet",
            label: "Nombre niveau activité projet",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: true,
            min: 1,
            gridCols: 1,
        },
        // texte - Libellé niveau activité projet
        {
            name: "libelle_niveau_activite_projet",
            label: "Libellé niveau activité projet",
            type: "text",
            placeholder: "Ex: Phase, Tâche, Sous-tâche...",
            required: true,
            gridCols: 2,
        },
        // number - Taille code niveau activité projet
        {
            name: "taille_code_niveau_activite_projet",
            label: "Taille code niveau activité projet",
            type: "number",
            placeholder: "Ex: 2, 3, 4...",
            required: true,
            min: 1,
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