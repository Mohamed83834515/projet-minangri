import { useProjectStore } from '@/stores/projetct-store'

export function useActiveProgramme() {
  return useProjectStore((s) => s.activeProgramme)
}

export function useActiveProgrammeCode(): string | undefined {
  return useProjectStore((s) => s.activeProgramme?.code_programme)
}

export function useActiveProgrammeId(): number | undefined {
  return useProjectStore((s) => s.activeProgramme?.id_programme)
}

/** Alias de `useActiveProgramme` (nom historique du sélecteur « Projet »). */
export function useActiveProject() {
  return useActiveProgramme()
}
