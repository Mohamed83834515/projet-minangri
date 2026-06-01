import type { Ptba } from '@/simadou/allTypes'

export function activiteModalTitle(
  activite: Ptba | null,
  fallback: string
): string {
  if (!activite) return fallback
  return `${activite.code_activite_ptba}: ${activite.intitule_activite_ptba}`
}
