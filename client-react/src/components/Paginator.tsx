interface PaginatorProps {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  pageSizeOptions?: number[]
  onPageChange: (page: { pageNumber: number; pageSize: number }) => void
}

export default function Paginator({
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  pageSizeOptions = [5, 10, 15, 20],
  onPageChange,
}: PaginatorProps) {
  const firstItemIndex = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1
  const lastItemIndex = Math.min(pageNumber * pageSize, totalCount)

  return (
    <div className="flex items-center gap-3 py-3">
      <span>Items per page:</span>
      <select
        className="select w-24"
        value={pageSize}
        onChange={(e) => onPageChange({ pageNumber: 1, pageSize: Number(e.target.value) })}
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>

      <div className="text-sm">
        {firstItemIndex} - {lastItemIndex} of {totalCount}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="btn btn-circle btn-ghost"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange({ pageNumber: pageNumber - 1, pageSize })}
        >
          &larr;
        </button>
        <button
          className="btn btn-circle btn-ghost"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange({ pageNumber: pageNumber + 1, pageSize })}
        >
          &rarr;
        </button>
      </div>
    </div>
  )
}
