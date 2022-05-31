import fs from 'fs'
// import axios from 'axios'
import https from 'https'

const report = {}

export const getHandler = async (ctx) => {
  const word = ctx.params.word.toLowerCase()
  ctx.body = report[word]
}

const accumulate = (chunk) => chunk
  .replaceAll('-', ' ')
  .replaceAll(',', ' ')
  .replaceAll('\"', ' ')
  .replaceAll('\t', ' ')
  .replaceAll('\n', ' ')
  .replaceAll('\r', ' ')
  .toLowerCase()
  .split(' ')
  .filter(x => !!x)
  .reduce((acc, cur) => {
    acc[cur] = acc[cur] || 0
    acc[cur] += 1
    // XXX SideEffect !!! 
    // TODO replace with db.write(cur)
    report[cur] = report[cur] || 0
    report[cur] += acc[cur]
    return acc
  }, {})

// chunk_1 = ' dishonest  yawning  mustache '
// chunk_2 = 'immoral  dishonest  yawning  mustache  suppl'
// chunk_3 = 'ment whirlwind  clash  terence  lamentable  bennett '
const handleStream = (url) => new Promise((resolve, reject) => {
  // let previousChunk = ''
  https.get(url, (stream) => {
    stream.setEncoding('utf8')
    stream.on('data', (chunk) => {
      accumulate(chunk)
      console.log('>>>' + chunk + '<<<')
    })
    stream.on('error', reject)
    stream.on('end', resolve)
  })
})

export const postHandler = async (ctx) => {
  const { url } = ctx.request.body
  await handleStream(url)
  ctx.body = { report }
}

