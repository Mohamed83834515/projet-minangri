import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

export type Direction = 'ltr' | 'rtl'

const DEFAULT_DIRECTION: Direction = 'ltr'
const DIRECTION_COOKIE_NAME        = 'dir'
const DIRECTION_COOKIE_MAX_AGE     = 60 * 60 * 24 * 365

interface DirectionState {
  dir:        Direction
  defaultDir: Direction
  setDir:     (dir: Direction) => void
  resetDir:   () => void
}

export const useDirectionStore = create<DirectionState>(() => ({
  dir:        (getCookie(DIRECTION_COOKIE_NAME) as Direction) || DEFAULT_DIRECTION,
  defaultDir: DEFAULT_DIRECTION,
  setDir: (dir) => {
    setCookie(DIRECTION_COOKIE_NAME, dir, DIRECTION_COOKIE_MAX_AGE)
    document.documentElement.setAttribute('dir', dir)
    useDirectionStore.setState({ dir })
  },
  resetDir: () => {
    removeCookie(DIRECTION_COOKIE_NAME)
    document.documentElement.setAttribute('dir', DEFAULT_DIRECTION)
    useDirectionStore.setState({ dir: DEFAULT_DIRECTION })
  },
}))

export const useDirection = useDirectionStore