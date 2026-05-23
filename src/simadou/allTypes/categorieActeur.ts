export interface CategorieActeur {
  id_categorie: number
  nom_categorie: string
  code_cat: string
}

export interface CategorieActeurFormProps {
  categorie: CategorieActeur
  setCategorie: (value: CategorieActeur) => void
  isEdit: boolean
  setIsEdit: (value: boolean) => void
  setShowForm: (value: boolean) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
