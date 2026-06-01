import { useState } from "react"

import { Button } from "@/components/ui/button"

import { DynamicForm } from "@/Global/Forms/DynamicForm"

import { getVersionPtbaFormConfig } from "@/simadou/allfieldsConfig/versionPtbaForm"

import { useSaveVersion } from "@/simadou/allHooks/admin/versionHooks"
import { versionPtbaSchema } from "@/simadou/schemas/ptbaSchemas"
import { VersionPtba } from "@/simadou/allTypes"
import { useActiveProgrammeCode } from "@/hooks/use-active-programme"

type Props = {
    currentRow?: VersionPtba | null
    onBack: () => void
    onSuccess: () => void
    onCancel: () => void
}

export default function AddVersionPtba({
    currentRow,
    onBack,
    onSuccess,
    onCancel,
}: Props) {
    const isEdit = !!currentRow

    const formConfig =
        getVersionPtbaFormConfig()

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null)


    const codeProgramme = useActiveProgrammeCode()

    const defaultValues = {
        annee_ptba:
            currentRow?.annee_ptba ||
            new Date().getFullYear(),

        version_ptba:
            currentRow?.version_ptba || "",

        date_validation:
            currentRow?.date_validation ||
            new Date()
                .toISOString()
                .split("T")[0],

        observation:
            currentRow?.observation || "",

        documentUrl:
            currentRow?.documentUrl || "",

        statut_version:
            currentRow?.statut_version || 0,

        programme:
            currentRow?.programme || codeProgramme || "",

        id_personnel: currentRow?.id_personnel || 16,

        etat: currentRow?.id_version_ptba ? "Modifiée" : "Créée",

    }


    const mutation = useSaveVersion(isEdit, currentRow, onSuccess)

    const handleSubmit = (data: any) => {
        mutation.mutate({
            data,
            file: selectedFile || undefined,
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={onBack}
                >
                    ← Retour
                </Button>

                <Button
                    variant="ghost"
                    onClick={onCancel}
                >
                    Annuler
                </Button>
            </div>

            <DynamicForm
                config={formConfig}
                schema={versionPtbaSchema}
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                isLoading={mutation.isPending}
                submitText={
                    isEdit
                        ? "Modifier"
                        : "Ajouter"
                }
                loadingText="Enregistrement..."
                onFieldChange={(
                    fieldName,
                    value
                ) => {
                    if (
                        fieldName === "documentUrl"
                    ) {
                        if (value instanceof File) {
                            setSelectedFile(value)
                        }
                    }
                }}
            />
        </div>
    )
}