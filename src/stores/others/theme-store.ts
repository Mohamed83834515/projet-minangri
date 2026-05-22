import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Theme = 'dark' | 'light'

const DEFAULT_THEME: Theme  = 'light'
const THEME_COOKIE_NAME     = 'vite-ui-theme'
const THEME_COOKIE_MAX_AGE  = 60 * 60 * 24 * 365

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

interface ThemeState {
  theme:         Theme
  resolvedTheme: Theme
  defaultTheme:  Theme
  setTheme:      (theme: Theme) => void
  resetTheme:    () => void
}

export const useThemeStore = create<ThemeState>(() => {
  const theme = (getCookie(THEME_COOKIE_NAME) as Theme) || DEFAULT_THEME

  // Init classe CSS au démarrage
  applyTheme(theme)

  return {
    theme,
    resolvedTheme: theme,
    defaultTheme:  DEFAULT_THEME,
    setTheme: (theme) => {
      setCookie(THEME_COOKIE_NAME, theme, THEME_COOKIE_MAX_AGE)
      applyTheme(theme)
      useThemeStore.setState({ theme, resolvedTheme: theme })
    },
    resetTheme: () => {
      removeCookie(THEME_COOKIE_NAME)
      applyTheme(DEFAULT_THEME)
      useThemeStore.setState({ theme: DEFAULT_THEME, resolvedTheme: DEFAULT_THEME })
    },
  }
})

export const useTheme = useThemeStore