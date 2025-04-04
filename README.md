# hono-vite-react-stack

**_hono-vite-react-stack_** is a Vite plugin for creating web apps that run on Cloudflare Workers using Hono and React. The stack consists of the following.

- **Hono** - Web application framework for server-side rendering with React. It is also possible to create APIs.
- **React** - UI library. It can be used not only for server-side SSR, but also for client-side use.
- **Tailwind CSS** - A CSS library.
- **Cloudflare Workers** - You can deploy your application to Cloudflare Workers. It also emulates the Cloudflare Workers environment during development, just like Wrangler.
- **Vite** - Used for the development server and build. By using this plugin, you can easily develop using this stack and build the server side and client side.

## Try it out

```bash
npx giget@latest gh:yusukebe/hono-vite-react-stack-example my-app
```

## Usage

Configuration file:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import reactStack from 'hono-vite-react-stack'

export default defineConfig({
  plugins: [reactStack()],
})
```

Start development server:

```bash
vite dev
```

Build:

```bash
vite build && vite build --ssr
```

## Conventions

You need to place the files as follows.

- `src/server/index.tsx` - Hono application
- `src/client/index.tsx` - Client entry point
- `src/style.css` - CSS file

In addition, the following will be output when building.

- `dist-server/index.js` - Server file
- `dist/*` - Client files

## Components

Components solve the problem of different file paths during development and build.

### `Script` and `Link`

```ts
import { Script, Link } from 'hono-vite-react-stack/components'

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
```

## Example Project

Directory structure:

```plain
.
├── package.json
├── public
├── src
│   ├── client
│   │   ├── app.tsx
│   │   └── index.tsx
│   ├── server
│   │   ├── index.tsx
│   │   └── renderer.tsx
│   └── style.css
├── tsconfig.json
├── vite.config.ts
├── worker-configuration.d.ts
└── wrangler.jsonc
```

`wrangler.json`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "hono-vite-react-stack-example-basic",
  "compatibility_date": "2025-03-20",
  "main": "./src/server/index.tsx",
  "assets": {
    "directory": "dist",
  },
}
```

Commands:

```json
"dev": "vite",
"build": "vite build && vite build --ssr",
"preview": "wrangler dev dist-server/index.js",
"deploy": "$npm_execpath run build && wrangler deploy dist-server/index.js",
```

See more: https://github.com/yusukebe/hono-vite-react-stack-example

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
