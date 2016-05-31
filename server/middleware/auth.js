import { verifyToken } from '../util'

export async function authorize(ctx, next) {
  try {
    const isValid = verifyToken(ctx.headers.authorization)
    if (isValid) return next()
  } catch (err) {
    console.error(err)
    ctx.status = 401
  }

  ctx.status = 401
}
