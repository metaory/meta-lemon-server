import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

import { getHandler, postHandler } from './handler.js'
import middleware from './middleware.js'

const app = new Koa()
const router = new Router()
const server = app.listen(3000)

app.use(bodyParser())
// app.use(middleware)

router
  .get('/words/:word', getHandler)
  .post('/', postHandler)

app
  .use(router.routes())
  .use(router.allowedMethods())

process.on("SIGINT", server.close)
