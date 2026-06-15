import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { GenericTable } from '@/Global/Generic/Generictable'
import { useActiveProgrammeCode } from '@/hooks/use-active-programme'
import type { Ptba } from '@/simadou/allTypes'
import { buildRapportDecaissementColumns } from '@/simadou/allColonnes/rapport-decaissement-columns'
import { useGetPtbas } from '@/simadou/allHooks/admin/ptbaHooks'
import { usePtbaVersionSelection } from '@/simadou/allHooks/admin/versionHooks'
import { useGeneralParamsQuery } from '@/simadou/allHooks/generalParams/queries'
import { PtbaVersionSelect } from '@/simadou/allfonctionalities/ptba/PtbaVersionSelect'
import {
  EMPTY_PTBA_LIST,
  RAPPORT_PTBA_TABLE_INITIAL_STATE,
  RAPPORT_PTBA_URL_FILTER_CONFIG,
  buildPlaceholderDecaissementMap,
  filterPtbasByVersion,
} from '@/simadou/allfonctionalities/rapport/rapportTableUtils'

const route = getRouteApi('/_authenticated/rapport/decaissement/')

export default function ListeRapportDecaissement() {
  const codeProgramme = useActiveProgrammeCode()
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { selectedVersionId, handleChangeVersion, versionOptions } =
    usePtbaVersionSelection(codeProgramme)

  const { data: ptbas } = useGetPtbas()
  const { data: config } = useGeneralParamsQuery()
  const currencyCode = config?.currencyCode
  const ptbaList = ptbas ?? EMPTY_PTBA_LIST

  const filteredPtbas = useMemo(
    () => filterPtbasByVersion(ptbaList, selectedVersionId),
    [ptbaList, selectedVersionId]
  )

  const decaissementByActivite = useMemo(
    () => buildPlaceholderDecaissementMap(filteredPtbas),
    [filteredPtbas]
  )

  const columns = useMemo(
    () =>
      buildRapportDecaissementColumns({
        decaissementByActivite,
        currencyCode,
      }),
    [decaissementByActivite, currencyCode]
  )

  return (
    <GenericTable<Ptba>
      data={filteredPtbas}
      columns={columns}
      search={search}
      navigate={navigate}
      searchKey='intitule_activite_ptba'
      searchPlaceholder='Filtrer les activités...'
      urlFilterConfig={RAPPORT_PTBA_URL_FILTER_CONFIG}
      toolbarEndSlot={
        <PtbaVersionSelect
          options={versionOptions}
          value={selectedVersionId}
          onChange={handleChangeVersion}
        />
      }
      showViewOptions={false}
      initialState={RAPPORT_PTBA_TABLE_INITIAL_STATE}
    />
  )
}
