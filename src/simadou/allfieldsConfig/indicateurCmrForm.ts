import type { FormConfig } from "../../Global/types/formConfig";

export const getIndicateurCmrFormConfig = (): FormConfig => ({

    fields: [
        // texte - Code référence indicateur
        {
            name: "code_ref_ind",
            label: "Code référence indicateur",
            type: "text",
            placeholder: "Ex: IND001, CMR01...",
            required: true,
            gridCols: 1,
        },
        // texte - Résultat CMR
        {
            name: "resultat_cmr",
            label: "Résultat CMR",
            type: "text",
            placeholder: "Ex: Résultat 1, Résultat 2...",
            required: true,
            gridCols: 1,
        },
        // texte - Intitulé référence indicateur
        {
            name: "intitule_ref_ind",
            label: "Intitulé référence indicateur",
            type: "text",
            placeholder: "Intitulé de l'indicateur",
            required: true,
            gridCols: 2,
        },
        // texte - Référence CMR
        {
            name: "reference_cmr",
            label: "Référence CMR",
            type: "text",
            placeholder: "Référence du CMR",
            required: true,
            gridCols: 1,
        },
        // number - Année référence
        {
            name: "annee_reference",
            label: "Année référence",
            type: "number",
            placeholder: "Ex: 2024",
            required: true,
            min: 1900,
            max: 2100,
            step: 1,
            gridCols: 1,
        },
        // texte - Responsable collecte
        {
            name: "responsable_collecte_cmr",
            label: "Responsable collecte",
            type: "text",
            placeholder: "Nom du responsable de la collecte",
            required: true,
            gridCols: 1,
        },
        // texte - Cible CMR
        {
            name: "cible_cmr",
            label: "Cible CMR",
            type: "text",
            placeholder: "Ex: 1000 bénéficiaires",
            required: true,
            gridCols: 1,
        },
        // texte - Fonction agrégat
        {
            name: "fonction_agregat_cmr",
            label: "Fonction agrégat",
            type: "text",
            placeholder: "Ex: Somme, Moyenne, Pourcentage...",
            required: true,
            gridCols: 1,
        },
        // select - Unité indicateur (optionnel)
        {
            name: "unite_cmr",
            label: "Unité indicateur",
            type: "select",
            placeholder: "Sélectionner une unité (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
    ]

})