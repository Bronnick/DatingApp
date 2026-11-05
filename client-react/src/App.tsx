import { Outlet, useLocation } from 'react-router'
import { Toaster } from 'react-hot-toast'
import Nav from '@/layout/Nav'
import ConfirmDialog from '@/components/ConfirmDialog'

function App() {
  const { pathname } = useLocation()

  return (
    <>
      <Nav />
      <div className={pathname === '/' ? '' : 'mt-24 container mx-auto'}>
        <Outlet />
      </div>
      <ConfirmDialog />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App
