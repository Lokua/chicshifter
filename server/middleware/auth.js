import { verifyToken } from '../util'

export async function authorize(ctx, next) {
  try {
    await verifyToken(ctx.headers.authorization)
    return next()
  } catch (err) {
    console.error(err)
    ctx.status = 401
  }
}
