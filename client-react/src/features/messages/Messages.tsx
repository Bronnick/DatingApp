import { useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Paginator from '@/components/Paginator'
import { getErrorMessage } from '@/lib/errors'
import { formatMediumDateTime } from '@/lib/format'
import { confirm } from '@/stores/confirmStore'
import { deleteMessage, useMessages, type MessageContainer, type MessageParams, type MessagesPage } from './messagesApi'

const tabs: { label: string; value: MessageContainer }[] = [
  { label: 'Inbox', value: 'Inbox' },
  { label: 'Outbox', value: 'Outbox' },
]

export default function Messages() {
  const [params, setParams] = useState<MessageParams>({ container: 'Inbox', pageNumber: 1, pageSize: 10 })
  const { data } = useMessages(params)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isInbox = data?.container === 'Inbox'

  const remove = useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_, id) => {
      queryClient.setQueryData<MessagesPage>(['messages', params], (old) =>
        old && { ...old, items: old.items.filter((m) => m.id !== id) },
      )
      queryClient.invalidateQueries({ queryKey: ['messages'], refetchType: 'none' })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const handleDelete = async (e: MouseEvent, id: string) => {
    e.stopPropagation()
    if (await confirm('Are you sure you want to delete this message?')) remove.mutate(id)
  }

  const setContainer = (container: MessageContainer) => {
    if (container !== params.container) setParams((p) => ({ ...p, container, pageNumber: 1 }))
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
          <div role="tablist" className="tabs tabs-box tabs-lg text-primary w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                role="tab"
                className={`tab ${params.container === tab.value ? 'tab-active' : ''}`}
                onClick={() => setContainer(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {data && (
            <Paginator
              pageNumber={data.metadata.currentPage}
              pageSize={data.metadata.pageSize}
              totalCount={data.metadata.totalCount}
              totalPages={data.metadata.totalPages}
              onPageChange={({ pageNumber, pageSize }) => setParams((p) => ({ ...p, pageNumber, pageSize }))}
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="table bg-base-100 table-fixed w-full">
          <thead>
            <tr>
              <th className="w-2/9">Sender / Recipient</th>
              <th className="w-4/9">Message</th>
              <th className="w-2/9">Date</th>
              <th className="w-1/9"></th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((message) => {
              const otherId = isInbox ? message.senderId : message.recipientId
              const otherName = isInbox ? message.senderDisplayName : message.recipientDisplayName
              const otherImage = isInbox ? message.senderImageUrl : message.recipientImageUrl

              return (
                <tr
                  key={message.id}
                  onClick={() => navigate(`/members/${otherId}/messages`)}
                  className={`hover:bg-base-200 cursor-pointer ${isInbox && !message.dateRead ? 'font-bold' : ''}`}
                >
                  <td className="w-2/9">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded">
                        <img className="rounded-full" src={otherImage || '/user.png'} alt="image of member" />
                      </div>
                      <div>{otherName}</div>
                    </div>
                  </td>
                  <td className="truncate w-4/9">{message.content}</td>
                  <td className="w-2/9">{formatMediumDateTime(message.messageSent)}</td>
                  <td className="w-1/9">
                    <button onClick={(e) => handleDelete(e, message.id)} className="btn btn-circle btn-ghost text-error">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
