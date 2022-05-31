
export const getHandler = async (ctx) => {
  ctx.body = { message: 'GET is breathing...' }
}

export const postHandler = async (ctx) => {
  console.log('>>', ctx.request.body)
  ctx.body = { message: 'POST breathing...', body: ctx.request.body }
}

