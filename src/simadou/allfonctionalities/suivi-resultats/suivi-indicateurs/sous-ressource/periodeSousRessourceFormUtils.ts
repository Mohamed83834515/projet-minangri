import type {
  DocumentationCmrEnregistrement,
  DocumentationCmrFormData,
  DocumentationCmrWritePayload,
  FondCarteEnregistrement,
  FondCarteFormData,
  FondCarteWritePayload,
  SimpleSousRessourceFormData,
  TableauSyntheseWritePayload,
} from '@/simadou/allTypes/periodeIndicateurSousRessource'
import { resolveDocumentList } from '@/simadou/lib/documentProjetUtils'

export function emptySimpleSousRessourceFormValues(): SimpleSousRessourceFormData {
  return { source_donnees: '', date_validation: '', observation: '' }
}

function emptyDocumentsFormValues() {
  return {
    documentFiles: [] as File[],
    existingDocuments: [] as string[],
  }
}

export function emptyDocumentationCmrFormValues(): DocumentationCmrFormData {
  return {
    source_donnees: '',
    titre: '',
    date_validation: '',
    observation: '',
    ...emptyDocumentsFormValues(),
  }
}

export function emptyFondCarteFormValues(): FondCarteFormData {
  return {
    source_donnees: '',
    date_validation: '',
    observation: '',
    ...emptyDocumentsFormValues(),
  }
}

export function simpleSousRessourceToFormValues(
  row?: { source_donnees?: string; date_validation?: string; observation?: string } | null
): SimpleSousRessourceFormData {
  return {
    source_donnees: row?.source_donnees ?? '',
    date_validation: row?.date_validation ?? '',
    observation: row?.observation ?? '',
  }
}

export function documentationCmrToFormValues(
  row?: DocumentationCmrEnregistrement | null
): DocumentationCmrFormData {
  return {
    source_donnees: row?.source_donnees ?? '',
    titre: row?.titre ?? '',
    date_validation: row?.date_validation ?? '',
    observation: row?.observation ?? '',
    documentFiles: [],
    existingDocuments: resolveDocumentList(row?.document),
  }
}

export function fondCarteToFormValues(
  row?: FondCarteEnregistrement | null
): FondCarteFormData {
  return {
    source_donnees: row?.source_donnees ?? '',
    date_validation: row?.date_validation ?? '',
    observation: row?.observation ?? '',
    documentFiles: [],
    existingDocuments: resolveDocumentList(row?.document),
  }
}

function buildBaseWritePayload({
  parentPeriodeId,
  personnelId,
  isEdit,
}: {
  parentPeriodeId: number
  personnelId: number
  isEdit: boolean
}) {
  return {
    etat: isEdit ? 'Modifier' : 'Ajouter',
    periode: parentPeriodeId,
    id_personnel: personnelId,
    modifier_par: personnelId,
  }
}

export function buildSimpleSousRessourceWritePayload({
  form,
  parentPeriodeId,
  personnelId,
  isEdit,
}: {
  form: SimpleSousRessourceFormData
  parentPeriodeId: number
  personnelId: number
  isEdit: boolean
}): TableauSyntheseWritePayload {
  return {
    ...buildBaseWritePayload({ parentPeriodeId, personnelId, isEdit }),
    source_donnees: form.source_donnees,
    date_validation: form.date_validation,
    observation: form.observation,
  }
}

export function buildFondCarteWritePayload({
  form,
  parentPeriodeId,
  personnelId,
  isEdit,
}: {
  form: FondCarteFormData
  parentPeriodeId: number
  personnelId: number
  isEdit: boolean
}): FondCarteWritePayload {
  return {
    ...buildBaseWritePayload({ parentPeriodeId, personnelId, isEdit }),
    source_donnees: form.source_donnees,
    date_validation: form.date_validation,
    observation: form.observation,
  }
}

export function buildDocumentationCmrWritePayload({
  form,
  parentPeriodeId,
  personnelId,
  isEdit,
}: {
  form: DocumentationCmrFormData
  parentPeriodeId: number
  personnelId: number
  isEdit: boolean
}): DocumentationCmrWritePayload {
  return {
    ...buildBaseWritePayload({ parentPeriodeId, personnelId, isEdit }),
    source_donnees: form.source_donnees,
    titre: form.titre,
    date_validation: form.date_validation,
    observation: form.observation,
  }
}

export function buildSousRessourceDocumentsFormData(
  payload: FondCarteWritePayload | DocumentationCmrWritePayload,
  {
    newFiles,
    existingDocuments,
  }: {
    newFiles: File[]
    existingDocuments: string[]
  }
): FormData {
  const fd = new FormData()
  fd.append('source_donnees', payload.source_donnees)
  fd.append('date_validation', payload.date_validation)
  fd.append('observation', payload.observation)
  fd.append('etat', payload.etat)
  fd.append('periode', String(payload.periode))
  fd.append('id_personnel', String(payload.id_personnel))
  fd.append('modifier_par', String(payload.modifier_par))

  if ('titre' in payload) {
    fd.append('titre', payload.titre)
  }

  for (const doc of existingDocuments) {
    fd.append('document', doc)
  }

  for (const file of newFiles) {
    fd.append('document', file, file.name)
  }

  return fd
}
