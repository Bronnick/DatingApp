import type { MouseEvent } from 'react'
import { Link } from 'react-router'
import { calculateAge } from '@/lib/age'
import { useLikesStore } from '@/stores/likesStore'
import { useIsOnline } from '@/stores/presenceStore'
import type { Member } from '@/types/member'

export default function MemberCard({ member }: { member: Member }) {
  const hasLiked = useLikesStore((s) => s.likeIds.includes(member.id))
  const toggleLike = useLikesStore((s) => s.toggleLike)
  const isOnline = useIsOnline(member.id)

  const handleLike = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLike(member.id)
  }

  return (
    <Link
      to={`/members/${member.id}`}
      className="card cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative"
    >
      <img src={member.imageUrl || '/user.png'} alt={`${member.displayName} image`} className="rounded-lg" />

      {isOnline && <span className="status status-success status-xl absolute top-3 left-3"></span>}

      <button onClick={handleLike} className="absolute top-1 right-1 z-40 btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" fill={hasLiked ? 'red' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      <div className="card-action z-40 absolute bottom-0 w-full px-3 py-1 rounded-b-lg bg-linear-to-t from-black via-black/75 to-black/0">
        <div className="flex flex-col text-white">
          <span className="font-semibold">{member.displayName}, {calculateAge(member.dateOfBirth)}</span>
          <span className="text-sm">{member.city}</span>
        </div>
      </div>
    </Link>
  )
}
