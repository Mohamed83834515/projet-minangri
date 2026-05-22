import type { FormConfig } from "../../Global/types/formConfig";

export const getSuiviIndicateurActiviteFormConfig = (): FormConfig => ({

    fields: [
        // date - Date suivi indicateur
        {
            name: "date_suivi_indicateur",
            label: "Date suivi indicateur",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 1,
        },
        // number - Valeur suivi indicateur
        {
            name: "valeur_suivi_indicateur",
            label: "Valeur suivi indicateur",
            type: "number",
            placeholder: "Ex: 100, 500, 1000.50...",
            required: true,
            min: 0,
            gridCols: 1,
        },
        // select - Indicateur activité (optionnel)
        {
            name: "indicateur_activite",
            label: "Indicateur activité",
            type: "select",
            placeholder: "Sélectionner un indicateur (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Localité (optionnel)
        {
            name: "localite",
            label: "Localité",
            type: "select",
            placeholder: "Sélectionner une localité (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})