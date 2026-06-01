import { ConfirmDialog } from '@/components/others/confirm-dialog'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getChangePasswordFormConfig } from '@/simadou/allfieldsConfig/changePasswordForm'
import { useChangePasswordMutation, useLogout, useMe } from '@/simadou/allHooks/auth/authHooks'
import { CHANGE_PASSWORD } from '@/simadou/allResetFields/resetField'
import { ChangePasswordFormData, changePasswordSchema } from '@/simadou/schemas/auth.schemas'
import { useNavigate } from '@tanstack/react-router'

import { useState } from 'react'


const ChangePassword = () => {
  const {data : user} = useMe()
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
   const {mutate, isPending} = useChangePasswordMutation()
    const navigate = useNavigate()
    const {mutate : logout}= useLogout()
   const [pendingFormData, setPendingFormData] =
    useState<ChangePasswordFormData | null>(null);
      const formConfig = getChangePasswordFormConfig()
const handleSubmit = (data: ChangePasswordFormData) => {
    setOpenConfirmDialog(true)
    setPendingFormData(data)
  };

  const confirmPasswordChange = () => {
    if (!pendingFormData) return;

    mutate({userId : user?.n_personnel!, data : pendingFormData });
    
    setOpenConfirmDialog(false);
     logout();
         

            navigate({to : '/sign-in', replace : true})
  };
   
  return (
    <>

     <DynamicForm
      config={formConfig}
      schema={changePasswordSchema}
      defaultValues={CHANGE_PASSWORD}
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitText="Sauvegarder les modifications"
      loadingText="Modification en cours..."
    />
    
    <ConfirmDialog 
    title="Confirmer la modification du mot de passe?"
    desc={"Cette action déconnectera toutes vos sessions actives sur tous vos appareils.  Vous devrez vous reconnecter avec votre nouveau mot de passe."}
    onOpenChange={setOpenConfirmDialog}
    open={openConfirmDialog}
    handleConfirm={confirmPasswordChange}
    />
    </>
    
  )
}

export default ChangePassword