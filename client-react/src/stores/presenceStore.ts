import { create } from 'zustand'
import { HubConnectionBuilder, HubConnectionState, type HubConnection } from '@microsoft/signalr'
import { environment } from '@/environments/environment'
import { queryClient } from '@/lib/queryClient'
import { showNewMessageToast } from '@/lib/notifications'
import type { Message } from '@/types/message'

let connection: HubConnection | undefined

interface PresenceState {
  onlineUsers: string[]
  start: (getToken: () => string) => void
  stop: () => void
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUsers: [],

  start: (getToken) => {
    if (connection && connection.state !== HubConnectionState.Disconnected) return

    connection = new HubConnectionBuilder()
      .withUrl(environment.hubUrl + 'presence', { accessTokenFactory: getToken })
      .withAutomaticReconnect()
      .build()

    connection.on('UserOnline', (userId: string) =>
      set((s) => ({ onlineUsers: s.onlineUsers.includes(userId) ? s.onlineUsers : [...s.onlineUsers, userId] })),
    )
    connection.on('UserOffline', (userId: string) =>
      set((s) => ({ onlineUsers: s.onlineUsers.filter((id) => id !== userId) })),
    )
    connection.on('GetOnlineUsers', (userIds: string[]) => set({ onlineUsers: userIds }))
    connection.on('NewMessageReceived', (message: Message) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      showNewMessageToast(message)
    })

    connection.start().catch((error) => console.log(error))
  },

  stop: () => {
    connection?.stop().catch((error) => console.log(error))
    connection = undefined
    set({ onlineUsers: [] })
  },
}))

export const useIsOnline = (userId: string | undefined) =>
  usePresenceStore((s) => !!userId && s.onlineUsers.includes(userId))
