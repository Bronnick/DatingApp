import { useMemberDetailed } from './memberDetailedContext'

export default function MemberTabPlaceholder({ name }: { name: string }) {
  const { member, editMode } = useMemberDetailed()
  return (
    <p className="text-base-content/60">
      {name} of {member.displayName} — coming soon{editMode ? ' (edit mode)' : ''}
    </p>
  )
}
