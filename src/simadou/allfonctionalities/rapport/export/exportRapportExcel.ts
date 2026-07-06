import ExcelJS from 'exceljs'
import { mergeGanttColumns } from './rapportExportGanttColumns'
import {
  estimateExcelColumnWidth,
  estimateExcelRowHeight,
  estimateSubtitleRowHeight,
} from './rapportExportLayout'
import { hexArgb, RAPPORT_EXPORT_THEME as theme } from './rapportExportTheme'
import type { RapportExportPayload } from './rapportExportTypes'
import {
  buildExportFilename,
  buildRapportDocumentMeta,
  detectAlignment,
  downloadBlob,
  filterExportRows,
} from './rapportExportUtils'

function applyHeaderStyle(cell: ExcelJS.Cell) {
  cell.font = { bold: true, color: { argb: hexArgb(theme.white) }, size: 11 }
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: hexArgb(theme.green) },
  }
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  cell.border = {
    top: { style: 'thin', color: { argb: hexArgb(theme.greenDark) } },
    bottom: { style: 'thin', color: { argb: hexArgb(theme.greenDark) } },
    left: { style: 'thin', color: { argb: hexArgb(theme.greenDark) } },
    right: { style: 'thin', color: { argb: hexArgb(theme.greenDark) } },
  }
}

function applyBodyStyle(cell: ExcelJS.Cell, shaded: boolean, value: unknown) {
  const horizontal = detectAlignment(value)

  cell.alignment = {
    vertical: 'middle',
    horizontal,
    wrapText: true,
  }
  cell.font = { size: 10, color: { argb: hexArgb(theme.text) } }
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: hexArgb(shaded ? theme.greenMuted : theme.white) },
  }
  cell.border = {
    top: { style: 'thin', color: { argb: hexArgb(theme.border) } },
    bottom: { style: 'thin', color: { argb: hexArgb(theme.border) } },
    left: { style: 'thin', color: { argb: hexArgb(theme.border) } },
    right: { style: 'thin', color: { argb: hexArgb(theme.border) } },
  }
}

/** Cellule Gantt active : remplissage plein, la couleur porte l'information. */
function applyGanttActiveStyle(cell: ExcelJS.Cell) {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: hexArgb(theme.green) },
  }
}

/** Largeur (en caractères) des colonnes mensuelles du Gantt. */
const GANTT_EXCEL_COLUMN_WIDTH = 8

export async function exportRapportExcel(payload: RapportExportPayload) {
  const meta = buildRapportDocumentMeta(payload.pageTitle)

  const filtered = filterExportRows(
    payload.rows,
    payload.columns,
    payload.visibleColumnIds,
    payload.rowMetas
  )

  const { columns, rows, ganttStartIndex, isGanttActive } = mergeGanttColumns(
    filtered.columns,
    filtered.rows,
    payload.gantt
  )
  const rowMetas = filtered.rowMetas

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Simandu'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Rapport', {
    views: [{ state: 'frozen', ySplit: 5 }],
  })

  const colCount = Math.max(columns.length, 1)
  sheet.mergeCells(1, 1, 1, colCount)
  sheet.mergeCells(2, 1, 2, colCount)
  sheet.mergeCells(3, 1, 3, colCount)

  const titleCell = sheet.getCell(1, 1)
  titleCell.value = meta.title
  titleCell.font = {
    bold: true,
    size: 18,
    color: { argb: hexArgb(theme.white) },
  }
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: hexArgb(theme.green) },
  }
  titleCell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  }
  sheet.getRow(1).height = 34

  const subtitleCell = sheet.getCell(2, 1)
  subtitleCell.value = meta.subtitle
  subtitleCell.font = { size: 10, color: { argb: hexArgb(theme.textMuted) } }
  subtitleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: hexArgb(theme.greenLight) },
  }
  subtitleCell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  }
  sheet.getRow(2).height = estimateSubtitleRowHeight(meta.subtitle, colCount)

  const stripeCell = sheet.getCell(3, 1)
  stripeCell.value = ''
  stripeCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: hexArgb(theme.yellow) },
  }
  sheet.getRow(3).height = 4

  const columnWidths = columns.map((column, index) => {
    if (index >= ganttStartIndex) return GANTT_EXCEL_COLUMN_WIDTH

    const values = rows.map((row) => row[index] ?? '')
    return estimateExcelColumnWidth(
      column.header,
      values,
      column.width ?? 16,
      52
    )
  })

  columnWidths.forEach((width, index) => {
    sheet.getColumn(index + 1).width = width
  })

  const headerRow = sheet.getRow(5)
  columns.forEach((column, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = column.header
    applyHeaderStyle(cell)
  })
  headerRow.height = 28

  // PRE-PASS : calcul des rowSpans par groupKey
  const groupSpans = new Map<string | number, number>()
  const groupSeen = new Set<string | number>()

  rows.forEach((_, i) => {
    const rowMeta = rowMetas?.[i]
    if (!rowMeta || rowMeta.type !== 'data') return
    if (!rowMeta.groupKey) return
    groupSpans.set(
      rowMeta.groupKey,
      (groupSpans.get(rowMeta.groupKey) ?? 0) + 1
    )
  })

  rows.forEach((row, rowIndex) => {
    const rowMeta = rowMetas?.[rowIndex]
    const excelRow = sheet.getRow(6 + rowIndex)
    const isAlt = rowIndex % 2 === 1

    // ── SECTION ROW (cadre analytique)
    if (rowMeta?.type === 'section') {
      const startCol = (rowMeta.niveau ?? 1) + 1
      const colCount = columns.length
      const rowNumber = 6 + rowIndex

      sheet.mergeCells(rowNumber, startCol, rowNumber, colCount)

      const cell = excelRow.getCell(startCol)
      cell.value = rowMeta.label ?? ''

      applyBodyStyle(cell, false, cell.value)
      cell.font = { bold: true, size: 10, color: { argb: hexArgb(theme.text) } }

      excelRow.height = 22
      return
    }

    // ── DATA ROW avec groupKey (code + activité fusionnés verticalement) ──
    //
    //   - première occurrence du groupKey → on fusionne les cellules des
    //     colonnes 0 et 1 sur `span` lignes, on écrit toutes les valeurs
    //   - occurrences suivantes → on saute les colonnes 0 et 1 (déjà
    //     couvertes par la fusion), on écrit uniquement les autres colonnes
    if (rowMeta?.type === 'data' && rowMeta.groupKey != null) {
      const groupKey = rowMeta.groupKey
      const isFirst = !groupSeen.has(groupKey)

      if (isFirst) {
        groupSeen.add(groupKey)
        const span = groupSpans.get(groupKey) ?? 1
        const rowNumber = 6 + rowIndex

        // Fusion verticale des colonnes code (1) et activité (2)
        if (span > 1) {
          sheet.mergeCells(rowNumber, 1, rowNumber + span - 1, 1)
          sheet.mergeCells(rowNumber, 2, rowNumber + span - 1, 2)
        }

        // Écriture de toutes les colonnes
        row.forEach((value, colIndex) => {
          const cell = excelRow.getCell(colIndex + 1)
          cell.value = value
          applyBodyStyle(cell, isAlt, value)
          if (isGanttActive(rowIndex, colIndex)) applyGanttActiveStyle(cell)

          // Centrage vertical explicite pour les cellules fusionnées
          if ((colIndex === 0 || colIndex === 1) && span > 1) {
            cell.alignment = { ...cell.alignment, vertical: 'middle' }
          }
        })
      } else {
        // Lignes suivantes du groupe : colonnes 0 et 1 appartiennent à la
        // fusion — on ne les touche pas. On écrit uniquement les autres.
        row.forEach((value, colIndex) => {
          if (colIndex === 0 || colIndex === 1) return

          const cell = excelRow.getCell(colIndex + 1)
          cell.value = value
          applyBodyStyle(cell, isAlt, value)
          if (isGanttActive(rowIndex, colIndex)) applyGanttActiveStyle(cell)
        })
      }

      excelRow.height = estimateExcelRowHeight(row, columnWidths)
      return
    }

    // NORMAL ROW
    row.forEach((value, colIndex) => {
      const cell = excelRow.getCell(colIndex + 1)
      cell.value = value
      applyBodyStyle(cell, isAlt, cell.value)
      if (isGanttActive(rowIndex, colIndex)) applyGanttActiveStyle(cell)
    })

    excelRow.height = estimateExcelRowHeight(row, columnWidths)
  })

  const buffer = await workbook.xlsx.writeBuffer()
  downloadBlob(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    buildExportFilename(meta.filenameSlug, 'xlsx')
  )
}
