import { create } from 'zustand'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'

interface LikesState {
  likeIds: string[]
  loadLikeIds: () => Promise<void>
  toggleLike: (targetMemberId: string) => Promise<void>
  clearLikeIds: () => void
}

export const useLikesStore = create<LikesState>((set) => ({
  likeIds: [],

  loadLikeIds: async () => {
    const { data } = await api.get<string[]>('likes/list')
    set({ likeIds: data })
  },

  toggleLike: async (targetMemberId) => {
    await api.post(`likes/${targetMemberId}`, {})
    set((s) => ({
      likeIds: s.likeIds.includes(targetMemberId)
        ? s.likeIds.filter((id) => id !== targetMemberId)
        : [...s.likeIds, targetMemberId],
    }))
    queryClient.invalidateQueries({ queryKey: ['likes'] })
  },

  clearLikeIds: () => set({ likeIds: [] }),
}))
