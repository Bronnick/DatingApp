import { z } from 'zod'

export function getMaxDateOfBirth(): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 18)
  return date.toISOString().split('T')[0]
}

export const credentialsSchema = z
  .object({
    email: z.string().min(1, 'Email is required').pipe(z.email('Invalid email address')),
    displayName: z.string().trim().min(1, 'Display name is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(4, 'Password must be at least 4 characters')
      .max(10, 'Password must be at most 10 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const profileSchema = z.object({
  gender: z.enum(['male', 'female']),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((v) => v <= getMaxDateOfBirth(), 'You must be at least 18 years old'),
  city: z.string().trim().min(1, 'City is required'),
  country: z.string().trim().min(1, 'Country is required'),
})

export type CredentialsForm = z.infer<typeof credentialsSchema>
export type ProfileForm = z.infer<typeof profileSchema>
