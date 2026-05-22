import { useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type FlagStripe = { color: string; textColor: string }

export type FlagTheme = {
  stripes:   FlagStripe[]   // dominant colors left→right (or top→bottom)
  primary:   string         // first stripe bg
  textColor: string         // readable text on primary
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Relative luminance for WCAG contrast check */
function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(l1: number, l2: number): number {
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (lighter + 0.05) / (darker + 0.05)
}

/** Pick white or black for best contrast on a given bg */
function readableText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const bgL  = luminance(r, g, b)
  const whiteContrast = contrastRatio(bgL, 1)
  const blackContrast = contrastRatio(bgL, 0)
  return whiteContrast >= blackContrast ? '#ffffff' : '#1a1a1a'
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

/** Color distance in RGB space */
function colorDistance(
  [r1, g1, b1]: number[],
  [r2, g2, b2]: number[]
): number {
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2)
}

/**
 * Sample N vertical slices of the image and return the dominant color per slice.
 * This naturally produces left→right stripe colors for most flags.
 */
function extractStripeColors(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  numSlices: number
): string[] {
  const colors: string[] = []

  for (let i = 0; i < numSlices; i++) {
    const x = Math.floor((i / numSlices) * width)
    const sliceWidth = Math.floor(width / numSlices)
    const data = ctx.getImageData(x, 0, sliceWidth, height).data

    // Tally colors (quantize to reduce noise)
    const tally: Record<string, number> = {}
    for (let j = 0; j < data.length; j += 4) {
      const r = Math.round(data[j]     / 32) * 32
      const g = Math.round(data[j + 1] / 32) * 32
      const b = Math.round(data[j + 2] / 32) * 32
      const a = data[j + 3]
      if (a < 128) continue // skip transparent
      const key = `${r},${g},${b}`
      tally[key] = (tally[key] ?? 0) + 1
    }

    // Find most frequent color
    let best = '0,0,0'
    let bestCount = 0
    for (const [key, count] of Object.entries(tally)) {
      if (count > bestCount) { best = key; bestCount = count }
    }

    const [r, g, b] = best.split(',').map(Number)
    colors.push(rgbToHex(r, g, b))
  }

  return colors
}

/**
 * Deduplicate similar colors — merge slices that are nearly the same hue.
 * Returns the distinct stripes.
 */
function deduplicateColors(colors: string[], threshold = 60): string[] {
  const result: string[] = []
  for (const hex of colors) {
    const rgb = [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ]
    const isDuplicate = result.some((existing) => {
      const eRgb = [
        parseInt(existing.slice(1, 3), 16),
        parseInt(existing.slice(3, 5), 16),
        parseInt(existing.slice(5, 7), 16),
      ]
      return colorDistance(rgb, eRgb) < threshold
    })
    if (!isDuplicate) result.push(hex)
  }
  return result
}

// ─── Main extractor ───────────────────────────────────────────────────────────

export async function extractFlagTheme(file: File): Promise<FlagTheme> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const W = 300
      const H = Math.round((img.height / img.width) * W)

      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, W, H)

      URL.revokeObjectURL(url)

      // Sample 12 slices, then deduplicate → flag stripes
      const rawColors  = extractStripeColors(ctx, W, H, 12)
      const stripeHexs = deduplicateColors(rawColors, 55)

      const stripes: FlagStripe[] = stripeHexs.map((color) => ({
        color,
        textColor: readableText(color),
      }))

      resolve({
        stripes,
        primary:   stripes[0]?.color   ?? '#1e293b',
        textColor: stripes[0]?.textColor ?? '#ffffff',
      })
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')) }
    img.src = url
  })
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFlagTheme() {
  const [theme, setTheme]       = useState<FlagTheme | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Veuillez déposer une image (PNG, JPG, SVG…)')
      return
    }
    setError(null)
    try {
      const t = await extractFlagTheme(file)
      setTheme(t)
    } catch {
      setError('Impossible de lire les couleurs du drapeau.')
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true)  }, [])
  const onDragLeave = useCallback(()                     => setIsDragging(false),                        [])

  const reset = useCallback(() => { setTheme(null); setError(null) }, [])

  return { theme, isDragging, error, onDrop, onDragOver, onDragLeave, reset, processFile }
}