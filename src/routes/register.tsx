import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterPage } from '#/features/auth/pages/RegisterPage'
import { getRegisterToken } from '#/lib/auth-storage'

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    if (typeof window === 'undefined') {
      return
    }

    if (!getRegisterToken()) {
      throw redirect({ to: '/login' })
    }
  },
  component: RegisterPage,
})
