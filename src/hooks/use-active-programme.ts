import { useProgrammeStore } from '@/stores/programme-store'

/** Programme actif (sélecteur principal). */
export function useActiveProgramme() {
  return useProgrammeStore((s) => s.activeProgramme)
}

/** Code du programme actif (ex. PTBA). */
export function useActiveProgrammeCode(): string | undefined {
  return useProgrammeStore((s) => s.activeProgramme?.code_programme)
}

/** Identifiant numérique du programme actif. */
export function useActiveProgrammeId(): number | undefined {
  return useProgrammeStore((s) => s.activeProgramme?.id_programme)
}
