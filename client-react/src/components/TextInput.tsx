import type { ComponentProps } from 'react'

interface TextInputProps extends ComponentProps<'input'> {
  label: string
  error?: string
  isValid?: boolean
}

export default function TextInput({ label, error, isValid, type = 'text', className = '', ...props }: TextInputProps) {
  const stateClass = error ? 'input-error' : isValid ? 'input-success' : ''

  return (
    <label className={`flex flex-col gap-0.5 floating-label text-left ${className}`}>
      <span>{label}</span>
      <input type={type} className={`input w-full ${stateClass}`} placeholder={label} {...props} />
      {error && <div className="validation-hint text-error text-xs">{error}</div>}
    </label>
  )
}
