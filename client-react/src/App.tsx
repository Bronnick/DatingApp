import { Outlet, useLocation } from 'react-router'
import { Toaster } from 'react-hot-toast'
import Nav from '@/layout/Nav'

function App() {
  const { pathname } = useLocation()

  return (
    <>
      <Nav />
      <div className={pathname === '/' ? '' : 'mt-24 container mx-auto'}>
        <Outlet />
      </div>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App
