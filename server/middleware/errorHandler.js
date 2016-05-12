export default async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error('errorHandler:', err)
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
}
