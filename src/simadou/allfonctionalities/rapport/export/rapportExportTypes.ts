export type ExportFormat = 'word' | 'excel' | 'pdf'

export type RapportExportColumn = {
  id: string
  header: string
  width?: number
}

export type RapportExportTableData = {
  columns: RapportExportColumn[]
  rows: string[][]
  rowMetas?: RapportExportRowMeta[]
  visibleColumnIds?: string[]
}

export type RapportExportRegistration = {
  buildExportTable: () => RapportExportTableData
  isLoading?: boolean
}

/** Payload résolu au moment du clic sur Exporter. */
export type RapportExportPayload = {
  pageTitle: string
  columns: RapportExportColumn[]
  rows: string[][]
  rowMetas: RapportExportRowMeta[]
  visibleColumnIds?: string[]
  isLoading?: boolean
}

export type RapportExportDocumentMeta = {
  title: string
  subtitle: string
  filenameSlug: string
}

export type RapportExportRowMeta = {
  type: 'section' | 'data'
  niveau?: number // profondeur pour l'indentation
  label?: string
  groupKey?: string
}
