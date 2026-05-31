import type { FormConfig } from "../../Global/types/formConfig";

export const getChangePasswordFormConfig = (): FormConfig => ({

    fields: [
       
        {
            name: "oldPassword",
            label: "Mot de passe actuel",
            type: "password",
            placeholder: "********",
            required: true,
            gridCols: 1,
            showPasswordToggle : true
        },
       
        {
            name: "newPassword",
            label: "Nouveau mot de passe",
            type: 'password',
            placeholder: "********",
            required: true,
            gridCols: 1,
             showPasswordToggle : true,
             showPasswordChecker : true
        },

          {
            name: "confirmNewPassword",
            label: "Confirmation du nouveau mot de passe",
            type: "password",
            placeholder: "********",
            required: true,
            gridCols: 1,
             showPasswordToggle : true
        },
    ]

})