import { createBrowserRouter, Navigate } from 'react-router'
import App from './App'
import Placeholder from '@/pages/Placeholder'
import RequireAuth from '@/components/RequireAuth'
import MemberList from '@/features/members/MemberList'
import MemberDetailed from '@/features/members/MemberDetailed'
import MemberProfile from '@/features/members/MemberProfile'
import MemberPhotos from '@/features/members/MemberPhotos'
import MemberMessages from '@/features/members/MemberMessages'
import Lists from '@/features/lists/Lists'
import Messages from '@/features/messages/Messages'

export const router = createBrowserRouter([
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
              { path: 'profile', handle: { title: 'Profile' }, element: <MemberProfile /> },
              { path: 'photos', handle: { title: 'Photos' }, element: <MemberPhotos /> },
              { path: 'messages', handle: { title: 'Messages' }, element: <MemberMessages /> },
            ],
          },
          { path: 'lists', element: <Lists /> },
          { path: 'messages', element: <Messages /> },
          { path: 'admin', element: <Placeholder title="Admin" /> },
        ],
      },
      { path: 'errors', element: <Placeholder title="Errors" /> },
      { path: '*', element: <Placeholder title="Not found" /> },
    ],
  },
])
