import { useCallback, useEffect, useRef, useState } from 'react'
import { HubConnectionBuilder, HubConnectionState, type HubConnection } from '@microsoft/signalr'
import { environment } from '@/environments/environment'
import { queryClient } from '@/lib/queryClient'
import { useAccountStore } from '@/stores/accountStore'
import type { Message } from '@/types/message'

export function useMessageHub(otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const connectionRef = useRef<HubConnection | null>(null)

  useEffect(() => {
    const currentUserId = useAccountStore.getState().currentUser?.id
    if (!currentUserId) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}messages?userId=${otherUserId}`, {
        accessTokenFactory: () => useAccountStore.getState().currentUser?.token ?? '',
      })
      .withAutomaticReconnect()
      .build()

    connection.on('ReceiveMessageThread', (thread: Message[]) => {
      setMessages(thread.map((m) => ({ ...m, currentUserSender: m.senderId !== otherUserId })))
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    })

    connection.on('NewMessage', (message: Message) => {
      setMessages((list) => [...list, { ...message, currentUserSender: message.senderId === currentUserId }])
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    })

    connectionRef.current = connection
    connection.start().catch((error) => console.log(error))

    return () => {
      connectionRef.current = null
      setMessages([])
      connection.stop().catch((error) => console.log(error))
    }
  }, [otherUserId])

  const sendMessage = useCallback(
    async (content: string) => {
      const connection = connectionRef.current
      if (!connection || connection.state !== HubConnectionState.Connected) {
        throw new Error('Not connected to the message hub')
      }
      await connection.invoke('SendMessage', { recipientId: otherUserId, content })
    },
    [otherUserId],
  )

  return { messages, sendMessage }
}
