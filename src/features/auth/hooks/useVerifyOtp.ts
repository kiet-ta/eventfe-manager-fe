import { useMutation } from '@tanstack/react-query'
import type { VerifyOtpRes, VerifyOtpReq } from '../api/schemas'
import { verifyOtp } from '../api/verify-otp'

export function useVerifyOtp() {
  return useMutation<VerifyOtpRes, Error, VerifyOtpReq>({
    mutationFn: verifyOtp,
  })
}
