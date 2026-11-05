import { useEffect, useRef, useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { formatShortDateTime, timeAgo } from '@/lib/format'
import { usePresenceStore } from '@/stores/presenceStore'
import type { Message } from '@/types/message'
import { useMemberDetailed } from './memberDetailedContext'
import { useMessageHub } from './useMessageHub'

function MessageStatus({ message }: { message: Message }) {
  if (message.currentUserSender && message.dateRead) {
    return <div className="chat-footer opacity-50">Seen {timeAgo(message.dateRead)}</div>
  }
  if (message.currentUserSender) return <div className="chat-footer opacity-50">Not read</div>
  return <div className="chat-footer opacity-50">Delivered</div>
}

export default function MemberMessages() {
  const { member } = useMemberDetailed()
  const { messages, sendMessage } = useMessageHub(member.id)
  const onlineUsers = usePresenceStore((s) => s.onlineUsers)
  const [content, setContent] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const text = content.trim()
    if (!text) return
    try {
      await sendMessage(text)
      setContent('')
    } catch {
      toast.error('Message was not sent')
    }
  }

  return (
    <div className="flex flex-col w-full h-[73vh]">
      <div className="flex flex-col grow overflow-auto">
        {messages.map((message) => (
          <div key={message.id} className={`chat ${message.currentUserSender ? 'chat-end' : 'chat-start'}`}>
            <div className={`chat-image avatar ${onlineUsers.includes(message.senderId) ? 'avatar-online' : ''}`}>
              <div className="w-10 rounded-full">
                <img alt="user image" src={message.senderImageUrl || '/user.png'} />
              </div>
            </div>
            <div className="chat-header">
              {message.senderDisplayName}
              <time className="text-xs opacity-50">{formatShortDateTime(message.messageSent)}</time>
            </div>
            <div className="chat-bubble">{message.content}</div>
            <MessageStatus message={message} />
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <form onSubmit={handleSubmit} className="flex join w-full">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input w-full"
          placeholder="Enter your message"
        />
        <button type="submit" className="btn btn-primary join-item">Send</button>
      </form>
    </div>
  )
}
