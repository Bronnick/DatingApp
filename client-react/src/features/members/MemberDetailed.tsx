import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useMatches, useParams } from 'react-router'
import { calculateAge } from '@/lib/age'
import { useAccountStore } from '@/stores/accountStore'
import { useLikesStore } from '@/stores/likesStore'
import { useIsOnline } from '@/stores/presenceStore'
import { useMember } from './memberApi'
import type { MemberDetailedContext, MemberTabHandle } from './memberDetailedContext'

const menuLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'text-primary' : '')

export default function MemberDetailed() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const { data: member, isPending } = useMember(id)
  const currentUserId = useAccountStore((s) => s.currentUser?.id)
  const hasLiked = useLikesStore((s) => !!id && s.likeIds.includes(id))
  const toggleLike = useLikesStore((s) => s.toggleLike)
  const isOnline = useIsOnline(id)
  const [editPath, setEditPath] = useState<string | null>(null)
  const editMode = editPath === pathname
  const setEditMode = (value: boolean) => setEditPath(value ? pathname : null)

  const title = useMatches()
    .map((m) => (m.handle as MemberTabHandle | undefined)?.title)
    .findLast(Boolean)

  if (isPending) return null
  if (!member) return <div>Member not found</div>

  const isCurrentUser = currentUserId === member.id
  const context: MemberDetailedContext = { member, isCurrentUser, editMode, setEditMode }

  return (
    <div className="flex gap-6">
      <div className="card bg-base-100 flex flex-col h-[85vh] w-1/4">
        <img src={member.imageUrl || '/user.png'} alt="image" className="rounded-full mx-10 mt-3 object-cover" />
        <div className="card-body">
          <div className="flex flex-col items-center">
            <div className="flex text-2xl text-primary items-center">
              {member.displayName}, {calculateAge(member.dateOfBirth)}
              {isOnline && <span className="status status-success status-xl ml-3"></span>}
            </div>
            <div className="text-sm">
              {member.city}, {member.country}
            </div>
          </div>

          <div className="divider"></div>

          <ul className="menu rounded-box w-full text-xl">
            <li><NavLink to="profile" className={menuLinkClass}>Profile</NavLink></li>
            <li><NavLink to="photos" className={menuLinkClass}>Photos</NavLink></li>
            {!isCurrentUser && <li><NavLink to="messages" className={menuLinkClass}>Messages</NavLink></li>}
          </ul>
        </div>

        <div className="card-actions justify-between gap-2 px-2 mb-3">
          <Link to="/members" className="btn btn-info flex-1">Go back</Link>
          {!isCurrentUser && (
            <button
              onClick={() => toggleLike(member.id)}
              className={`btn flex-1 ${hasLiked ? 'btn-error' : 'btn-success'}`}
            >
              {hasLiked ? 'Remove like' : 'Like user'}
            </button>
          )}
        </div>
      </div>

      <div className="card bg-base-100 w-3/4 p-6 flex flex-col h-[85vh]">
        <div className="flex justify-between items-center">
          <h3 className="card-title text-3xl text-primary">{title}</h3>
          {isCurrentUser && (
            <button onClick={() => setEditMode(!editMode)} className="btn btn-outline btn-primary">
              {editMode ? 'Cancel' : title === 'Profile' ? 'Edit' : 'Add a photo'}
            </button>
          )}
        </div>

        <div className="divider"></div>
        <div className="h-full">
          <Outlet context={context} />
        </div>
      </div>
    </div>
  )
}
