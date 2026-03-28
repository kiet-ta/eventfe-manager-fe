import { useState } from 'react'
import { ZodError } from 'zod'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { ApiError } from '#/lib/api-client'
import { useVerifyOtp } from '../hooks/useVerifyOtp'

interface VerifyOtpFormProps {
  email: string
}

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const [otp, setOtp] = useState('')
  const { mutate, isPending, isSuccess, isError, error } = useVerifyOtp()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({ email, otp })
  }

  const getErrorMessage = () => {
    if (!isError) return ''
    if (error instanceof ZodError)
      return error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.'
    if (error instanceof ApiError) {
      if (error.status >= 500) return 'Hệ thống đang bận. Vui lòng thử lại sau.'
      return error.message
    }
    if (error instanceof Error) return error.message
    return 'Xác thực OTP thất bại.'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mã xác thực (6 số)
        </label>
        <Input
          id="otp"
          type="text"
          value={otp}
          // Lọc chỉ giữ lại chữ số và giới hạn 6 ký tự
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder="Nhập 6 số OTP"
          required
          maxLength={6}
          pattern="\d{6}"
          className="text-center tracking-widest text-lg"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || otp.length !== 6}
        className="w-full"
      >
        {isPending ? 'Đang xác thực...' : 'Xác thực'}
      </Button>

      {isSuccess && (
        <p className="text-sm text-green-600 text-center">
          Xác thực thành công!
        </p>
      )}
      {isError && (
        <p className="text-sm text-destructive text-center">
          {getErrorMessage()}
        </p>
      )}
    </form>
  )
}
