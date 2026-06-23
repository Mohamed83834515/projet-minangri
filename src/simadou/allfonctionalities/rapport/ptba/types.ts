import type { Ptba, TacheActivitePtba, CoutUnitairePtba } from '@/simadou/allTypes'
import { IndicateurTache } from '@/simadou/allTypes/indicateurTache'

export interface RapportPtbaData {
  ptbas: Ptba[]
  taches: TacheActivitePtba[]
  indicateurs: IndicateurTache[]
  couts: CoutUnitairePtba[]
  currencyCode?:string
  isLoading: boolean
  selectedVersionId: string | null
  onVersionChange: (versionId: string) => void
  versionOptions: { value: string; label: string }[]
}

export interface TacheWithActivite extends TacheActivitePtba {
  code_activite?: string
  intitule_activite?: string
}

export interface IndicateurWithActivite extends IndicateurTache {
  code_activite?: string
  intitule_activite?: string
}

export interface CoutWithActivite extends CoutUnitairePtba {
  code_activite?: string
  intitule_activite?: string
}