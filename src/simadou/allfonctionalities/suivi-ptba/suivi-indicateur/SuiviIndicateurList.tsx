import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { GenericRowActions } from '@/Global/Tableaux/GenericRowActions'
import useDialogState from '@/hooks/use-dialog-state'
import type { SuiviIndicateurActivite } from '@/simadou/allTypes'
import { useDeleteSuiviIndicateur } from '@/simadou/allHooks/admin/suiviPtbaHooks'

type SuiviIndicateurListProps = {
  suivis: SuiviIndicateurActivite[]
  onEdit: (suivi: SuiviIndicateurActivite) => void
}

function SuiviIndicateurRowActions({
  suivi,
  onEdit,
  onDeleteRequest,
}: {
  suivi: SuiviIndicateurActivite
  onEdit: (s: SuiviIndicateurActivite) => void
  onDeleteRequest: (s: SuiviIndicateurActivite) => void
}) {
  const row = { original: suivi } as Row<SuiviIndicateurActivite>

  return (
    <GenericRowActions
      row={row}
      actions={[
        {
          label: 'Modifier',
          icon: <Pencil size={16} />,
          onClick: onEdit,
        },
        {
          label: 'Supprimer',
          icon: <Trash2 size={16} />,
          onClick: onDeleteRequest,
          className: 'text-red-500!',
          separator: true,
        },
      ]}
    />
  )
}

export default function SuiviIndicateurList({
  suivis,
  onEdit,
}: SuiviIndicateurListProps) {
  const [open, setOpen] = useDialogState<'delete'>(null)
  const [currentRow, setCurrentRow] = useState<SuiviIndicateurActivite | null>(
    null
  )

  const deleteMutation = useDeleteSuiviIndicateur()

  const handleDeleteRequest = (suivi: SuiviIndicateurActivite) => {
    setCurrentRow(suivi)
    setOpen('delete')
  }

  const handleConfirmDelete = (suivi: SuiviIndicateurActivite) => {
    deleteMutation.mutate(suivi.id_suivi_indicateur, {
      onSuccess: () => toast.success('Suivi supprimé'),
      onError: () => toast.error('Erreur lors de la suppression'),
    })
  }

  if (suivis.length === 0) {
    return (
      <p className='py-4 text-center text-sm text-muted-foreground'>
        Aucun suivi enregistré
      </p>
    )
  }

  return (
    <>
      <div className='overflow-x-auto rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Localité</TableHead>
              <TableHead>Date suivi</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead className='w-[70px] text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suivis.map((suivi) => (
              <TableRow key={suivi.id_suivi_indicateur}>
                <TableCell>
                  {typeof suivi.localite === 'object'
                    ? suivi.localite?.intitule_loca
                    : suivi.localite || 'N/A'}
                </TableCell>
                <TableCell>
                  {new Date(suivi.date_suivi_indicateur).toLocaleDateString(
                    'fr-FR'
                  )}
                </TableCell>
                <TableCell className='font-semibold'>
                  {suivi.valeur_suivi_indicateur}
                </TableCell>
                <TableCell className='text-center'>
                  <SuiviIndicateurRowActions
                    suivi={suivi}
                    onEdit={onEdit}
                    onDeleteRequest={handleDeleteRequest}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {currentRow && (
        <GenericDeleteDialog<SuiviIndicateurActivite>
          open={open === 'delete'}
          onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
          currentRow={currentRow}
          entityName='suivi indicateur'
          getEntityLabel={(row) =>
            String(row.valeur_suivi_indicateur ?? row.id_suivi_indicateur)
          }
          onDelete={handleConfirmDelete}
        />
      )}
    </>
  )
}
