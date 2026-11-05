import axios from 'axios'
import { environment } from '@/environments/environment'
import { useAccountStore } from '@/stores/accountStore'
import { useBusyStore } from '@/stores/busyStore'

// Shared axios instance. Mirrors the Angular jwt + loading interceptors.
export const api = axios.create({
  baseURL: environment.apiUrl,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAccountStore.getState().currentUser?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  useBusyStore.getState().busy()
  return config
})

api.interceptors.response.use(
  (response) => {
    useBusyStore.getState().idle()
    return response
  },
  (error) => {
    useBusyStore.getState().idle()
    return Promise.reject(error)
  },
)
