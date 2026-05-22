import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DynamicForm } from "@/Global/Forms/DynamicForm";
import { getUserFormConfig } from "@/simadou/allfieldsConfig/userFormConfig";
import { userSchema, type User } from "@/simadou/schemas/allSchema";

interface EditUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
}

const EditUser = ({ open, onOpenChange, currentRow }: EditUserProps) => {
  // const { mutate, isPending } = useEditUser();
  const formConfig = getUserFormConfig();

  const onSubmit = () => {
    // mutate({ id: currentRow.id, ...data }, {
    //   onSuccess: () => {
    //     onOpenChange(false);
    //   },
    // });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifier les informations de{" "}
            <span className="font-medium">{currentRow.username}</span>
          </DialogDescription>
        </DialogHeader>
        <DynamicForm
          config={formConfig}
          schema={userSchema}
          defaultValues={currentRow}
          onSubmit={onSubmit}
          // isLoading={isPending}
          submitText="Sauvegarder les modifications"
          loadingText="Modification en cours..."
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;