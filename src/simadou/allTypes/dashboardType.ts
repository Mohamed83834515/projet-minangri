import { VersionPtba } from "./versionPtba"

export interface AvancementDirection {
  version_info: VersionPtba
  code_ugl: string
  abrege_ugl: string
  nom_ugl: string
  nb_ptbas: number
  taux_execution_moyen: number
}
