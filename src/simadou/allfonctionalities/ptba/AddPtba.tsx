import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DIALOG_SIZES } from "@/Global/Forms/dialog"
import { DynamicForm } from "@/Global/Forms/DynamicForm"
import { getPtbaFormConfig } from "@/simadou/allfieldsConfig/ptbaForm"
import { PTBA } from "@/simadou/allResetFields/resetField"
import { OpenProps } from "@/simadou/interfaces/interfaceTable"
import { ptbaSchema } from "@/simadou/schemas/ptbaSchemas"

const AddPtba = ({ open, onOpenChange }: OpenProps) => {
  // const { mutate, isPending } = useAddUser();
  const formConfig = getPtbaFormConfig()

  const onSubmit = () => {
    // mutate(data, {
    //   onSuccess: () => {
    //     onOpenChange(false);
    //   },
    // });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_SIZES.md}>
        <DialogHeader>
          <DialogTitle>Ajouter une Activite</DialogTitle>
          <DialogDescription>Création d'une nouvelle Activite</DialogDescription>
        </DialogHeader>
        <DynamicForm
          config={formConfig}
          schema={ptbaSchema}
          defaultValues={PTBA}
          onSubmit={onSubmit}
          submitText="Ajouter le PTBA"
          loadingText='Ajout en cours...'
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddPtba