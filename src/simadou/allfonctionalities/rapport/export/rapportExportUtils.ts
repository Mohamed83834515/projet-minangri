import type {
  RapportExportColumn,
  RapportExportDocumentMeta,
  RapportExportHeaderGroup,
  RapportExportRowMeta,
} from './rapportExportTypes'

export function slugifyRapportTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildRapportDocumentMeta(
  pageTitle: string
): RapportExportDocumentMeta {
  const generatedAt = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return {
    title: pageTitle.startsWith('Rapport')
      ? pageTitle
      : `Rapport — ${pageTitle}`,
    subtitle: `Généré le ${generatedAt}`,
    filenameSlug: slugifyRapportTitle(pageTitle),
  }
}

export function filterExportRows(
  rows: string[][],
  columns: RapportExportColumn[],
  visibleColumnIds?: string[],
  rowMetas?: RapportExportRowMeta[]
): {
  columns: RapportExportColumn[]
  rows: string[][]
  rowMetas?: RapportExportRowMeta[]
} {
  if (!visibleColumnIds?.length || visibleColumnIds.length === columns.length) {
    return {
      columns,
      rows,
      rowMetas,
    }
  }

  const visible = new Set(visibleColumnIds)

  const visibleColumns = columns.filter((column) => visible.has(column.id))

  const indices = visibleColumns.map((column) =>
    columns.findIndex((source) => source.id === column.id)
  )

  return {
    columns: visibleColumns,
    rows: rows.map((row) => indices.map((index) => row[index] ?? '')),
    rowMetas,
  }
}

/** Plage d'indices de colonnes couverte par un en-tête fusionné. */
export type ResolvedHeaderGroupRange = {
  header: string
  /** Index de la première colonne couverte. */
  start: number
  /** Index de la dernière colonne couverte (inclus). */
  end: number
}

/**
 * Résout les groupes d'en-tête en plages d'indices sur les colonnes
 * effectivement exportées. Un groupe dont les colonnes ne sont plus
 * contiguës (ou plus visibles) après filtrage est ignoré.
 */
export function resolveHeaderGroupRanges(
  columns: RapportExportColumn[],
  headerGroups?: RapportExportHeaderGroup[]
): ResolvedHeaderGroupRange[] {
  if (!headerGroups?.length) return []

  const ranges: ResolvedHeaderGroupRange[] = []

  for (const group of headerGroups) {
    const ids = new Set(group.columnIds)
    const indices = columns
      .map((column, index) => (ids.has(column.id) ? index : -1))
      .filter((index) => index >= 0)

    if (indices.length === 0) continue

    const start = Math.min(...indices)
    const end = Math.max(...indices)
    if (end - start + 1 !== indices.length) continue

    ranges.push({ header: group.header, start, end })
  }

  return ranges.sort((a, b) => a.start - b.start)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function buildExportFilename(slug: string, extension: string): string {
  const date = new Date().toISOString().slice(0, 10)
  return `${slug}_${date}.${extension}`
}

export function detectAlignment(value: unknown): 'left' | 'center' {
  if (value == null) return 'left'

  // number réel
  if (typeof value === 'number' && !isNaN(value)) {
    return 'center'
  }

  // string numérique ("123", "12.5", "1 200")
  if (typeof value === 'string') {
    const normalized = value.replace(/\s/g, '').replace(',', '.')
    if (!isNaN(Number(normalized)) && normalized !== '') {
      return 'center'
    }
  }

  return 'left'
}
