export interface ZoneCollecte {
  id_zone_collecte: number
  code_zone: string
  nom_zone: string
  type_zone: string
}

export interface ZoneCollecteFormProps {
  zoneCollecte: ZoneCollecte
  setZoneCollecte: (value: ZoneCollecte) => void
  isEdit: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
