import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Member } from '@/types/member'
import type { Photo } from '@/types/photo'

export type EditableMember = {
  displayName: string
  description: string
  city: string
  country: string
}

export const memberKey = (id: string) => ['member', id]
export const memberPhotosKey = (id: string) => ['member', id, 'photos']

export async function getMember(id: string) {
  const { data } = await api.get<Member>(`members/${id}`)
  return data
}

export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: memberKey(id!),
    queryFn: () => getMember(id!),
    enabled: !!id,
  })
}

export async function getMemberPhotos(id: string) {
  const { data } = await api.get<Photo[]>(`members/${id}/photos`)
  return data
}

export function useMemberPhotos(id: string) {
  return useQuery({
    queryKey: memberPhotosKey(id),
    queryFn: () => getMemberPhotos(id),
  })
}

export async function updateMember(member: EditableMember) {
  await api.put('members', member)
}

export async function uploadPhoto(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post<Photo>('members/add-photo', formData)
  return data
}

export async function setMainPhoto(photoId: number) {
  await api.put(`members/set-main-photo/${photoId}`, {})
}

export async function deletePhoto(photoId: number) {
  await api.delete(`members/delete-photo/${photoId}`)
}
