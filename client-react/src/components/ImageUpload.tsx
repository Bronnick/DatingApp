import { useRef, useState, type DragEvent } from 'react'

interface ImageUploadProps {
  loading?: boolean
  onUpload: (file: File) => void
}

export default function ImageUpload({ loading = false, onUpload }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectFile = (selected: File | undefined) => {
    if (!selected) return
    setFile(selected)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(selected)
  }

  const stop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    stop(e)
    setIsDragging(false)
    selectFile(e.dataTransfer.files[0])
  }

  const handleCancel = () => {
    setFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex w-full gap-6 min-h-100">
      <div className="flex items-center gap-4 w-2/3">
        <label
          onDragOver={(e) => {
            stop(e)
            setIsDragging(true)
          }}
          onDragLeave={(e) => {
            stop(e)
            setIsDragging(false)
          }}
          onDrop={handleDrop}
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-full border-dashed rounded-lg cursor-pointer ${
            isDragging ? 'border-4 border-purple-600 bg-secondary/5' : 'border-2 border-gray-300'
          }`}
        >
          <p className="mb-2 text-lg">Click to upload or drag and drop</p>
          <input
            ref={inputRef}
            type="file"
            id="dropzone-file"
            accept="image/*"
            className="hidden"
            onChange={(e) => selectFile(e.target.files?.[0])}
          />
        </label>
      </div>

      {preview && (
        <div className="flex flex-col w-1/3 gap-3">
          <div className="flex justify-center border-2 border-gray-300 rounded-lg">
            <img src={preview} alt="image preview" className="aspect-square object-cover rounded-lg" />
          </div>
          <div className="flex w-full gap-3">
            <button onClick={handleCancel} className="btn flex-1">Cancel</button>
            <button onClick={() => file && onUpload(file)} className="btn btn-primary flex-1" disabled={loading}>
              {loading && <span className="loading loading-spinner"></span>}
              Upload Image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
