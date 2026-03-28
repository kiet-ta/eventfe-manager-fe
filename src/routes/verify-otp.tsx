import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { VerifyOtpPage } from '#/features/auth/pages/VerifyOtpPage'

const verifyOtpSearchSchema = z.object({
  email: z.string().email('Email không hợp lệ').catch(''),
})

export const Route = createFileRoute('/verify-otp')({
  validateSearch: verifyOtpSearchSchema,
  beforeLoad: ({ search }) => {
    if (!search.email) {
      throw redirect({ to: '/login' })
    }
  },
  component: VerifyOtpPage,
})
