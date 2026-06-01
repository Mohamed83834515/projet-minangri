import type { FormConfig } from "../../Global/types/formConfig";
import { getIndicateurCmrs } from "../allHooks/admin/indicateurCmrHooks";
import { getUniteIndicateurs } from "../allHooks/admin/uniteIndicateurHooks";

const indicateurCmrs = await getIndicateurCmrs();
const uniteIndicateurs = await getUniteIndicateurs();

const indicateurCmrOptions = indicateurCmrs.map((i) => ({
    value: i.id_ref_ind_cmr,
    label: i.intitule_ref_ind!,
}));

const uniteIndicateurOptions = uniteIndicateurs.map((u) => ({
    value:  u.id_unite,
    label: u.definition_ui!,
}));
export const getIndicateurTacheFormConfig = (): FormConfig => ({

    fields: [
        // texte - Intitulé indicateur tâche
        {
            name: "intitule_indicateur_tache",
            label: "Intitulé indicateur tâche",
            type: "textarea",
            placeholder: "Intitulé de l'indicateur",
            required: true,
            gridCols: 1,
        },
        // texte - Unité indicateur tâche
        {
            name: "unite_ind_tache",
            label: "Unité indicateur tâche",
            type: "select",
            options: uniteIndicateurOptions,
            placeholder: "Ex: Kg, %, Nbre, FCFA...",
            required: true,
            gridCols: 2,
        },
        // texte - Code indicateur PTBA
        {
            name: "code_indicateur_ptba",
            label: "Code indicateur PTBA",
            type: "text",
            placeholder: "Ex: IND001, PTBA01...",
            required: true,
            gridCols: 2,
        },
        // select - Indicateur CMR
        {
            name: "indicateur_cmr",
            label: "Indicateur CMR",
            type: "select",
            placeholder: "Sélectionner un indicateur CMR",
            required: true,
            options: indicateurCmrOptions, // À remplir dynamiquement depuis l'API
            gridCols: 2,
        },
        // Trimestre 1
        {
            name: "trimestre_1",
            label: "Trimestre 1",
            type: "text",
            placeholder: "Ex: 100, 75%, 2000...",
            gridCols: 2,
        },
        // Trimestre 2
        {
            name: "trimestre_2",
            label: "Trimestre 2",
            type: "text",
            placeholder: "Ex: 100, 75%, 2000...",
            gridCols: 2,
        },
        // Trimestre 3
        {
            name: "trimestre_3",
            label: "Trimestre 3",
            type: "text",
            placeholder: "Ex: 100, 75%, 2000...",
            gridCols: 2,
        },
        // Trimestre 4
        {
            name: "trimestre_4",
            label: "Trimestre 4",
            type: "text",
            placeholder: "Ex: 100, 75%, 2000...",
            gridCols: 2,
        },
    ]

})