import type { FormConfig } from "../../Global/types/formConfig";

export const getPersonnelFormConfig = (): FormConfig => ({

    fields: [
        // checkbox - Admin
        {
            name: "is_admin",
            label: "Administrateur",
            type: "checkbox",
            defaultChecked: false,
            gridCols: 1,
        },
        // checkbox - Mot de passe défini
        {
            name: "is_password_set",
            label: "Mot de passe défini",
            type: "checkbox",
            defaultChecked: false,
            gridCols: 1,
        },
        // texte - ID personnel (optionnel)
        {
            name: "id_personnel_perso",
            label: "ID personnel",
            type: "text",
            placeholder: "Ex: P001, EMP01...",
            required: false,
            gridCols: 1,
        },
        // select - Titre personnel (optionnel)
        {
            name: "titre_personnel",
            label: "Titre personnel",
            type: "select",
            placeholder: "Sélectionner un titre (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // texte - Nom (optionnel)
        {
            name: "nom_perso",
            label: "Nom",
            type: "text",
            placeholder: "Nom du personnel",
            required: false,
            gridCols: 1,
        },
        // texte - Prénom (optionnel)
        {
            name: "prenom_perso",
            label: "Prénom",
            type: "text",
            placeholder: "Prénom du personnel",
            required: false,
            gridCols: 1,
        },
        // email - Email (optionnel)
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "exemple@domaine.com",
            required: false,
            gridCols: 1,
        },
        // texte - Contact (optionnel)
        {
            name: "contact_perso",
            label: "Contact",
            type: "text",
            placeholder: "Téléphone, WhatsApp...",
            required: false,
            gridCols: 1,
        },
        // select - Fonction (optionnel)
        {
            name: "fonction_perso",
            label: "Fonction",
            type: "select",
            placeholder: "Sélectionner une fonction (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Service (optionnel)
        {
            name: "service_perso",
            label: "Service",
            type: "select",
            placeholder: "Sélectionner un service (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // number - Niveau personnel (optionnel)
        {
            name: "niveau_perso",
            label: "Niveau personnel",
            type: "number",
            placeholder: "Ex: 1, 2, 3...",
            required: false,
            min: 1,
            gridCols: 1,
        },
        // checkbox - Rapport mensuel
        {
            name: "rapport_mensuel_perso",
            label: "Rapport mensuel",
            type: "checkbox",
            defaultChecked: false,
            gridCols: 1,
        },
        // checkbox - Rapport trimestriel
        {
            name: "rapport_trimestriel_perso",
            label: "Rapport trimestriel",
            type: "checkbox",
            defaultChecked: false,
            gridCols: 1,
        },
        // checkbox - Rapport semestriel
        {
            name: "rapport_semestriel_perso",
            label: "Rapport semestriel",
            type: "checkbox",
            defaultChecked: false,
            gridCols: 1,
        },
        // checkbox - Rapport annuel
        {
            name: "rapport_annuel_perso",
            label: "Rapport annuel",
            type: "checkbox",
            defaultChecked: false,
            gridCols: 1,
        },
        // select - Statut
        {
            name: "statut",
            label: "Statut",
            type: "select",
            placeholder: "Sélectionner un statut",
            required: false,
            options: [
                { value: 1, label: "Actif" },
                { value: 0, label: "Inactif" }
            ],
            gridCols: 1,
        },
        // select - Région (optionnel)
        {
            name: "region_perso",
            label: "Région",
            type: "select",
            placeholder: "Sélectionner une région (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // select - Structure (optionnel)
        {
            name: "structure_perso",
            label: "Structure",
            type: "select",
            placeholder: "Sélectionner une structure (optionnel)",
            required: false,
            options: [], // À remplir dynamiquement depuis l'API
            gridCols: 1,
        },
        // texte - UGL personnel (optionnel)
        {
            name: "ugl_perso",
            label: "UGL personnel",
            type: "text",
            placeholder: "Code UGL (optionnel)",
            required: false,
            gridCols: 1,
        },
        // password - Mot de passe (optionnel)
        {
            name: "pass",
            label: "Mot de passe",
            type: "password",
            placeholder: "Nouveau mot de passe",
            required: false,
            gridCols: 1,
        },
    ]

})