import { create } from 'zustand'

interface ConfirmState {
  message: string | null
  resolve: ((ok: boolean) => void) | null
  answer: (ok: boolean) => void
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  message: null,
  resolve: null,
  answer: (ok) => {
    get().resolve?.(ok)
    set({ message: null, resolve: null })
  },
}))

export function confirm(message = 'Are you sure?'): Promise<boolean> {
  useConfirmStore.getState().resolve?.(false)
  return new Promise((resolve) => useConfirmStore.setState({ message, resolve }))
}
