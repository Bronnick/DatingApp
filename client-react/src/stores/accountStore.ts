import { create } from 'zustand'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import { useLikesStore } from '@/stores/likesStore'
import { usePresenceStore } from '@/stores/presenceStore'
import type { LoginCreds, User } from '@/types/user'

const REFRESH_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000

let refreshTimer: ReturnType<typeof setInterval> | undefined

function getRolesFromToken(token: string): string[] {
  const payload = JSON.parse(atob(token.split('.')[1]))
  return Array.isArray(payload.role) ? payload.role : [payload.role]
}

interface AccountState {
  currentUser: User | null
  setCurrentUser: (user: User) => void
  updateCurrentUser: (changes: Partial<Pick<User, 'displayName' | 'imageUrl'>>) => void
  login: (creds: LoginCreds) => Promise<User>
  logout: () => Promise<void>
  init: () => Promise<void>
}

export const useAccountStore = create<AccountState>((set, get) => {
  const startTokenRefreshInterval = () => {
    clearInterval(refreshTimer)
    refreshTimer = setInterval(async () => {
      try {
        const { data } = await api.post<User>('account/refresh-token', {})
        get().setCurrentUser(data)
      } catch {
        get().logout()
      }
    }, REFRESH_INTERVAL_MS)
  }

  return {
    currentUser: null,

    setCurrentUser: (user) => {
      set({ currentUser: { ...user, roles: getRolesFromToken(user.token) } })
      useLikesStore.getState().loadLikeIds().catch(() => {})
      usePresenceStore.getState().start(() => get().currentUser?.token ?? '')
    },

    updateCurrentUser: (changes) => {
      set((s) => ({ currentUser: s.currentUser && { ...s.currentUser, ...changes } }))
    },

    login: async (creds) => {
      const { data } = await api.post<User>('account/login', creds)
      get().setCurrentUser(data)
      startTokenRefreshInterval()
      return data
    },

    logout: async () => {
      await api.post('account/logout', {})
      clearInterval(refreshTimer)
      localStorage.removeItem('filters')
      useLikesStore.getState().clearLikeIds()
      usePresenceStore.getState().stop()
      queryClient.clear()
      set({ currentUser: null })
    },

    init: async () => {
      try {
        const { data } = await api.post<User>('account/refresh-token', {})
        if (data) {
          get().setCurrentUser(data)
          startTokenRefreshInterval()
        }
      } catch {}
    },
  }
})
