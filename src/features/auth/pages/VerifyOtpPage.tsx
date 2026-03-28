import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Route } from '#/routes/verify-otp'
import { VerifyOtpForm } from '../components/VerifyOtpForm'
import { Link } from '@tanstack/react-router'

export const VerifyOtpPage = () => {
  const { email } = Route.useSearch()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Xác minh OTP</CardTitle>
          <CardDescription>
            Mã xác thực đã được gửi tới <br />
            <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyOtpForm email={email} />

          <div className="mt-4 text-center text-sm text-gray-500">
            Nhập sai email?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Quay lại
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
