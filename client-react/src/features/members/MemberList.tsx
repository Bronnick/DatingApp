import { useEffect, useRef, useState } from 'react'
import Paginator from '@/components/Paginator'
import { defaultMemberParams, type MemberParams } from '@/types/member'
import FilterModal, { type FilterModalHandle } from './FilterModal'
import MemberCard from './MemberCard'
import { useMembers } from './membersApi'

const FILTERS_KEY = 'filters'

function loadSavedFilters(): MemberParams {
  try {
    const saved = localStorage.getItem(FILTERS_KEY)
    if (saved) return { ...defaultMemberParams(), ...JSON.parse(saved) }
  } catch {}
  return defaultMemberParams()
}

function describeFilters(params: MemberParams): string {
  const defaults = defaultMemberParams()
  const filters: string[] = []

  if (params.gender) filters.push(params.gender + 's')
  else filters.push('Males', 'Females')

  if (params.minAge !== defaults.minAge || params.maxAge !== defaults.maxAge) {
    filters.push(` ages ${params.minAge}-${params.maxAge}`)
  }

  filters.push(params.orderBy === 'lastActive' ? 'Recently active' : 'Newest members')

  return `Selected: ${filters.join(' | ')}`
}

export default function MemberList() {
  const [params, setParams] = useState(loadSavedFilters)
  const { data } = useMembers(params)
  const modalRef = useRef<FilterModalHandle>(null)

  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(params))
    } catch {}
  }, [params])

  const handleFilterSubmit = (filters: MemberParams) => {
    setParams({ ...filters, pageNumber: 1 })
  }

  const resetFilters = () => {
    setParams({ ...defaultMemberParams(), pageSize: params.pageSize })
  }

  return (
    <>
      {data && (
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button onClick={() => modalRef.current?.open()} className="btn btn-primary">Select filters</button>
              <button onClick={resetFilters} className="btn btn-neutral">Reset filters</button>
              <div className="text-lg bg-base-100 py-2 px-4 border rounded-lg text-primary capitalize">
                {describeFilters(params)}
              </div>
            </div>

            <Paginator
              pageNumber={data.metadata.currentPage}
              pageSize={data.metadata.pageSize}
              totalCount={data.metadata.totalCount}
              totalPages={data.metadata.totalPages}
              onPageChange={({ pageNumber, pageSize }) => setParams((p) => ({ ...p, pageNumber, pageSize }))}
            />
          </div>

          <div className="grid grid-cols-5 gap-6">
            {data.items.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      <FilterModal ref={modalRef} params={params} onSubmit={handleFilterSubmit} />
    </>
  )
}
