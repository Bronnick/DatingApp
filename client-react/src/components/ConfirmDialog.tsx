import { useEffect, useRef } from 'react'
import { useConfirmStore } from '@/stores/confirmStore'

export default function ConfirmDialog() {
  const message = useConfirmStore((s) => s.message)
  const answer = useConfirmStore((s) => s.answer)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (message && !dialog.open) dialog.showModal()
    if (!message && dialog.open) dialog.close()
  }, [message])

  return (
    <dialog ref={dialogRef} className="modal" onCancel={() => answer(false)}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{message}</h3>
        <p className="py-2">This action cannot be undone</p>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={() => answer(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => answer(true)}>Confirm</button>
        </div>
      </div>
    </dialog>
  )
}
