import { isAxiosError } from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError(error) && typeof error.response?.data === 'string' && error.response.data) {
    return error.response.data
  }
  return fallback
}
