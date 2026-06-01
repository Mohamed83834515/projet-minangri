import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DIALOG_SIZES } from "@/Global/Forms/dialog";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon, Dna, KeyRound, LucideIcon, MapPin, Phone } from "lucide-react";
import ChangePassword from "./changePassword";
import { EditableField } from "./profile-form";
import { UpdatePersonnelPayload, useUpdatePersonnel } from "@/simadou/allHooks/personnel/personnelHooks";
import { TitleForm } from "./TitleForm";
import TelephoneForm from "./TelephoneForm";
import RegionForm from "./RegionForm";
import { useMe } from "@/simadou/allHooks/auth/authHooks";

type Props = {
  open: boolean;
  field: EditableField | null;
  onClose: () => void;
};

type FieldConfig = {
  label: string;
  icon: LucideIcon;
  description: string;
  component: React.ReactNode;
};

// Updated fieldItem config


const EditFieldDialog = ({
  open,
  field,
  onClose,
}: Props) => {
  if (!field) return null;

  const router = useRouter()
const { data: personnel } = useMe()
const { mutate: updatePersonnel, isPending } = useUpdatePersonnel(
  personnel?.n_personnel ?? 0
)





const handleFieldSuccess = (data : UpdatePersonnelPayload) => {
 updatePersonnel(data)
 onClose()
}


const fieldItem: Record<EditableField, FieldConfig> = {
  title: {
    label:       'Titre',
    icon:        Dna,
    description: 'Modifier votre titre',
    component: (
      <TitleForm
        currentValue={String(personnel?.titre_personnel?.libelle_titre ?? '')}
        onSuccess={handleFieldSuccess}
        isPending={isPending}
      />
    ),
  },

  telephone: {
    label:       'Numéro de téléphone',
    icon:        Phone,
    description: 'Modifier votre numéro',
    component: (
      <TelephoneForm
        currentValue={personnel?.contact_perso}
        onSuccess={handleFieldSuccess}
        isPending={isPending}
      />
    ),
  },

  region: {
    label:       'Région',
    icon:        MapPin,
    description: 'Modifier votre région',
    component: (
      <RegionForm
        currentValue={personnel?.region_perso?.intitule_loca  ?? ''}
        onSuccess={handleFieldSuccess}
        isPending={isPending}
      />
    ),
  },

  password: {
    label:       'Mot de passe',
    icon:        KeyRound,
    description: 'Définissez un nouveau mot de passe sécurisé',
    component:   <ChangePassword />,
  },
}

 const Icon = fieldItem[field].icon
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${DIALOG_SIZES.md} max-h-[95%] overflow-y-auto`} >
        <DialogHeader>
           <div className="flex items-start justify-between p-2">
              <Button
              variant={'ghost'}
              className="cursor-pointer group hover:bg-background"
              onClick={()=> router.history.back()}
              >
               <ArrowLeftIcon className="w-5 h-5 group-hover:text-primary/75" />
              </Button>
              

              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
               
              </div>

              <div />
            </div>
          <DialogTitle className="text-3xl font-bold text-center">
            {fieldItem[field].label}
          </DialogTitle>

          <DialogDescription className="text-center">
            {fieldItem[field].description.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <div>
           {fieldItem[field].component}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFieldDialog





