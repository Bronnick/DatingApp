import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Member, MemberParams } from '@/types/member'
import type { PaginatedResult } from '@/types/pagination'

export async function getMembers(params: MemberParams) {
  const { data } = await api.get<PaginatedResult<Member>>('members', { params })
  return data
}

export function useMembers(params: MemberParams) {
  return useQuery({
    queryKey: ['members', params],
    queryFn: () => getMembers(params),
    placeholderData: keepPreviousData,
  })
}
