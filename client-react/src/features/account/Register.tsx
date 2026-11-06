import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '@/components/TextInput'
import { getValidationErrors } from '@/lib/errors'
import { useAccountStore } from '@/stores/accountStore'
import {
  credentialsSchema,
  getMaxDateOfBirth,
  profileSchema,
  type CredentialsForm,
  type ProfileForm,
} from './registerSchema'

function fieldState<T extends FieldValues>(form: UseFormReturn<T>, name: Path<T>) {
  const { error, isTouched, isDirty, invalid } = form.getFieldState(name, form.formState)
  return {
    error: isTouched ? error?.message : undefined,
    isValid: !invalid && (isTouched || isDirty),
  }
}

export default function Register({ onCancel }: { onCancel: () => void }) {
  const register = useAccountStore((s) => s.register)
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const credentials = useForm<CredentialsForm>({
    resolver: zodResolver(credentialsSchema),
    mode: 'all',
    defaultValues: { email: '', displayName: '', password: '', confirmPassword: '' },
  })

  const profile = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: 'all',
    defaultValues: { gender: 'male', dateOfBirth: '', city: '', country: '' },
  })

  const handleRegister = profile.handleSubmit(async (profileValues) => {
    const { confirmPassword: _, ...creds } = credentials.getValues()
    setValidationErrors([])
    try {
      await register({ ...creds, ...profileValues })
      navigate('/members')
    } catch (error) {
      setValidationErrors(getValidationErrors(error))
    }
  })

  return (
    <div className="bg-base-100 w-1/2 mx-auto flex flex-col p-6 rounded-lg shadow-lg">
      <div className="card-title w-full justify-center text-3xl text-primary">Sign up</div>
      <div className="card-body w-full">
        <ul className="steps">
          <li className="step step-primary">Credentials</li>
          <li className={`step ${step === 2 ? 'step-primary' : ''}`}>Profile</li>
        </ul>

        {step === 1 && (
          <form
            onSubmit={credentials.handleSubmit(() => setStep(2))}
            className="flex flex-col gap-4 w-full"
          >
            <TextInput className="mt-2" label="Email" {...fieldState(credentials, 'email')} {...credentials.register('email')} />
            <TextInput label="Display name" {...fieldState(credentials, 'displayName')} {...credentials.register('displayName')} />
            <TextInput
              label="Password"
              type="password"
              {...fieldState(credentials, 'password')}
              {...credentials.register('password', { deps: ['confirmPassword'] })}
            />
            <TextInput
              label="Confirm password"
              type="password"
              {...fieldState(credentials, 'confirmPassword')}
              {...credentials.register('confirmPassword')}
            />

            <div className="flex items-center justify-end gap-3">
              <button onClick={onCancel} type="button" className="btn">Cancel</button>
              <button disabled={!credentials.formState.isValid} className="btn btn-primary" type="submit">Next</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="flex flex-col w-full gap-4">
            <div className="flex items-center gap-4">
              <div className="font-semibold">Gender: </div>
              <label className="flex gap-3 items-center">
                <span>Male</span>
                <input type="radio" value="male" className="radio radio-primary" {...profile.register('gender')} />
              </label>
              <label className="flex gap-3 items-center">
                <span>Female</span>
                <input type="radio" value="female" className="radio radio-primary" {...profile.register('gender')} />
              </label>
            </div>

            <TextInput
              label="Date of birth"
              type="date"
              max={getMaxDateOfBirth()}
              {...fieldState(profile, 'dateOfBirth')}
              {...profile.register('dateOfBirth')}
            />
            <TextInput label="City" {...fieldState(profile, 'city')} {...profile.register('city')} />
            <TextInput label="Country" {...fieldState(profile, 'country')} {...profile.register('country')} />

            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setStep(1)} type="button" className="btn">Back</button>
              <button
                disabled={!profile.formState.isValid || profile.formState.isSubmitting}
                className="btn btn-success"
                type="submit"
              >
                {profile.formState.isSubmitting && <span className="loading loading-spinner"></span>}
                Register
              </button>
            </div>
          </form>
        )}
      </div>

      {validationErrors.length > 0 && (
        <div className="mt-5 flex bg-base-200 rounded-2xl w-1/2 p-3 mx-auto">
          <ul className="flex flex-col text-error space-y-1">
            {validationErrors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
