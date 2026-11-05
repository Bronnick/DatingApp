import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import Placeholder from '@/pages/Placeholder'
import RequireAuth from '@/components/RequireAuth'
import MemberList from '@/features/members/MemberList'
import MemberDetailed from '@/features/members/MemberDetailed'
import MemberTabPlaceholder from '@/features/members/MemberTabPlaceholder'
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
          {
            path: 'members/:id',
            element: <MemberDetailed />,
            children: [
              { index: true, element: <Navigate to="profile" replace /> },
              { path: 'profile', handle: { title: 'Profile' }, element: <MemberTabPlaceholder name="Profile" /> },
              { path: 'photos', handle: { title: 'Photos' }, element: <MemberTabPlaceholder name="Photos" /> },
              { path: 'messages', handle: { title: 'Messages' }, element: <MemberTabPlaceholder name="Messages" /> },
            ],
          },
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

useAccountStore.getState().init().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
})
