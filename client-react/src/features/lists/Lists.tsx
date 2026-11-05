import { useState } from 'react'
import Paginator from '@/components/Paginator'
import MemberCard from '@/features/members/MemberCard'
import { useLikes, type LikeParams, type LikesPredicate } from './likesApi'

const tabs: { label: string; value: LikesPredicate }[] = [
  { label: 'Liked', value: 'liked' },
  { label: 'LikedBy', value: 'likedBy' },
  { label: 'Mutual', value: 'mutual' },
]

export default function Lists() {
  const [params, setParams] = useState<LikeParams>({ predicate: 'mutual', pageNumber: 1, pageSize: 10 })
  const { data } = useLikes(params)

  const setPredicate = (predicate: LikesPredicate) => {
    if (predicate !== params.predicate) setParams((p) => ({ ...p, predicate, pageNumber: 1 }))
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <div role="tablist" className="tabs tabs-box tabs-lg text-primary w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              className={`tab ${params.predicate === tab.value ? 'tab-active' : ''}`}
              onClick={() => setPredicate(tab.value)}
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

      {data && (
        <div className="grid grid-cols-5 gap-6 mt-3">
          {data.items.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  )
}
