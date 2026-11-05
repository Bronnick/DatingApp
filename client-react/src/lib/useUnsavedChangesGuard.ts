import { useEffect } from 'react'
import { useBlocker } from 'react-router'

const message = 'Are you sure you want to continue? All unsaved changes will be lost'

export function useUnsavedChangesGuard(when: boolean) {
  const blocker = useBlocker(when)

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    if (window.confirm(message)) blocker.proceed()
    else blocker.reset()
  }, [blocker])

  useEffect(() => {
    if (!when) return
    const handler = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [when])
}
