import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import toast from 'react-hot-toast'
import { useAccountStore } from '@/stores/accountStore'

// Port of the Angular authGuard: logged-out users go back to the home page.
export default function RequireAuth() {
  const currentUser = useAccountStore((s) => s.currentUser)

  useEffect(() => {
    if (!currentUser) toast.error('You shall not pass', { id: 'auth-guard' })
  }, [currentUser])

  return currentUser ? <Outlet /> : <Navigate to="/" replace />
}
