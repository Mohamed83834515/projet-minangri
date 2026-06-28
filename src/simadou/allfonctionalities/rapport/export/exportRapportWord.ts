import {
  AlignmentType,
  BorderStyle,
  Document,
  HeightRule,
  PageOrientation,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TableLayoutType,
  TextRun,
  VerticalAlignTable,
  VerticalMergeType,
  WidthType,
} from 'docx'
import {
  computeWordColumnWidthsDxa,
  WORD_LANDSCAPE_CONTENT_WIDTH,
} from './rapportExportLayout'
import { RAPPORT_EXPORT_THEME as theme } from './rapportExportTheme'
import type {
  RapportExportColumn,
  RapportExportPayload,
  RapportExportRowMeta,
} from './rapportExportTypes'
import {
  buildExportFilename,
  buildRapportDocumentMeta,
  detectAlignment,
  downloadBlob,
  filterExportRows,
} from './rapportExportUtils'

const PAGE_MARGIN = 720
const FONT_TITLE = 32
const FONT_SUBTITLE = 20
const FONT_HEADER = 22
const FONT_BODY = 20

function noBorder() {
  return {
    top: { style: BorderStyle.NONE, size: 0, color: theme.white },
    bottom: { style: BorderStyle.NONE, size: 0, color: theme.white },
    left: { style: BorderStyle.NONE, size: 0, color: theme.white },
    right: { style: BorderStyle.NONE, size: 0, color: theme.white },
  }
}

function dataCellBorders(isHeader = false) {
  const color = isHeader ? theme.greenDark : theme.border
  const size = isHeader ? 4 : 1

  return {
    top: { style: BorderStyle.SINGLE, size, color },
    bottom: { style: BorderStyle.SINGLE, size, color },
    left: { style: BorderStyle.SINGLE, size, color },
    right: { style: BorderStyle.SINGLE, size, color },
  }
}

function toDocxAlignment(align: 'left' | 'center' | 'right') {
  if (align === 'center') return AlignmentType.CENTER
  if (align === 'right') return AlignmentType.RIGHT
  return AlignmentType.LEFT
}

function cellParagraph(
  text: string,
  options: {
    align?: 'left' | 'center' | 'right'
    bold?: boolean
    color?: string
    size?: number
  } = {}
) {
  const align = options.align ? options.align : detectAlignment(text)
  return new Paragraph({
    alignment: toDocxAlignment(align),
    spacing: { before: 40, after: 40, line: 260 },
    children: [
      new TextRun({
        text,
        bold: options.bold,
        color: options.color ?? theme.text,
        size: options.size ?? FONT_BODY,
        font: 'Calibri',
      }),
    ],
  })
}

function bannerCell(
  children: Paragraph[],
  fill: string,
  options: { height?: number; borders?: ReturnType<typeof noBorder> } = {}
) {
  return new TableCell({
    shading: { fill, type: ShadingType.CLEAR, color: 'auto' },
    borders: options.borders ?? noBorder(),
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    verticalAlign: VerticalAlignTable.CENTER,
    children,
  })
}

function buildBannerTable(title: string, subtitle: string) {
  return new Table({
    width: { size: WORD_LANDSCAPE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [WORD_LANDSCAPE_CONTENT_WIDTH],
    layout: TableLayoutType.FIXED,
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          bannerCell(
            [
              cellParagraph(title, {
                bold: true,
                color: theme.white,
                size: FONT_TITLE,
                align: 'center',
              }),
            ],
            theme.green
          ),
        ],
      }),
      new TableRow({
        children: [
          bannerCell(
            [
              cellParagraph(subtitle, {
                color: theme.textMuted,
                size: FONT_SUBTITLE,
                align: 'center',
              }),
            ],
            theme.greenLight
          ),
        ],
      }),
      new TableRow({
        height: { value: 100, rule: HeightRule.EXACT },
        children: [
          bannerCell(
            [cellParagraph('', { size: 2, align: 'center' })],
            theme.yellow,
            {
              height: 100,
            }
          ),
        ],
      }),
    ],
  })
}

function headerCell(text: string, width: number) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: theme.green, type: ShadingType.CLEAR, color: 'auto' },
    borders: dataCellBorders(true),
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    verticalAlign: VerticalAlignTable.CENTER,
    children: [
      cellParagraph(text, {
        bold: true,
        color: theme.white,
        size: FONT_HEADER,
      }),
    ],
  })
}

function bodyCell(text: string, width: number, shaded: boolean) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: {
      fill: shaded ? theme.greenMuted : theme.white,
      type: ShadingType.CLEAR,
      color: 'auto',
    },
    borders: dataCellBorders(false),
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    verticalAlign: VerticalAlignTable.CENTER,
    children: [
      cellParagraph(text, {
        size: FONT_BODY,
      }),
    ],
  })
}

function buildDataTable(
  columns: RapportExportColumn[],
  rows: string[][],
  columnWidths: number[],
  rowMetas?: RapportExportRowMeta[]
) {
  // GROUPING PTBA (comme PDF)
  const groupSpans = new Map<string | number, number>()
  const groupSeen = new Set<string | number>()

  rows.forEach((_, i) => {
    const meta = rowMetas?.[i]
    if (!meta || meta.type !== 'data') return
    if (!meta.groupKey) return

    groupSpans.set(meta.groupKey, (groupSpans.get(meta.groupKey) ?? 0) + 1)
  })

  return new Table({
    width: { size: WORD_LANDSCAPE_CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths,
    layout: TableLayoutType.FIXED,
    alignment: AlignmentType.CENTER,

    rows: [
      // HEADER
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: columns.map((c, i) =>
          headerCell(c.header, columnWidths[i] ?? 1800)
        ),
      }),

      // BODY
      ...rows.map((row, rowIndex) => {
        const meta = rowMetas?.[rowIndex]
        const shaded = rowIndex % 2 === 1

        // SECTION (CADRE ANALYTIQUE)
        if (meta?.type === 'section') {
          const startCol = meta.niveau ?? 0
          const colSpan = columns.length - startCol

          return new TableRow({
            children: Array.from({ length: columns.length }).map(
              (_, colIndex) => {
                // colonnes avant le niveau → vides invisibles
                if (colIndex < startCol) {
                  return new TableCell({
                    children: [new Paragraph('')],
                    borders: dataCellBorders(false),
                  })
                }

                // première cellule du bloc → fusion
                if (colIndex === startCol) {
                  return new TableCell({
                    columnSpan: colSpan,
                    shading: {
                      fill: theme.greenMuted,
                      type: ShadingType.CLEAR,
                      color: 'auto',
                    },
                    borders: dataCellBorders(false),
                    verticalAlign: VerticalAlignTable.CENTER,
                    children: [
                      cellParagraph(meta.label ?? '', {
                        bold: true,
                        align: 'left',
                        size: FONT_BODY,
                      }),
                    ],
                  })
                }

                // cellules couvertes par le span → ignorées
                return new TableCell({
                  children: [new Paragraph('')],
                  borders: noBorder(),
                })
              }
            ),
          })
        }

        // DATA ROW (PTBA GROUPING)

        if (meta?.type === 'data' && meta.groupKey != null) {
          const groupKey = meta.groupKey
          const isFirst = !groupSeen.has(groupKey)

          if (isFirst) {
            groupSeen.add(groupKey)

            return new TableRow({
              cantSplit: true,
              children: row.map((value, colIndex) => {
                const width = columnWidths[colIndex] ?? 1800

                // fusion Code + Activité
                if (colIndex === 0 || colIndex === 1) {
                  return new TableCell({
                    width: { size: width, type: WidthType.DXA },
                    verticalMerge: VerticalMergeType.RESTART,
                    shading: {
                      fill: shaded ? theme.greenMuted : theme.white,
                      type: ShadingType.CLEAR,
                      color: 'auto',
                    },
                    borders: dataCellBorders(false),
                    verticalAlign: VerticalAlignTable.CENTER,
                    children: [cellParagraph(value)],
                  })
                }

                return bodyCell(value, width, shaded)
              }),
            })
          }

          return new TableRow({
            cantSplit: true,
            children: row.map((value, colIndex) => {
              const width = columnWidths[colIndex] ?? 1800

              if (colIndex === 0 || colIndex === 1) {
                return new TableCell({
                  width: { size: width, type: WidthType.DXA },
                  verticalMerge: VerticalMergeType.CONTINUE,
                  shading: {
                    fill: shaded ? theme.greenMuted : theme.white,
                    type: ShadingType.CLEAR,
                    color: 'auto',
                  },
                  borders: dataCellBorders(false),
                  children: [new Paragraph('')],
                })
              }

              return bodyCell(value, width, shaded)
            }),
          })
        }

        // NORMAL ROW

        return new TableRow({
          cantSplit: true,
          children: row.map((value, colIndex) =>
            bodyCell(value, columnWidths[colIndex] ?? 1800, shaded)
          ),
        })
      }),
    ],
  })
}

export async function exportRapportWord(payload: RapportExportPayload) {
  const meta = buildRapportDocumentMeta(payload.pageTitle)

  const { columns, rows, rowMetas } = filterExportRows(
    payload.rows,
    payload.columns,
    payload.visibleColumnIds,
    payload.rowMetas
  )

  const columnWidths = computeWordColumnWidthsDxa(columns, rows)

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: FONT_BODY,
            color: theme.text,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: {
              top: PAGE_MARGIN,
              right: PAGE_MARGIN,
              bottom: PAGE_MARGIN,
              left: PAGE_MARGIN,
            },
          },
        },
        children: [
          buildBannerTable(meta.title, meta.subtitle),
          new Paragraph({
            spacing: { after: 160 },
            children: [],
          }),
          buildDataTable(columns, rows, columnWidths, rowMetas),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, buildExportFilename(meta.filenameSlug, 'docx'))
}
