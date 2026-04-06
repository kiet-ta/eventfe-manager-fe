import { z } from 'zod'

export const sendOtpReqSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email là bắt buộc.')
    .max(254, 'Email quá dài.')
    .email('Email không hợp lệ.'),
  recaptchaToken: z
    .string()
    .trim()
    .min(1, 'Thiếu reCAPTCHA token.')
    .optional(),
})

export const sendOtpResSchema = z.object({
  message: z.string().min(1, 'Thiếu message từ server.'),
})

export const verifyOtpReqSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email là bắt buộc.')
    .max(254, 'Email quá dài.')
    .email('Email không hợp lệ.'),
  otp: z.string().regex(/^\d{6}$/, 'OTP phải gồm 6 chữ số.'),
})

const verifyOtpLoginSuccessSchema = z.object({
  status: z.literal('LOGIN_SUCCESS'),
  message: z.string().optional(),
  accessToken: z.string().min(1, 'Thiếu accessToken từ server.'),
  tokenType: z.string().min(1, 'Thiếu tokenType từ server.'),
  registerToken: z.null().optional(),
})

const verifyOtpRegistrationRequiredSchema = z.object({
  status: z.literal('REGISTRATION_REQUIRED'),
  message: z.string().optional(),
  registerToken: z.string().min(1, 'Thiếu registerToken từ server.'),
  accessToken: z.null().optional(),
  tokenType: z.null().optional(),
})

export const verifyOtpResSchema = z.discriminatedUnion('status', [
  verifyOtpLoginSuccessSchema,
  verifyOtpRegistrationRequiredSchema,
])

export const refreshResSchema = z.object({
  accessToken: z.string().min(1, 'Thiếu accessToken từ server.'),
  tokenType: z.string().min(1, 'Thiếu tokenType từ server.'),
})

const identityTypeSchema = z.enum(['CCCD', 'CMND', 'PASSPORT'])

export const completeRegisterReqSchema = z.object({
  registerToken: z.string().trim().min(1, 'Thiếu registerToken.'),
  firstName: z
    .string()
    .trim()
    .min(1, 'Họ là bắt buộc.')
    .max(100, 'Họ quá dài.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Tên là bắt buộc.')
    .max(100, 'Tên quá dài.'),
  identityType: identityTypeSchema,
  identityNumber: z
    .string()
    .trim()
    .min(6, 'Số giấy tờ không hợp lệ.')
    .max(32, 'Số giấy tờ quá dài.')
    .regex(/^[A-Za-z0-9-]+$/, 'Số giấy tờ chỉ gồm chữ, số hoặc dấu gạch ngang.'),
})

export const completeRegisterResSchema = z.object({
  accessToken: z.string().min(1, 'Thiếu accessToken từ server.'),
  tokenType: z.string().min(1, 'Thiếu tokenType từ server.'),
  message: z.string().optional(),
})

export type SendOtpReq = z.infer<typeof sendOtpReqSchema>
export type SendOtpRes = z.infer<typeof sendOtpResSchema>
export type VerifyOtpReq = z.infer<typeof verifyOtpReqSchema>
export type VerifyOtpRes = z.infer<typeof verifyOtpResSchema>
export type RefreshRes = z.infer<typeof refreshResSchema>
export type CompleteRegisterReq = z.infer<typeof completeRegisterReqSchema>
export type CompleteRegisterRes = z.infer<typeof completeRegisterResSchema>
