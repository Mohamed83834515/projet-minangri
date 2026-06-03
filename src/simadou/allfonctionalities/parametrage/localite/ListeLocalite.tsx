// simadou/allfonctionalities/parametrage/localite/ListeLocalite.tsx
import { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GenericTable } from '@/Global/Generic/Generictable'
import { GenericDialogs } from '@/Global/Generic/Genericdialogs'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import useDialogState from '@/hooks/use-dialog-state'
import { useGetLocalitesByNiveau } from '@/simadou/allHooks/admin/localiteHooks'
import { buildLocaliteColumns } from '@/simadou/allColonnes/localite-columns'
import { useGetNiveauxLocalite } from '@/simadou/allHooks/admin/niveauLocaliteHooks'

    export default function ListeLocalite() {
    const { data: niveaux = [] } = useGetNiveauxLocalite()
    const [activeNiveau, setActiveNiveau] = useState<string>('0')
    const [searchTerm, setSearchTerm] = useState('')
    const { search, navigate } = useEmbeddedTableState()
    const [open, setOpen] = useDialogState<'add'>(null)

    const currentNiveauId = parseInt(activeNiveau)
    const { data: niveauData, refetch } = useGetLocalitesByNiveau(currentNiveauId)
    const localites: any[] = (niveauData as any)?.localites || []
    console.log('Localités récupérées pour le niveau', currentNiveauId, ':', localites) // Debug: Afficher les localités récupérées
    const currentNiveauObj = niveaux.find((n: any) => n.id_nlc === currentNiveauId)

    // Filtrer les localités par recherche
    const filteredLocalites = localites.filter(
        (loc) =>
            loc.intitule_loca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.code_national_loca?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Colonnes dynamiques basées sur le niveau actuel
    const columns = useMemo(
        () => buildLocaliteColumns(niveaux, currentNiveauObj?.nombre_nlc || 0),
        [niveaux, currentNiveauObj?.nombre_nlc]
    )

    const handleTabChange = (value: string) => {
        setActiveNiveau(value)
        setSearchTerm('')
        refetch()
    }

    // ListeLocalite.tsx
    const handleAdd = () => {
        console.log('handleAdd called', currentNiveauId) // Debug
        setOpen('add')
    }
    const handleSuccess = () => {
        refetch()
        setOpen(null)
    }

    // Si aucun niveau n'existe
    if (niveaux.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucun niveau de localité configuré. Cliquez sur "Configuration Niveaux" pour en créer.
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {/* Barre avec onglets, recherche et bouton ajouter */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Tabs value={activeNiveau} onValueChange={handleTabChange}>
                        <TabsList>
                            {niveaux.map((niveau: any) => (
                                <TabsTrigger key={niveau.id_nlc} value={niveau.id_nlc.toString()}>
                                    {niveau.libelle_nlc}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <div className="flex gap-2">
                        {/* Filtre de recherche externe */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={`Rechercher ${currentNiveauObj?.libelle_nlc?.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-64"
                            />
                        </div>

                        {/* Bouton Ajouter */}
                        <Button onClick={handleAdd}>
                            Ajouter {currentNiveauObj?.libelle_nlc}
                        </Button>
                    </div>
                </div>

                {/* Tableau */}
                <Tabs value={activeNiveau} onValueChange={handleTabChange}>
                    {niveaux.map((niveau: any) => (
                        <TabsContent key={niveau.id_nlc} value={niveau.id_nlc.toString()}>
                            <GenericTable
                                data={filteredLocalites}
                                columns={columns}
                                search={search}
                                navigate={navigate}
                                showSearch={false}
                                showPagination={true}
                                showViewOptions={false}
                                defaultPageSize={10}
                                emptyMessage={`Aucune ${niveau.libelle_nlc?.toLowerCase()} trouvée`}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Dialogue d'ajout */}
            {/* <GenericDialogs
                open={open}
                setOpen={setOpen}
                currentRow={null}
                setCurrentRow={() => { }}
                rowRequiredDialogs={[]}
                
            /> */}
        </>
    )
}