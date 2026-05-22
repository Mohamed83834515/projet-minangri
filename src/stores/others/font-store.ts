import { create } from 'zustand'
import { fonts } from '@/config/fonts'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Font = (typeof fonts)[number]

const FONT_COOKIE_NAME    = 'font'
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const applyFont = (font: Font) => {
  const root = document.documentElement
  root.classList.forEach((cls) => {
    if (cls.startsWith('font-')) root.classList.remove(cls)
  })
  root.classList.add(`font-${font}`)
}

interface FontState {
  font:      Font
  setFont:   (font: Font) => void
  resetFont: () => void
}

export const useFontStore = create<FontState>(() => {
  const saved = getCookie(FONT_COOKIE_NAME)
  const font  = fonts.includes(saved as Font) ? (saved as Font) : fonts[0]

  // Init classe CSS au démarrage
  applyFont(font)

  return {
    font,
    setFont: (font) => {
      setCookie(FONT_COOKIE_NAME, font, FONT_COOKIE_MAX_AGE)
      applyFont(font)
      useFontStore.setState({ font })
    },
    resetFont: () => {
      removeCookie(FONT_COOKIE_NAME)
      applyFont(fonts[0])
      useFontStore.setState({ font: fonts[0] })
    },
  }
})

export const useFont = useFontStore