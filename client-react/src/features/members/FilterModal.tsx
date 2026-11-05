import { useImperativeHandle, useRef, useState, type Ref } from 'react'
import type { MemberParams } from '@/types/member'

export interface FilterModalHandle {
  open: () => void
}

interface FilterModalProps {
  ref: Ref<FilterModalHandle>
  params: MemberParams
  onSubmit: (params: MemberParams) => void
}

export default function FilterModal({ ref, params, onSubmit }: FilterModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [draft, setDraft] = useState(params)

  useImperativeHandle(ref, () => ({
    open: () => {
      setDraft(params)
      dialogRef.current?.showModal()
    },
  }))

  const update = (changes: Partial<MemberParams>) => setDraft((d) => ({ ...d, ...changes }))

  const handleMinAgeBlur = () => {
    if (draft.minAge < 18) update({ minAge: 18 })
  }

  const handleMaxAgeBlur = () => {
    if (draft.maxAge < draft.minAge) update({ maxAge: draft.minAge })
  }

  const handleSubmit = () => {
    onSubmit(draft)
    dialogRef.current?.close()
  }

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-lg">
        <h3 className="text-lg font-bold">Select filters</h3>

        <div className="flex flex-col w-full gap-6 mt-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Select gender: </span>
            <div className="filter">
              <input type="button" value="x" className="btn btn-square filter-reset" onClick={() => update({ gender: undefined })} />
              {['male', 'female'].map((g) => (
                <input
                  key={g}
                  type="radio"
                  className="btn"
                  name="gender"
                  aria-label={g === 'male' ? 'Male' : 'Female'}
                  value={g}
                  checked={draft.gender === g}
                  onChange={() => update({ gender: g })}
                />
              ))}
            </div>
          </div>

          <label className="flex justify-between items-center">
            <span className="font-semibold">Select age: </span>
            <div className="flex gap-3">
              <input
                type="number"
                className="input w-20"
                min={18}
                value={draft.minAge}
                onChange={(e) => update({ minAge: Number(e.target.value) })}
                onBlur={handleMinAgeBlur}
              />
              <input
                type="number"
                className="input w-20"
                min={draft.minAge || 18}
                value={draft.maxAge}
                onChange={(e) => update({ maxAge: Number(e.target.value) })}
                onBlur={handleMaxAgeBlur}
              />
            </div>
          </label>

          <label className="flex justify-between items-center">
            <span className="font-semibold">Order by: </span>
            <select
              className="select"
              value={draft.orderBy}
              onChange={(e) => update({ orderBy: e.target.value as MemberParams['orderBy'] })}
            >
              <option value="created">Newest members</option>
              <option value="lastActive">Last active</option>
            </select>
          </label>
        </div>

        <div className="modal-action">
          <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  )
}
