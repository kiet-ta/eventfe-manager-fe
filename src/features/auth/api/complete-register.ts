import { postJson } from '#/lib/api-client'
import {
  completeRegisterReqSchema,
  completeRegisterResSchema,
} from './schemas'
import type { CompleteRegisterReq, CompleteRegisterRes } from './schemas'

export async function completeRegister(
  body: CompleteRegisterReq,
): Promise<CompleteRegisterRes> {
  const validReq = completeRegisterReqSchema.parse({
    registerToken: body.registerToken,
    firstName: body.firstName,
    lastName: body.lastName,
    identityType: body.identityType,
    identityNumber: body.identityNumber.toUpperCase(),
  })

  const payload = await postJson({
    path: '/api/v1/auth/complete-register',
    body: validReq,
  })

  return completeRegisterResSchema.parse(payload)
}
