import JSZip from 'jszip'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { exportRapportWord } from './exportRapportWord'
import type { RapportExportPayload } from './rapportExportTypes'

function buildPayload(
  overrides: Partial<RapportExportPayload> = {}
): RapportExportPayload {
  return {
    pageTitle: 'Tâches PTBA',
    columns: [
      { id: 'code', header: 'Code' },
      { id: 'activite', header: 'Activité' },
      { id: 'tache', header: 'Intitulé tâche' },
    ],
    rows: [
      ['', 'Composante 1', ''],
      ['1.1.1', 'Étude de faisabilité', 'Recrutement du consultant'],
      ['1.1.1', 'Étude de faisabilité', 'Validation du rapport'],
    ],
    rowMetas: [
      { type: 'section', niveau: 0, label: 'Composante 1' },
      { type: 'data', groupKey: '1' },
      { type: 'data', groupKey: '1' },
    ],
    ...overrides,
  }
}

/** Exécute l'export et retourne le document.xml du .docx produit. */
async function exportAndReadXml(payload: RapportExportPayload) {
  const blobs: Blob[] = []

  vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
    blobs.push(blob as Blob)
    return 'blob:mock'
  })
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

  await exportRapportWord(payload)

  expect(blobs).toHaveLength(1)

  const zip = await JSZip.loadAsync(await blobs[0].arrayBuffer())
  return zip.file('word/document.xml')!.async('string')
}

/** Colonnes du grid occupées par une ligne : nb de tc + gridSpans. */
function occupiedGridColumns(rowXml: string): number {
  const cellCount = (rowXml.match(/<w:tc>/g) ?? []).length
  const spans = [...rowXml.matchAll(/<w:gridSpan w:val="(\d+)"/g)]
  const spanExtra = spans.reduce((sum, m) => sum + Number(m[1]) - 1, 0)
  return cellCount + spanExtra
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('exportRapportWord', () => {
  it('chaque ligne (sections comprises) occupe exactement le grid du tableau', async () => {
    const xml = await exportAndReadXml(
      buildPayload({
        gantt: {
          columns: [
            { id: '2025-01', header: 'janv. 25' },
            { id: '2025-02', header: 'févr. 25' },
            { id: '2025-03', header: 'mars 25' },
          ],
          activeByRow: [[], [0, 1], [2]],
        },
      })
    )

    // Le tableau de données est le second (le premier est le bandeau titre).
    const grids = [...xml.matchAll(/<w:tblGrid>.*?<\/w:tblGrid>/gs)]
    expect(grids.length).toBeGreaterThanOrEqual(2)

    const dataTableXml = xml.slice(grids[1].index)
    const gridColumns = (
      grids[1][0].match(/<w:gridCol/g) ?? []
    ).length
    expect(gridColumns).toBe(6) // 3 colonnes de données + 3 mois de Gantt

    const rows = [...dataTableXml.matchAll(/<w:tr\b.*?<\/w:tr>/gs)]
    expect(rows.length).toBeGreaterThanOrEqual(4) // en-tête + 3 lignes

    // Régression : les cellules couvertes par un gridSpan ne doivent pas
    // être émises, sinon la ligne déborde du grid et écrase les colonnes.
    rows.forEach((row) => {
      expect(occupiedGridColumns(row[0])).toBe(gridColumns)
    })

    // La ligne de section porte bien une fusion sur toute la largeur.
    expect(xml).toMatch(/<w:gridSpan w:val="6"/)
  })
})
