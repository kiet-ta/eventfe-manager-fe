import { z } from 'zod'

export const sendOtpReqSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email là bắt buộc.')
    .max(254, 'Email quá dài.')
    .email('Email không hợp lệ.'),
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

export const verifyOtpResSchema = z.object({
  accessToken: z.string().min(1, 'Thiếu accessToken từ server.').optional(),
  message: z.string().optional(),
})

export type SendOtpReq = z.infer<typeof sendOtpReqSchema>
export type SendOtpRes = z.infer<typeof sendOtpResSchema>
export type VerifyOtpReq = z.infer<typeof verifyOtpReqSchema>
export type VerifyOtpRes = z.infer<typeof verifyOtpResSchema>
