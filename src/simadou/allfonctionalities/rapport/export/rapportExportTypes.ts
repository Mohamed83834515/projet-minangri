export type ExportFormat = 'word' | 'excel' | 'pdf'

export type RapportExportColumn = {
  id: string
  header: string
  width?: number
}

/**
 * Diagramme de Gantt exporté : une colonne par mois ajoutée à droite du
 * tableau, cellule colorée quand la tâche est active ce mois-là.
 */
export type RapportExportGantt = {
  /** Colonnes mensuelles (une par mois couvert par les tâches). */
  columns: RapportExportColumn[]
  /**
   * Indices (dans `columns`) des mois actifs, une entrée par ligne de
   * `rows` (tableau vide pour les sections et les lignes non datées).
   */
  activeByRow: number[][]
}

export type RapportExportTableData = {
  columns: RapportExportColumn[]
  rows: string[][]
  rowMetas?: RapportExportRowMeta[]
  visibleColumnIds?: string[]
  /** Colonnes mensuelles colorées du diagramme de Gantt. */
  gantt?: RapportExportGantt
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
  gantt?: RapportExportGantt
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
