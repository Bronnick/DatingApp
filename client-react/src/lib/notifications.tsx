import toast from 'react-hot-toast'
import { router } from '@/router'
import type { Message } from '@/types/message'

export function showNewMessageToast(message: Message) {
  const route = `/members/${message.senderId}/messages`

  toast.custom(
    (t) => (
      <div
        className="alert alert-info shadow-lg flex items-center gap-3 cursor-pointer"
        onClick={() => {
          toast.dismiss(t.id)
          router.navigate(route)
        }}
      >
        <img src={message.senderImageUrl || '/user.png'} alt="user image" className="w-10 h-10 rounded" />
        <span>{message.senderDisplayName} has sent you a new message</span>
        <button
          className="ml-4 btn btn-sm btn-ghost"
          onClick={(e) => {
            e.stopPropagation()
            toast.dismiss(t.id)
          }}
        >
          x
        </button>
      </div>
    ),
    { duration: 10000 },
  )
}
