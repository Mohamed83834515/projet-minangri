import { useCallback, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"

import { GenericDialogs } from "@/Global/Generic/Genericdialogs"
import { GenericDeleteDialog } from "@/Global/Tableaux/GenericDeleteDialog"

import useDialogState from "@/hooks/use-dialog-state"
import { useEmbeddedTableState } from "@/hooks/use-embedded-table-state"

import { useGetVersions, useDeleteVersion, useValiderVersion, useArchiverVersion } from "@/simadou/allHooks/admin/versionHooks"
import { buildVersionPtbaColumns } from "@/simadou/allColonnes/versions-columns"
import { GenericTable } from "@/Global/Generic/Generictable"
import { VersionPtba } from "@/simadou/allTypes"
import { DataTableToolbarOutlineButton } from "@/components/data-table/toolbar-outline-button"

type Props = {
    onAdd: () => void
    onEdit: (row: VersionPtba) => void
}

export default function ListeVersionPtba({
    onAdd,
    onEdit,
}: Props) {
    const { data = [] } = useGetVersions()

    const [open, setOpen] = useDialogState<
        "delete"
    >(null)

    const [currentRow, setCurrentRow] =
        useState<VersionPtba | null>(null)

    const { search, navigate } =
        useEmbeddedTableState()

    const deleteMutation =
        useDeleteVersion()

    const validateMutation =
        useValiderVersion()

    const archiveMutation =
        useArchiverVersion()

    const handleEdit = useCallback(
        (row: VersionPtba) => {
            setCurrentRow(row)
            onEdit(row)
        },
        [onEdit]
    )

    const columns = useMemo(
        () =>
            buildVersionPtbaColumns({
                setOpen,
                setCurrentRow,
                onEdit: handleEdit,
                onValidate: (row) =>
                    validateMutation.mutate(
                        row.id_version_ptba
                    ),
                onArchive: (row) =>
                    archiveMutation.mutate(
                        row.id_version_ptba
                    ),
            }),
        [
            handleEdit,
            validateMutation,
            archiveMutation,
        ]
    )

    return (
        <>

            <GenericTable
                data={data}
                columns={columns}
                search={search}
                showSearch={false}
                navigate={navigate}
                showPagination={false}
                showViewOptions={false}
                toolbarEndSlot={
                    <DataTableToolbarOutlineButton
                        className='ms-auto'
                        onClick={onAdd}
                    >
                        Ajouter
                    </DataTableToolbarOutlineButton>
                }
            />
            <GenericDialogs
                open={open}
                setOpen={setOpen}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                rowRequiredDialogs={["delete"]}
                dialogMap={{
                    delete: (props) => (
                        <GenericDeleteDialog
                            {...props}
                            entityName="version PTBA"
                            currentRow={props.currentRow}
                            getEntityLabel={(row: any) =>
                                row.version_ptba
                            }
                            onDelete={(row) => {
                                deleteMutation.mutate(
                                    row?.id_version_ptba || 0
                                )

                                setOpen(null)
                                setCurrentRow(null)
                            }}
                        />
                    ),
                }}
            />
        </>
    )
}