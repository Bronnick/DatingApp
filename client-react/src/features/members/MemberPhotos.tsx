import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import DeleteButton from '@/components/DeleteButton'
import ImageUpload from '@/components/ImageUpload'
import SetMainPhotoButton from '@/components/SetMainPhotoButton'
import { getErrorMessage } from '@/lib/errors'
import { useAccountStore } from '@/stores/accountStore'
import type { Member } from '@/types/member'
import type { Photo } from '@/types/photo'
import { deletePhoto, memberKey, memberPhotosKey, setMainPhoto, uploadPhoto, useMemberPhotos } from './memberApi'
import { useMemberDetailed } from './memberDetailedContext'

export default function MemberPhotos() {
  const { member, isCurrentUser, editMode, setEditMode } = useMemberDetailed()
  const { data: photos } = useMemberPhotos(member.id)
  const queryClient = useQueryClient()
  const updateCurrentUser = useAccountStore((s) => s.updateCurrentUser)

  const updatePhotos = (update: (photos: Photo[]) => Photo[]) =>
    queryClient.setQueryData<Photo[]>(memberPhotosKey(member.id), (old) => update(old ?? []))

  const applyMainPhoto = (url: string) => {
    queryClient.setQueryData<Member>(memberKey(member.id), (old) => old && { ...old, imageUrl: url })
    queryClient.invalidateQueries({ queryKey: ['members'] })
    queryClient.invalidateQueries({ queryKey: ['likes'] })
    updateCurrentUser({ imageUrl: url })
  }

  const onError = (error: Error) => toast.error(getErrorMessage(error))

  const upload = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: (photo) => {
      updatePhotos((list) => [...list, photo])
      if (!member.imageUrl) applyMainPhoto(photo.url)
      setEditMode(false)
    },
    onError,
  })

  const setMain = useMutation({
    mutationFn: (photo: Photo) => setMainPhoto(photo.id),
    onSuccess: (_, photo) => applyMainPhoto(photo.url),
    onError,
  })

  const remove = useMutation({
    mutationFn: deletePhoto,
    onSuccess: (_, photoId) => updatePhotos((list) => list.filter((p) => p.id !== photoId)),
    onError,
  })

  if (editMode) return <ImageUpload onUpload={(file) => upload.mutate(file)} loading={upload.isPending} />

  if (!photos) return null

  if (photos.length === 0) return <p className="text-center text-gray-500">No photos available</p>

  return (
    <div className="grid grid-cols-4 auto-rows-min gap-3 p-5 h-[65vh] overflow-auto">
      {photos.map((photo) => {
        const isMainPhoto = photo.url === member.imageUrl
        return (
          <div key={photo.id} className="relative">
            <img src={photo.url} alt="photo of member" className="w-full rounded-lg" />
            {isCurrentUser && (
              <>
                <SetMainPhotoButton isMainPhoto={isMainPhoto} onClick={() => setMain.mutate(photo)} />
                <DeleteButton disabled={isMainPhoto} onClick={() => remove.mutate(photo.id)} />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
