import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-2xl">Event Manager</CardTitle>
          <CardDescription>
            Homepage tối giản để review nhanh. Luồng OTP login đã sẵn sàng.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sau khi xác thực OTP thành công với user đã tồn tại, ứng dụng đang
            điều hướng về trang này (<code>/</code>).
          </p>

          <Button asChild>
            <Link to="/login">Đăng nhập bằng OTP</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
