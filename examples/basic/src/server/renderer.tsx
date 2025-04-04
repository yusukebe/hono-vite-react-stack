import { reactRenderer } from '@hono/react-renderer'
import { Script, Link } from '../../../../src/components'

export const renderer = reactRenderer(({ children }) => {
  return (
    <html>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <Script />
        <Link href='/src/style.css' rel='stylesheet' />
      </head>
      <body>{children}</body>
    </html>
  )
})
