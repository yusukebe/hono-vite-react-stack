import { Hono } from 'hono'
import { renderer } from './renderer'
import { rendererStream } from './renderer-stream'

const app = new Hono()

app.get('/api', (c) => {
  return c.json({ message: 'Hello from API' })
})

app.get('/', renderer, (c) => {
  return c.render(
    <>
      <h1 className='text-3xl font-bold underline'>Hello from SSR</h1>
      <div id='root'></div>
    </>
  )
})

app.get('/stream', rendererStream, (c) => {
  return c.render(
    <>
      <h1>Hello from SSR Streaming</h1>
    </>
  )
})

export default app
