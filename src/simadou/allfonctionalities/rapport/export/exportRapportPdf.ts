import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EXPORT_CELL_ALIGN } from './rapportExportLayout'
import { RAPPORT_EXPORT_THEME as theme } from './rapportExportTheme'
import type { RapportExportPayload } from './rapportExportTypes'
import {
  buildExportFilename,
  buildRapportDocumentMeta,
  detectAlignment,
  downloadBlob,
  filterExportRows,
} from './rapportExportUtils'

function hexRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}

export function exportRapportPdf(payload: RapportExportPayload) {
  const meta = buildRapportDocumentMeta(payload.pageTitle)

  const { columns, rows, rowMetas } = filterExportRows(
    payload.rows,
    payload.columns,
    payload.visibleColumnIds,
    payload.rowMetas
  )

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()

  const green = hexRgb(theme.green)
  const yellow = hexRgb(theme.yellow)
  const red = hexRgb(theme.red)
  const greenLight = hexRgb(theme.greenLight)

  const usableWidth = pageWidth - 20
  const colWidth = usableWidth / columns.length

  // HEADER DOCUMENT
  doc.setFillColor(...green)
  doc.rect(0, 0, pageWidth, 22, 'F')

  doc.setFillColor(...red)
  doc.rect(0, 22, pageWidth / 3, 2, 'F')

  doc.setFillColor(...yellow)
  doc.rect(pageWidth / 3, 22, pageWidth / 3, 2, 'F')

  doc.setFillColor(...green)
  doc.rect((pageWidth / 3) * 2, 22, pageWidth / 3, 2, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(meta.title, pageWidth / 2, 11, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(meta.subtitle, pageWidth / 2, 18, {
    align: 'center',
    maxWidth: pageWidth - 20,
  })

  // GROUP PTBA (ROWSPAN LOGIC)
  const groupSpans = new Map<string | number, number>()

  rows.forEach((_, i) => {
    const meta = rowMetas?.[i]
    if (!meta || meta.type !== 'data') return
    if (!meta.groupKey) return

    groupSpans.set(meta.groupKey, (groupSpans.get(meta.groupKey) ?? 0) + 1)
  })

  // TABLE
  autoTable(doc, {
    startY: 28,

    head: [columns.map((c) => c.header)],
    body: rows.map((row) =>
      row.map((cell) =>
        String(cell ?? '')
          .replace(/\u00A0/g, ' ')
          .replace(/\u202F/g, ' ')
      )
    ),

    styles: {
      font: 'helvetica',
      fontSize: 7,
      cellPadding: 2,
      lineColor: hexRgb(theme.border),
      lineWidth: 0.1,
      textColor: hexRgb(theme.text),
      overflow: 'linebreak',
      cellWidth: 'auto',
      valign: 'middle',
    },

    headStyles: {
      fillColor: green,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },

    alternateRowStyles: {
      fillColor: greenLight,
    },

    columnStyles: columns.reduce<Record<number, any>>((acc, _, i) => {
      acc[i] = {
        halign: EXPORT_CELL_ALIGN,
        cellWidth: colWidth,
      }
      return acc
    }, {}),

    margin: { top: 28, left: 10, right: 10, bottom: 14 },

    tableWidth: usableWidth,

    // FOOTER PAGE
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages()

      doc.setFontSize(8)
      doc.setTextColor(...hexRgb(theme.textMuted))

      doc.text(
        `Page ${data.pageNumber} sur ${pageCount}`,
        pageWidth - 10,
        doc.internal.pageSize.getHeight() - 6,
        { align: 'right' }
      )
    },

    // CELL LOGIC
    didParseCell: (data) => {
      if (!rowMetas) return

      const rowIndex = rows.indexOf(data.row.raw as string[])
      const meta = rowMetas[rowIndex]

      if (!meta) return

      // SECTION CADRE ANALYTIQUE
      if (meta.type === 'section' && data.section === 'body') {
        const totalColumns = columns.length
        const start = meta.niveau ?? 0

        if (data.column.index < start) {
          data.cell.text = ['']
          return
        }

        if (data.column.index === start) {
          data.cell.colSpan = totalColumns - start
          data.cell.text = [meta.label ?? '']
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.halign = 'left'
          return
        }

        data.cell.text = ['']
        data.cell.styles.lineWidth = 0
        return
      }

      // ALIGNEMENT TEXTE / NOMBRE
      const value = data.cell.text?.[0]
      data.cell.styles.halign = detectAlignment(value)

      // GROUP PTBA
      // CODE + ACTIVITE MERGE
      if (
        meta.type === 'data' &&
        meta.groupKey &&
        (data.column.index === 0 || data.column.index === 1)
      ) {
        const firstRowIndex = rows.findIndex(
          (_, index) =>
            rowMetas[index]?.type === 'data' &&
            rowMetas[index].groupKey === meta.groupKey
        )

        const isFirst = rowIndex === firstRowIndex

        if (isFirst) {
          const span = groupSpans.get(meta.groupKey) ?? 1

          data.cell.rowSpan = span

          data.cell.styles.valign = 'middle'
        } else {
          data.cell.text = ['']

          data.cell.styles.lineWidth = 0
        }
      }
    },
  })

  downloadBlob(
    doc.output('blob'),
    buildExportFilename(meta.filenameSlug, 'pdf')
  )
}
