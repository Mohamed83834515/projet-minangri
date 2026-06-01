import type { FormConfig } from "../../Global/types/formConfig";
import { getPersonnels } from "../allHooks/admin/personnelHooks";


const personnels = await getPersonnels();

const personnelOptions = personnels.map((p) => ({
    value: p.n_personnel!,
    label: `${p.prenom_perso} ${p.nom_perso}`,
}));

export const getTacheActivitePtbaFormConfig = (): FormConfig => ({


    fields: [
        // texte - Code tâche
        {
            name: "code_tache_gt",
            label: "Code tâche",
            type: "text",
            placeholder: "Code de la tâche (max 200 caractères)",
            required: true,
            maxLength: 200,
            gridCols: 2,
        },
        // texte - Proportion
        {
            name: "proportion_gt",
            label: "Proportion",
            type: "number",
            placeholder: "Ex: 25%, 50%, 100%",
            required: true,
            maxLength: 10,
            gridCols: 2,
        },

        // texte - Intitulé tâche
        {
            name: "intutile_tache_gt",
            label: "Intitulé tâche",
            type: "textarea",
            placeholder: "Intitulé de la tâche (max 200 caractères)",
            required: true,
            cols: 1,
            maxLength: 200,
            gridCols: 1,
        },
        // date - Date début
        {
            name: "date_debut_gt",
            label: "Date début",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 2,
        },
        // date - Date fin
        {
            name: "date_fin_gt",
            label: "Date fin",
            type: "date",
            placeholder: "AAAA-MM-JJ",
            required: true,
            gridCols: 2,
        },
        // number - N° lot
        {
            name: "n_lot_gt",
            label: "N° lot",
            type: "number",
            placeholder: "Numéro du lot",
            required: true,
            min: 1,
            gridCols: 2,
        },
        // select - Responsable (optionnel)
        {
            name: "responsable_gt",
            label: "Responsable",
            type: "select",
            placeholder: "Sélectionner un responsable (optionnel)",
            required: false,
            options: personnelOptions, // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
    ]

})