import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import Placeholder from '@/pages/Placeholder'
import RequireAuth from '@/components/RequireAuth'
import MemberList from '@/features/members/MemberList'
import Lists from '@/features/lists/Lists'
import { queryClient } from '@/lib/queryClient'
import { useAccountStore } from '@/stores/accountStore'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Placeholder title="Home" /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'members', element: <MemberList /> },
          { path: 'members/:id', element: <Placeholder title="Member" /> },
          { path: 'lists', element: <Lists /> },
          { path: 'messages', element: <Placeholder title="Messages" /> },
          { path: 'admin', element: <Placeholder title="Admin" /> },
        ],
      },
      { path: 'errors', element: <Placeholder title="Errors" /> },
      { path: '*', element: <Placeholder title="Not found" /> },
    ],
  },
])

// Restore the session (refresh-token cookie) before the first render,
// like the Angular app initializer, so the nav doesn't flash the login form.
useAccountStore.getState().init().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
})
