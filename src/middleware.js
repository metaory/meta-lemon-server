export default async (ctx, next) => {
  const start = Date.now()
  try {
    await next()
    const status = ctx.status
    ctx.body = { ok: status === 200, data: ctx.body }
    ctx.status = status
  } catch ({ message: error }) {
    ctx.body = { ok: false, error }
  }
  finally {
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
    console.log('%s %s - %sms', ctx.method, ctx.url, ms)
  }
}
