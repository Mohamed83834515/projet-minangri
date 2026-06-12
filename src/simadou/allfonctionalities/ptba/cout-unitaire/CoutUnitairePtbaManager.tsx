import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { getApiErrorMessage } from '@/lib/api-error-message'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CoutUnitairePtba, Ptba } from '@/simadou/allTypes'
import {
  coutUnitairePtbaQueryKeys,
  useCreateCoutUnitairePtba,
  useDeleteCoutUnitairePtba,
  useGetCoutsUnitairesByActivite,
  useUpdateCoutUnitairePtba,
} from '@/simadou/allHooks/admin/coutUnitairePtbaHooks'
import { useGetPersonnels } from '@/simadou/allHooks/admin/personnelHooks'
import { useMe } from '@/simadou/allHooks/auth/authHooks'
import {
  buildCoutUnitairePtbaPayload,
} from '@/simadou/lib/coutUnitairePtbaUtils'
import { resolveRelationId } from '@/simadou/lib/resolveApiRelation'

type CoutUnitaireRow = {
  id?: number
  prix_unitaire: string
  quantite_cu: string
  unite_cu: string
  intitule_tache: string
  ordre: number
  annee: number
  id_personnel: number
  etat: boolean
  isNew: boolean
}

function toRow(item: CoutUnitairePtba): CoutUnitaireRow {
  const personnelId =
    resolveRelationId(item.id_personnel, 'n_personnel') ??
    resolveRelationId(item.id_personnel, 'id_personnel') ??
    0

  return {
    id: item.id_cout_unitaire,
    prix_unitaire: String(item.prix_unitaire ?? ''),
    quantite_cu: String(item.quantite_cu ?? ''),
    unite_cu: item.unite_cu ?? '',
    intitule_tache: item.intitule_tache ?? '',
    ordre: Number(item.ordre) || 0,
    annee: Number(item.annee) || new Date().getFullYear(),
    id_personnel: personnelId,
    etat: item.etat ?? true,
    isNew: false,
  }
}

function createEmptyRow(defaultPersonnelId?: number): CoutUnitaireRow {
  return {
    prix_unitaire: '',
    quantite_cu: '',
    unite_cu: '',
    intitule_tache: '',
    ordre: 0,
    annee: new Date().getFullYear(),
    id_personnel: defaultPersonnelId ?? 0,
    etat: true,
    isNew: true,
  }
}

function rowHasData(row: CoutUnitaireRow): boolean {
  return (
    !!row.intitule_tache.trim() ||
    !!row.prix_unitaire.trim() ||
    !!row.quantite_cu.trim() ||
    !!row.unite_cu.trim()
  )
}

function syncRowsFromItems(
  items: CoutUnitairePtba[],
  defaultPersonnelId?: number
): CoutUnitaireRow[] {
  return items.length === 0
    ? []
    : [...items.map(toRow), createEmptyRow(defaultPersonnelId)]
}

type CoutUnitairePtbaManagerProps = {
  activite: Ptba
}

export default function CoutUnitairePtbaManager({
  activite,
}: CoutUnitairePtbaManagerProps) {
  const queryClient = useQueryClient()
  const idActivite = activite.id_ptba
  const { data: user } = useMe()
  const modifierPar = user?.n_personnel ?? 0

  const {
    data: coutsUnitaires = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetCoutsUnitairesByActivite(idActivite)
  const { data: personnels = [] } = useGetPersonnels()
  const createMutation = useCreateCoutUnitairePtba(idActivite)
  const updateMutation = useUpdateCoutUnitairePtba(idActivite)
  const deleteMutation = useDeleteCoutUnitairePtba(idActivite)

  const [rows, setRows] = useState<CoutUnitaireRow[]>([])
  const [initialized, setInitialized] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialized || isLoading || isFetching) return
    setRows(syncRowsFromItems(coutsUnitaires, modifierPar))
    setInitialized(true)
  }, [initialized, isLoading, isFetching, coutsUnitaires, modifierPar])

  const refreshRows = async () => {
    await Promise.all([
      refetch(),
      queryClient.refetchQueries({
        queryKey: coutUnitairePtbaQueryKeys.byActivite(idActivite),
      }),
    ])
  }

  const updateRow = (index: number, patch: Partial<CoutUnitaireRow>) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    )
  }

  const onAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow(modifierPar)])
  }

  const onRemoveRow = async (index: number) => {
    const row = rows[index]
    if (!row) return

    if (row.id != null) {
      const ok = window.confirm('Supprimer ce coût unitaire ?')
      if (!ok) return
      try {
        await deleteMutation.mutateAsync(row.id)
        setInitialized(false)
        await refreshRows()
        toast.success('Coût unitaire supprimé')
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, 'Erreur lors de la suppression')
        )
      }
      return
    }

    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const onSave = async () => {
    const rowsToSave = rows.filter(rowHasData)
    if (rowsToSave.length === 0) {
      toast.error('Renseignez au moins une ligne de coût unitaire')
      return
    }

    for (const row of rowsToSave) {
      if (!row.intitule_tache.trim()) {
        toast.error("L'intitulé de la tâche est requis sur chaque ligne")
        return
      }
      if (!row.prix_unitaire.trim()) {
        toast.error('Le prix unitaire est requis sur chaque ligne')
        return
      }
      if (!row.quantite_cu.trim()) {
        toast.error('La quantité est requise sur chaque ligne')
        return
      }
      if (!row.unite_cu.trim()) {
        toast.error("L'unité est requise sur chaque ligne")
        return
      }
      if (!row.id_personnel) {
        toast.error('Le personnel est requis sur chaque ligne')
        return
      }
    }

    if (!modifierPar) {
      toast.error('Utilisateur non identifié')
      return
    }

    setIsSaving(true)
    try {
      for (const row of rowsToSave) {
        const payload = buildCoutUnitairePtbaPayload(
          {
            prix_unitaire: row.prix_unitaire,
            quantite_cu: row.quantite_cu,
            unite_cu: row.unite_cu,
            intitule_tache: row.intitule_tache,
            ordre: row.ordre,
            annee: row.annee,
            id_personnel: row.id_personnel,
            etat: row.etat,
          },
          idActivite,
          modifierPar
        )

        if (row.isNew) {
          await createMutation.mutateAsync(payload)
        } else if (row.id != null) {
          await updateMutation.mutateAsync({ id: row.id, data: payload })
        }
      }
      toast.success('Coûts unitaires enregistrés')
      setInitialized(false)
      await refreshRows()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la sauvegarde'))
    } finally {
      setIsSaving(false)
    }
  }

  if ((isLoading || isFetching) && !initialized) {
    return (
      <div className='py-6 text-sm text-muted-foreground'>Chargement…</div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-muted-foreground'>
          Saisissez les coûts unitaires directement dans le tableau.
        </p>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Button
            type='button'
            variant='outline'
            onClick={onAddRow}
            disabled={isSaving}
          >
            <Plus className='h-4 w-4' />
            Ajouter une ligne
          </Button>
          <Button type='button' onClick={onSave} disabled={isSaving}>
            <Save className='h-4 w-4' />
            {isSaving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      <div className='overflow-x-auto rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='min-w-48'>Intitulé tâche</TableHead>
              <TableHead className='min-w-28'>Prix unitaire</TableHead>
              <TableHead className='min-w-28'>Quantité</TableHead>
              <TableHead className='min-w-24'>Unité</TableHead>
              <TableHead className='w-20'>Ordre</TableHead>
              <TableHead className='w-24'>Année</TableHead>
              <TableHead className='min-w-40'>Personnel</TableHead>
              <TableHead className='w-16 text-center'>État</TableHead>
              <TableHead className='w-16 text-end'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id ?? `new-${index}`}>
                <TableCell className='align-top'>
                  <Input
                    placeholder='Intitulé'
                    value={row.intitule_tache}
                    onChange={(e) =>
                      updateRow(index, { intitule_tache: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className='align-top'>
                  <Input
                    type='text'
                    inputMode='decimal'
                    placeholder='0'
                    value={row.prix_unitaire}
                    onChange={(e) =>
                      updateRow(index, { prix_unitaire: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className='align-top'>
                  <Input
                    type='text'
                    inputMode='decimal'
                    placeholder='0'
                    value={row.quantite_cu}
                    onChange={(e) =>
                      updateRow(index, { quantite_cu: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className='align-top'>
                  <Input
                    placeholder='Unité'
                    value={row.unite_cu}
                    onChange={(e) =>
                      updateRow(index, { unite_cu: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className='align-top'>
                  <Input
                    type='number'
                    value={row.ordre}
                    onChange={(e) =>
                      updateRow(index, {
                        ordre: Number(e.target.value) || 0,
                      })
                    }
                  />
                </TableCell>
                <TableCell className='align-top'>
                  <Input
                    type='number'
                    value={row.annee}
                    onChange={(e) =>
                      updateRow(index, {
                        annee: Number(e.target.value) || new Date().getFullYear(),
                      })
                    }
                  />
                </TableCell>
                <TableCell className='align-top'>
                  <Select
                    value={row.id_personnel ? String(row.id_personnel) : undefined}
                    onValueChange={(value) =>
                      updateRow(index, { id_personnel: Number(value) })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Personnel' />
                    </SelectTrigger>
                    <SelectContent>
                      {personnels.map((p) => (
                        <SelectItem
                          key={p.n_personnel}
                          value={String(p.n_personnel)}
                        >
                          {`${p.prenom_perso ?? ''} ${p.nom_perso ?? ''}`.trim() ||
                            `Personnel ${p.n_personnel}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className='align-middle'>
                  <div className='flex justify-center'>
                    <Switch
                      checked={row.etat}
                      onCheckedChange={(checked) =>
                        updateRow(index, { etat: checked })
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className='text-end align-top'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    disabled={isSaving}
                    onClick={() => onRemoveRow(index)}
                    title='Supprimer la ligne'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
