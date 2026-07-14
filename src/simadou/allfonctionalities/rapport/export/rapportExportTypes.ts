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

/**
 * En-tête fusionné au-dessus d'un groupe de colonnes contiguës
 * (ex. « Valeur Cible » au-dessus de T1–T4). Les colonnes hors groupe
 * sont fusionnées verticalement sur les deux lignes d'en-tête.
 */
export type RapportExportHeaderGroup = {
  header: string
  /** Ids des colonnes couvertes — elles doivent être contiguës. */
  columnIds: string[]
}

/**
 * Bloc de texte affiché avant le tableau (pages en portrait dans les
 * exports Word/PDF, feuille dédiée dans Excel).
 */
export type RapportExportPreambleBlock = {
  type: 'title' | 'heading' | 'paragraph' | 'list'
  text: string
}

export type RapportExportTableData = {
  columns: RapportExportColumn[]
  rows: string[][]
  rowMetas?: RapportExportRowMeta[]
  visibleColumnIds?: string[]
  /** Colonnes mensuelles colorées du diagramme de Gantt. */
  gantt?: RapportExportGantt
  /** En-têtes fusionnés au-dessus de groupes de colonnes. */
  headerGroups?: RapportExportHeaderGroup[]
  /** Texte affiché avant le tableau dans les exports. */
  preamble?: RapportExportPreambleBlock[]
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
  headerGroups?: RapportExportHeaderGroup[]
  preamble?: RapportExportPreambleBlock[]
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
