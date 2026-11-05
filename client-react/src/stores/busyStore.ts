import { create } from 'zustand'

interface BusyState {
  busyRequestCount: number
  busy: () => void
  idle: () => void
}

export const useBusyStore = create<BusyState>((set) => ({
  busyRequestCount: 0,
  busy: () => set((s) => ({ busyRequestCount: s.busyRequestCount + 1 })),
  idle: () => set((s) => ({ busyRequestCount: Math.max(0, s.busyRequestCount - 1) })),
}))
