import { useOutletContext } from 'react-router'
import type { Member } from '@/types/member'

export type MemberDetailedContext = {
  member: Member
  isCurrentUser: boolean
  editMode: boolean
  setEditMode: (value: boolean) => void
}

export const useMemberDetailed = () => useOutletContext<MemberDetailedContext>()

export type MemberTabHandle = { title: string }
