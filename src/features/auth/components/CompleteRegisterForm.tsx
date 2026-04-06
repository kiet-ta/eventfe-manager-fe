import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { persistLoginTokens } from '#/lib/auth-storage'
import { getAuthErrorMessage } from '../helpers/getAuthErrorMessage'
import { useCompleteRegister } from '../hooks/useCompleteRegister'
import type { CompleteRegisterReq } from '../api/schemas'

interface CompleteRegisterFormProps {
  registerToken: string
}

type IdentityType = CompleteRegisterReq['identityType']

const identityTypeOptions: IdentityType[] = ['CCCD', 'CMND', 'PASSPORT']

export function CompleteRegisterForm({
  registerToken,
}: CompleteRegisterFormProps) {
  const navigate = useNavigate()
  const { mutate, isPending, isSuccess, isError, error, data } =
    useCompleteRegister()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [identityType, setIdentityType] = useState<IdentityType>('CCCD')
  const [identityNumber, setIdentityNumber] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      {
        registerToken,
        firstName,
        lastName,
        identityType,
        identityNumber,
      },
      {
        onSuccess: (response) => {
          persistLoginTokens(response.accessToken, response.tokenType)
          navigate({ to: '/' })
        },
      },
    )
  }

  const getErrorMessage = () => {
    if (!isError) return ''

    return getAuthErrorMessage({
      error,
      fallbackMessage: 'Hoàn tất đăng ký thất bại.',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Họ</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nguyễn"
            autoComplete="given-name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Tên</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="An"
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="identityType">Loại giấy tờ</Label>
        <select
          id="identityType"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={identityType}
          onChange={(e) => setIdentityType(e.target.value as IdentityType)}
          required
        >
          {identityTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="identityNumber">Số giấy tờ</Label>
        <Input
          id="identityNumber"
          value={identityNumber}
          onChange={(e) => setIdentityNumber(e.target.value)}
          placeholder="012345678901"
          autoComplete="off"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Đang hoàn tất đăng ký...' : 'Hoàn tất đăng ký'}
      </Button>

      {isSuccess && data.message && (
        <p className="text-center text-sm text-green-600">{data.message}</p>
      )}

      {isError && (
        <p className="text-center text-sm text-destructive">
          {getErrorMessage()}
        </p>
      )}
    </form>
  )
}
