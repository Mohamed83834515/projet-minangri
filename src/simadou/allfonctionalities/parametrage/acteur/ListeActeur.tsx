// simadou/allfonctionalities/parametrage/acteur/ListeActeur.tsx
import { useMemo, useState } from 'react'
import { GenericTable } from '@/Global/Generic/Generictable'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { Acteur } from '@/simadou/allTypes/acteur'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { useDeleteActeur, useGetActeurs } from '@/simadou/allHooks/admin/acteurHooks'
import { buildActeurColumns } from '@/simadou/allColonnes/acteur-columns'
import { GenericDialogs } from '@/Global/Generic/Genericdialogs'
import AddActeur from './AddActeur'

export function ListeActeur() {
  const { search, navigate } = useEmbeddedTableState()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<Acteur | null>(null)

  const columns = useMemo(
    () => buildActeurColumns(setOpen, setCurrentRow),
    [setOpen, setCurrentRow]
  )

  const deleteMutation = useDeleteActeur()
  const { data: acteurs = [] } = useGetActeurs()

  return (
    <>
      <div className='space-y-4'>
        <GenericTable
          data={acteurs}
          columns={columns}
          search={search}
          navigate={navigate}
          searchKey='nom_acteur'
          searchPlaceholder='Filtrer les acteurs...'
          urlFilterConfig={[
            {
              columnId: 'nom_acteur',
              searchKey: 'nom_acteur',
              type: 'string',
            },
          ]}
          defaultPageSize={10}
          showViewOptions={true}
          emptyMessage='Aucun acteur trouvé.'
        />
      </div>

      <GenericDialogs<Acteur, 'add' | 'edit' | 'delete'>
        open={open}
        setOpen={setOpen}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        rowRequiredDialogs={['edit', 'delete']}
        dialogMap={{
          add: (props) => (
            <AddActeur
              key='acteur-add'
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={null}
            />
          ),
          edit: (props) => (
            <AddActeur
              key={`acteur-edit-${currentRow?.id_acteur}`}
              open={props.open}
              onOpenChange={props.onOpenChange}
              currentRow={props.currentRow as Acteur}
            />
          ),
          delete: (props) => (
            <GenericDeleteDialog<Acteur>
              key={`acteur-delete-${currentRow?.id_acteur}`}
              {...props}
              currentRow={props.currentRow as Acteur}
              entityName="l'acteur"
              getEntityLabel={(row) => `${row.code_acteur} - ${row.nom_acteur}`}
              onDelete={(row) => deleteMutation.mutate(row.id_acteur)}
            />
          ),
        }}
      />
    </>
  )
}