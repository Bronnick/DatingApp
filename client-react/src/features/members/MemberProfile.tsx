import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/errors'
import { formatLongDate, timeAgo } from '@/lib/format'
import { useUnsavedChangesGuard } from '@/lib/useUnsavedChangesGuard'
import { useAccountStore } from '@/stores/accountStore'
import type { Member } from '@/types/member'
import { memberKey, updateMember, type EditableMember } from './memberApi'
import { useMemberDetailed } from './memberDetailedContext'

export default function MemberProfile() {
  const { member, editMode, setEditMode } = useMemberDetailed()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <span className="font-semibold">Member since: </span>
        <span>{formatLongDate(member.created)}</span>
      </div>
      <div className="flex gap-3">
        <span className="font-semibold">Last active: </span>
        <span>{timeAgo(member.lastActive)}</span>
      </div>
      <h3 className="text-lg font-semibold text-primary">About {member.displayName}</h3>

      {editMode ? (
        <EditProfileForm member={member} onSaved={() => setEditMode(false)} />
      ) : (
        <div>{member.description || 'No description yet'}</div>
      )}
    </div>
  )
}

function EditProfileForm({ member, onSaved }: { member: Member; onSaved: () => void }) {
  const queryClient = useQueryClient()
  const updateCurrentUser = useAccountStore((s) => s.updateCurrentUser)

  const { register, handleSubmit, formState: { isDirty } } = useForm<EditableMember>({
    defaultValues: {
      displayName: member.displayName,
      description: member.description ?? '',
      city: member.city,
      country: member.country,
    },
  })

  const mutation = useMutation({
    mutationFn: updateMember,
    onSuccess: (_, values) => {
      queryClient.setQueryData<Member>(memberKey(member.id), (old) => old && { ...old, ...values })
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['likes'] })
      updateCurrentUser({ displayName: values.displayName })
      toast.success('Profile updated successfully')
      onSaved()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  useUnsavedChangesGuard(isDirty && !mutation.isSuccess)

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col w-full gap-4">
      <label className="floating-label">
        <span>Display Name</span>
        <input className="input w-full" placeholder="Display Name" {...register('displayName')} />
      </label>
      <label className="floating-label">
        <span>Description</span>
        <textarea className="textarea w-full" placeholder="Description" {...register('description')} />
      </label>
      <label className="floating-label">
        <span>City</span>
        <input className="input w-full" placeholder="City" {...register('city')} />
      </label>
      <label className="floating-label">
        <span>Country</span>
        <input className="input w-full" placeholder="Country" {...register('country')} />
      </label>
      <div className="flex self-end">
        <button type="submit" disabled={!isDirty || mutation.isPending} className="btn btn-success">
          {mutation.isPending && <span className="loading loading-spinner"></span>}
          Submit
        </button>
      </div>
    </form>
  )
}
