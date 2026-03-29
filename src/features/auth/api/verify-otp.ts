import {
  verifyOtpResSchema,
  verifyOtpReqSchema
  
  
} from './schemas'
import type {VerifyOtpRes, VerifyOtpReq} from './schemas';
import { postJson } from '#/lib/api-client'

export async function verifyOtp(body: VerifyOtpReq): Promise<VerifyOtpRes> {
  const validReq = verifyOtpReqSchema.parse({
    email: body.email.trim().toLowerCase(),
    otp: body.otp.trim(),
  })

  const payload = await postJson({
    path: '/api/v1/auth/verify-otp',
    body: validReq,
  })

  return verifyOtpResSchema.parse(payload)
}
