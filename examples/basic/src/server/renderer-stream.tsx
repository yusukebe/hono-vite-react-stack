import { reactRenderer } from '@hono/react-renderer'
import { Script } from '../../../../src/components'

export const rendererStream = reactRenderer(
  ({ children }) => {
    return (
      <html>
        <head>
          <Script />
        </head>
        <body>{children}</body>
      </html>
    )
  },
  {
    stream: true,
  }
)
