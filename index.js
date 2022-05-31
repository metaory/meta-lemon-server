const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const server = app.listen(3000)
const router = new Router()

app.use(bodyParser())

app.use(async function(ctx, next) {
  const start = Date.now()
  try {
    await next()
    const status = ctx.status
    ctx.body = { ok: status === 200, ...ctx.body }
    ctx.status = status
  } catch (error) {
    ctx.body = { ok: false, message: error.message }
  }
  finally {
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
    console.log('%s %s - %sms', ctx.method, ctx.url, ms)
  }
})

const getHandler = async (ctx) => {
  ctx.body = { ok: true, message: 'GET breathing...' }
}
const postHandler = async (ctx) => {
  console.log('>>', ctx.request.body)
  ctx.body = { ok: true, message: 'POST breathing...' }
}

router
  .get('/', getHandler)
  .post('/', postHandler)

app
  .use(router.routes())
  .use(router.allowedMethods())

process.on("SIGINT", () => {
  console.info("\nShutting Down...", new Date())
  server.close()
})
