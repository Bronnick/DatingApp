import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Message } from '@/types/message'
import type { PaginatedResult } from '@/types/pagination'

export type MessageContainer = 'Inbox' | 'Outbox'

export type MessageParams = {
  container: MessageContainer
  pageNumber: number
  pageSize: number
}

export type MessagesPage = PaginatedResult<Message> & { container: MessageContainer }

export async function getMessages(params: MessageParams): Promise<MessagesPage> {
  const { data } = await api.get<PaginatedResult<Message>>('messages', { params })
  return { ...data, container: params.container }
}

export function useMessages(params: MessageParams) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => getMessages(params),
    placeholderData: keepPreviousData,
  })
}

export async function deleteMessage(id: string) {
  await api.delete(`messages/${id}`)
}
