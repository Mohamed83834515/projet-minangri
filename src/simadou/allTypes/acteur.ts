import { CategorieActeur } from "./categorieActeur"

export interface Acteur {
  id_acteur: number
  code_acteur: string
  nom_acteur: string
  description_acteur?: string
  personne_responsable: string
  contact: string
  adresse_email: string
  categorie_acteur: CategorieActeur | null
}

export interface ActeurFormProps {
  acteur: Acteur
  setActeur: (value: Acteur) => void
  isEdit: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export type ActeurFormData = Omit<Acteur, "id_acteur">;
