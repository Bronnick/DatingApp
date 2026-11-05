export type Member = {
  id: string
  dateOfBirth: string
  imageUrl?: string
  displayName: string
  created: string
  lastActive: string
  gender: string
  description?: string
  city: string
  country: string
}

export type MemberParams = {
  gender?: string
  minAge: number
  maxAge: number
  pageNumber: number
  pageSize: number
  orderBy: 'lastActive' | 'created'
}

export const defaultMemberParams = (): MemberParams => ({
  minAge: 18,
  maxAge: 100,
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'lastActive',
})
