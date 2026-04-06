import { useMutation } from '@tanstack/react-query'
import { completeRegister } from '../api/complete-register'
import type { CompleteRegisterReq, CompleteRegisterRes } from '../api/schemas'

export function useCompleteRegister() {
  return useMutation<CompleteRegisterRes, Error, CompleteRegisterReq>({
    mutationFn: completeRegister,
  })
}
