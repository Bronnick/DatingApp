export interface User {
  id: string
  displayName: string
  email: string
  token: string
  imageUrl?: string
  roles: string[]
}

export interface LoginCreds {
  email: string
  password: string
}
