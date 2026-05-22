import { create } from 'zustand'

interface SearchState {
  open:    boolean
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  open: false,
  setOpen: (open) =>
    set((state) => ({
      open: typeof open === 'function' ? open(state.open) : open,
    })),
}))

export const useSearch = useSearchStore