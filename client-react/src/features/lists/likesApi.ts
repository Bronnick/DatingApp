import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Member } from '@/types/member'
import type { PaginatedResult } from '@/types/pagination'

export type LikesPredicate = 'liked' | 'likedBy' | 'mutual'

export type LikeParams = {
  predicate: LikesPredicate
  pageNumber: number
  pageSize: number
}

export async function getLikes(params: LikeParams) {
  const { data } = await api.get<PaginatedResult<Member>>('likes', { params })
  return data
}

export function useLikes(params: LikeParams) {
  return useQuery({
    queryKey: ['likes', params],
    queryFn: () => getLikes(params),
    placeholderData: keepPreviousData,
  })
}
