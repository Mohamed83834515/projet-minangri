import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DIALOG_SIZES } from "@/Global/Forms/dialog"
import { StepDynamicForm } from "@/Global/Forms/StepDynamicForm"
import { useActiveProgrammeCode } from "@/hooks/use-active-programme"
import { getPtbaFormConfig } from "@/simadou/allfieldsConfig/ptbaForm"
import ptbaService from "@/simadou/allSercices/ptbaService"
import { CadreAnalytique } from "@/simadou/allTypes/cadreAnalytique"
import { Acteur, Localite, PlanSite, Ptba } from "@/simadou/allTypes/entities"
import { PtbaFormData, ptbaSchema } from "@/simadou/schemas/ptbaSchemas"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {toast} from "sonner"
export interface OpenPropsPTBA {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Ptba | null;
}
const AddPtba = ({ open, onOpenChange, currentRow }: OpenPropsPTBA) => {
  const formConfig = getPtbaFormConfig()
  const isEdit = !!currentRow?.id_ptba
  const codeProgramme = useActiveProgrammeCode();
  const versionPtbaSelect =
    localStorage.getItem("selectedVersionId") || "0"

  const defaultValues: PtbaFormData = {
    localites_ptba:
      typeof currentRow?.localites_ptba === "object"
        ? (currentRow?.localites_ptba as Localite[]).map(l => l.id_loca)
        : [],

    partenaire_conserne_ptba:
      typeof currentRow?.partenaire_conserne_ptba === "object"
        ? (currentRow?.partenaire_conserne_ptba as Acteur[]).map(p => p.id_acteur)
        : [],

    code_activite_ptba: currentRow?.code_activite_ptba || "",
    intitule_activite_ptba: currentRow?.intitule_activite_ptba || "",

    chronogramme: currentRow?.chronogramme || "",
    observation: currentRow?.observation || "",

    code_crp: currentRow?.code_crp || "",

    cadre_analytique:
      (currentRow?.cadre_analytique as CadreAnalytique)?.code_ca || "",

    responsable_ptba: currentRow?.responsable_ptba || undefined,

    direction_ptba:
      typeof currentRow?.direction_ptba === "object"
        ? (currentRow?.direction_ptba as PlanSite)?.code_ds
        : "",

    version_ptba: Number(versionPtbaSelect),

    code_programme: currentRow?.code_programme || codeProgramme,

    statut_activite: currentRow?.statut_activite || "En construction",

    type_activite: currentRow?.type_activite || '',
  }
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: PtbaFormData) =>
      isEdit && currentRow?.id_ptba
        ? ptbaService.update(currentRow.id_ptba, data)
        : ptbaService.create(data),

    onSuccess: async () => {
      toast.success(
        isEdit
          ? "Activité modifiée avec succès"
          : "Activité créée avec succès"
      )
      await queryClient.invalidateQueries({
      queryKey: ["ptba-activites-all"],
    })
      onOpenChange(false)
    },

    onError: () => {
      toast.error(
        isEdit
          ? "Erreur lors de la modification"
          : "Erreur lors de la création"
      )
    },
  })

  const onSubmit = (data: PtbaFormData) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_SIZES.xl}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier une Activité" : "Ajouter une Activité"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modification de l'activité existante"
              : "Création d'une nouvelle activité"}
          </DialogDescription>
        </DialogHeader>

        <StepDynamicForm
          config={formConfig}
          schema={ptbaSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isLoading={mutation.isPending}
          submitText={isEdit ? "Modifier" : "Ajouter"}
          loadingText={isEdit ? "Modification..." : "Ajout en cours..."}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddPtba