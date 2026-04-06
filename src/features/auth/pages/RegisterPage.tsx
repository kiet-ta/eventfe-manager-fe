import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { getRegisterToken } from '#/lib/auth-storage'
import { CompleteRegisterForm } from '../components/CompleteRegisterForm'

export const RegisterPage = () => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [registerToken, setRegisterToken] = useState<string | null>(null)

  useEffect(() => {
    setRegisterToken(getRegisterToken())
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-[420px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Đang tải phiên đăng ký...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!registerToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-[420px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Thiếu phiên đăng ký</CardTitle>
            <CardDescription>
              Không tìm thấy register token. Vui lòng đăng nhập lại bằng OTP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/login">Quay lại đăng nhập</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-[520px]">
        <CardHeader>
          <CardTitle className="text-2xl">Hoàn tất đăng ký</CardTitle>
          <CardDescription>
            Chỉ còn một bước để kích hoạt tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompleteRegisterForm registerToken={registerToken} />
        </CardContent>
      </Card>
    </div>
  )
}
