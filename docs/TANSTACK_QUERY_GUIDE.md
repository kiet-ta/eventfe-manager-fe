# TanStack Query (React Query) - Hướng dẫn chi tiết

## Mục lục
1. [Giới thiệu TanStack Query](#giới-thiệu-tanstack-query)
2. [Vấn đề cơ bản trước khi có TanStack](#vấn-đề-cơ-bản-trước-khi-có-tanstack)
3. [Query là gì](#query-là-gì)
4. [Mutation là gì](#mutation-là-gì)
5. [mutate() chi tiết](#mutate-chi-tiết)
6. [Ví dụ thực tế từ dự án](#ví-dụ-thực-tế-từ-dự-án)
7. [Lifecycle của Query và Mutation](#lifecycle-của-query-và-mutation)
8. [Best Practices](#best-practices)

---

## Giới thiệu TanStack Query

**TanStack Query** (trước đây gọi là React Query) là một thư viện quản lý **trạng thái dữ liệu từ server** trong ứng dụng React.

### Mục tiêu chính
- Đơn giản hóa việc lấy dữ liệu từ API.
- Tự động quản lý caching, refetching, revalidation.
- Giảm code boilerplate khi xử lý loading/error/success states.
- Cung cấp mechanisms như retry, deduplication, background refetch.

---

## Vấn đề cơ bản trước khi có TanStack

### Cách làm truyền thống (useState + useEffect)

```typescript
// ❌ Cách cũ: phải quản lý tất cả state thủ công
function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSendOtp = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      if (!response.ok) {
        throw new Error('Failed to send OTP')
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSendOtp} disabled={loading}>
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>OTP sent!</p>}
    </div>
  )
}
```

### Vấn đề
1. Phải quản lý 3-4 state (`loading`, `error`, `success`, data).
2. Phải viết logic retry/error handling.
3. Nếu nhiều component gọi cùng API, không có caching tập trung.
4. Phải tự động clear state, quản lý dependencies useEffect.
5. Khó mở rộng (thêm retry logic, background refetch, etc.).

---

## Query là gì

**Query** là yêu cầu **lấy dữ liệu** từ server (GET requests).

### Đặc điểm
- Là **read-only** (chỉ đọc dữ liệu, không thay đổi).
- Được **cache** tự động.
- Tự động **refetch** khi:
  - Component mount.
  - Tab focus lại (focus refetching).
  - Network kết nối lại (reconnect refetching).
  - Dữ liệu "cũ" quá (staleTime hết hạn).

### Ví dụ đơn giản

```typescript
import { useQuery } from '@tanstack/react-query'

function UserProfile() {
  // Query để lấy profile user
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', 'profile'],  // Unique identifier để cache
    queryFn: async () => {
      const res = await fetch('/api/users/profile')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // Dữ liệu "fresh" trong 5 phút
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  return <div>Hello, {data.name}</div>
}
```

### Cơ chế cache
Lần gọi đầu:
```
queryFn() → fetch data → store in cache → render
```

Lần gọi thứ 2 (trong 5 phút):
```
Lấy từ cache → render ngay (không gọi queryFn)
```

---

## Mutation là gì

**Mutation** là yêu cầu **thay đổi dữ liệu** trên server (POST/PUT/DELETE requests).

### Đặc điểm
- Không tự động cache.
- Phải gọi thủ công (không tự động chạy).
- Trả về `mutate()` function để trigger action.
- Thường đi kèm side-effects như:
  - Invalidate cache (revalidate dữ liệu liên quan).
  - Redirect sau thành công.
  - Show toast/alert thành công.

### Ví dụ đơn giản

```typescript
import { useMutation } from '@tanstack/react-query'

function SendOtpForm() {
  // Mutation để gửi OTP
  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed to send OTP')
      return res.json()
    },
    onSuccess: (data) => {
      console.log('OTP sent!', data)
      // Thường redirect hoặc show success toast ở đây
    },
    onError: (error) => {
      console.error('Error:', error)
    },
  })

  const handleClick = () => {
    sendOtpMutation.mutate('user@example.com')
  }

  return (
    <div>
      <button onClick={handleClick} disabled={sendOtpMutation.isPending}>
        {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
      </button>
      {sendOtpMutation.error && (
        <p style={{ color: 'red' }}>{sendOtpMutation.error.message}</p>
      )}
      {sendOtpMutation.isSuccess && (
        <p style={{ color: 'green' }}>OTP sent!</p>
      )}
    </div>
  )
}
```

---

## mutate() chi tiết

`mutate()` là **function để khởi động mutation**.

### Cú pháp cơ bản

```typescript
const { mutate } = useMutation({
  mutationFn: async (variables) => {
    // variables là dữ liệu truyền vào mutate()
    return await apiCall(variables)
  },
})

// Gọi mutate với dữ liệu
mutate(data)
```

### mutate() với callbacks

```typescript
mutate(data, {
  onSuccess: (response, variables, context) => {
    // Chạy khi thành công
    // response: kết quả từ mutationFn
    // variables: dữ liệu truyền vào mutate()
  },
  onError: (error, variables, context) => {
    // Chạy khi lỗi
  },
  onSettled: (data, error, variables, context) => {
    // Chạy lúc hoàn thành (success hoặc error)
  },
})
```

### Ví dụ: Send OTP với callbacks

```typescript
const sendOtpMutation = useMutation({
  mutationFn: sendOtp, // function async từ API client
})

const handleSubmit = (e) => {
  e.preventDefault()
  
  // Gọi mutate với email, và truyền callbacks cụ thể
  sendOtpMutation.mutate(
    { email: 'user@example.com' },
    {
      onSuccess: (response) => {
        // response = { message: "Ma OTP da duoc gui" }
        console.log('✓ OTP sent:', response.message)
        
        // Điều hướng sang màn verify OTP
        navigate({
          to: '/verify-otp',
          search: { email: 'user@example.com' },
        })
      },
      onError: (error) => {
        console.error('✗ Failed:', error.message)
      },
    }
  )
}
```

### Các state của mutation

```typescript
const {
  mutate,           // Function để gọi mutation
  isPending,        // boolean, true khi đang gửi request
  isSuccess,        // boolean, true nếu thành công
  isError,          // boolean, true nếu lỗi
  error,            // Error object nếu lỗi
  data,             // Dữ liệu trả về nếu thành công
  status,           // 'idle' | 'pending' | 'success' | 'error'
  reset,            // Function để reset trạng thái mutation
} = useMutation({...})
```

---

## Ví dụ thực tế từ dự án

### 1) Hook custom: useVerifyOtp

```typescript
// src/features/auth/hooks/useVerifyOtp.ts
import { useMutation } from '@tanstack/react-query'
import type { VerifyOtpRes, VerifyOtpReq } from '../api/schemas'
import { verifyOtp } from '../api/verify-otp'

export function useVerifyOtp() {
  return useMutation<VerifyOtpRes, Error, VerifyOtpReq>({
    mutationFn: verifyOtp,
  })
}

// Giải thích generics:
// - VerifyOtpRes: kiểu dữ liệu trả về từ server
// - Error: kiểu error
// - VerifyOtpReq: kiểu dữ liệu truyền vào mutate()
```

### 2) Sử dụng trong component

```typescript
// src/features/auth/components/VerifyOtpForm.tsx
export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const [otp, setOtp] = useState('')
  const { mutate, isPending, isSuccess, isError, error } = useVerifyOtp()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Gọi mutation
    mutate({ email, otp })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="Nhập 6 số OTP"
      />
      
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Đang xác thực...' : 'Xác thực'}
      </Button>

      {isSuccess && <p style={{ color: 'green' }}>Xác thực thành công!</p>}
      {isError && <p style={{ color: 'red' }}>Lỗi: {error?.message}</p>}
    </form>
  )
}
```

### 3) API function: verifyOtp

```typescript
// src/features/auth/api/verify-otp.ts
import { postJson } from '#/lib/api-client'
import { verifyOtpReqSchema, verifyOtpResSchema } from './schemas'
import type { VerifyOtpReq, VerifyOtpRes } from './schemas'

export async function verifyOtp(body: VerifyOtpReq): Promise<VerifyOtpRes> {
  // Validate input
  const validReq = verifyOtpReqSchema.parse({
    email: body.email.trim().toLowerCase(),
    otp: body.otp.trim(),
  })

  // Call API
  const payload = await postJson({
    path: '/api/v1/auth/verify-otp',
    body: validReq,
  })

  // Validate response
  return verifyOtpResSchema.parse(payload)
}
```

### Flow hoàn chỉnh

```
User nhập OTP → handleSubmit()
   ↓
mutate({ email, otp }) được gọi
   ↓
VerifyOtpReq được validate (zod)
   ↓
POST /api/v1/auth/verify-otp gửi đi
   ↓
isPending = true (button disabled, "Đang xác thực...")
   ↓
Backend trả kết quả
   ↓
VerifyOtpRes được validate (zod)
   ↓
isPending = false, isSuccess = true hoặc isError = true
   ↓
UI re-render, hiển thị kết quả
```

---

## Lifecycle của Query và Mutation

### Query Lifecycle

```
1. IDLE
   ↓ (component mount)
2. FETCHING
   ↓
3. SUCCESS (cache stored) ← có thể return cache ở lần sau
   ↓
4. STALE (hết staleTime) → tự động refetch
   ↓
5. FETCHING again
   ↓
6. SUCCESS again
```

### Mutation Lifecycle

```
1. IDLE (chờ mutate() được gọi)
   ↓ (mutate() gọi)
2. PENDING (đang gửi request)
   ↓
3. SUCCESS (thành công)
   ↓ (tùy chọn: invalidateQueries)
4. (Đưa Query liên quan về trạng thái STALE)
```

---

## Best Practices

### 1) Tách API function riêng

```typescript
// ✓ GOOD: logic API trong file riêng
// src/features/auth/api/send-otp.ts
export async function sendOtp(body: SendOtpReq): Promise<SendOtpRes> {
  // ...
}

// Sử dụng trong hook
const { mutate } = useMutation({
  mutationFn: sendOtp,
})
```

```typescript
// ❌ BAD: logic API inline trong component
const { mutate } = useMutation({
  mutationFn: async (email: string) => {
    const res = await fetch('/api/v1/auth/send-otp', {...})
    // ...
  },
})
```

### 2) Validate input/output với schema (Zod)

```typescript
// ✓ GOOD: sử dụng Zod để validate request/response
export async function verifyOtp(body: VerifyOtpReq): Promise<VerifyOtpRes> {
  const validReq = verifyOtpReqSchema.parse(body)
  const payload = await postJson({...})
  return verifyOtpResSchema.parse(payload)
}
```

### 3) Sử dụng mutations callbacks cẩn thận

```typescript
// ✓ GOOD: xử lý side-effects rõ ràng
mutate(data, {
  onSuccess: (response) => {
    // Redirect sau thành công
    navigate({ to: '/verify-otp', search: { email } })
  },
  onError: (error) => {
    // Log hoặc báo lỗi
    console.error('Failed:', error)
  },
})

// ❌ BAD: side-effects không kiểm soát
const { mutate } = useMutation({
  mutationFn: sendOtp,
  onSuccess: () => {
    window.location.href = '/verify-otp'  // Tránh hard redirect
  },
})
```

### 4) Tái sử dụng hooks custom

```typescript
// ✓ GOOD: wrap mutation trong hook custom
export function useSendOtp() {
  return useMutation<SendOtpRes, Error, SendOtpReq>({
    mutationFn: sendOtp,
  })
}

// Component chỉ cần dùng hook
const { mutate } = useSendOtp()
```

### 5) Xử lý error types chính xác

```typescript
// ✓ GOOD: check error type trước khi sử dụng
const getErrorMessage = () => {
  if (!isError) return ''
  
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? 'Invalid data'
  }
  
  if (error instanceof ApiError) {
    return error.message
  }
  
  return 'Unknown error'
}
```

### 6) Invalidate query khi mutation thành công

```typescript
// ✓ GOOD: revalidate data liên quan sau mutation
const queryClient = useQueryClient()

const { mutate } = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    // Invalidate user profile query để force refetch
    queryClient.invalidateQueries({
      queryKey: ['user', 'profile'],
    })
  },
})
```

---

## Tóm tắt

| Khái niệm | Mục đích | Tự động? | Caching? |
|-----------|---------|---------|---------|
| **Query** | Lấy dữ liệu từ server | Có (auto-refetch) | Có |
| **Mutation** | Thay đổi dữ liệu trên server | Không (gọi thủ công) | Không |
| **mutate()** | Hàm để trigger mutation | - | - |
| **isPending** | Đang gửi request? | - | - |
| **isSuccess** | Request thành công? | - | - |

---

## Tài liệu tham khảo

- [TanStack Query Official Docs](https://tanstack.com/query/latest)
- [React Query in 100 Seconds](https://www.youtube.com/watch?v=cF1qkCDyvia)
