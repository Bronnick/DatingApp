import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Member } from '@/types/member'

export async function getMember(id: string) {
  const { data } = await api.get<Member>(`members/${id}`)
  return data
}

export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => getMember(id!),
    enabled: !!id,
  })
}
