import { isAxiosError } from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError(error) && typeof error.response?.data === 'string' && error.response.data) {
    return error.response.data
  }
  return fallback
}

export function getValidationErrors(error: unknown): string[] {
  if (!isAxiosError(error)) return ['Something went wrong']

  const data = error.response?.data
  if (data && typeof data === 'object' && 'errors' in data && data.errors && typeof data.errors === 'object') {
    return Object.values(data.errors as Record<string, string[] | string>).flat()
  }
  if (Array.isArray(data)) {
    return data.map((e) => (typeof e === 'string' ? e : e?.description ?? String(e)))
  }
  return [getErrorMessage(error)]
}
