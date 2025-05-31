# hono-vite-react-stack

> [!CAUTION]
> This library is deprecated. Please use [vite-ssr-components](https://github.com/yusukebe/vite-ssr-components) instead for a more modern and efficient approach to SSR with Vite.
>
> See the [Migration Guide](#migration-to-vite-ssr-components) below for instructions on how to migrate.

---

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

## Guides

### Change the client entry point

If you want to change the path of the client entry point, add a `src` attribute to the `Script` component and set the path.

```tsx
// src/client/main.tsx
import { Script, Link } from 'hono-vite-react-stack/components'
import { reactRenderer } from '@hono/react-renderer'

export const renderer = reactRenderer(({ children }) => {
  return (
    <html>
      <head>
        {/**  Add src attribute to Script component */}
        <Script src='/src/client/main.tsx' />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

For the build, you can specify it in the `vite.config.ts`.

```ts
// vite.config.ts
import reactStack from 'hono-vite-react-stack'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    reactStack({
      clientEntry: './src/client/main.tsx',
    }),
  ],
})
```

### Durable Objects

Creating a project using Durable Objects requires some additional steps. If you have defined a Durable Object class named `MyDurableObject` and exported it in `src/server/do.ts`:

```ts
// src/server/do.ts
import { DurableObject } from 'cloudflare:workers'

export class MyDurableObject extends DurableObject<Bindings> {
  constructor(ctx: DurableObjectState, env: Bindings) {
    super(ctx, env)
  }
  async sayHello(name: string): Promise<string> {
    return `Hello, ${name}!`
  }
}
```

You should import and export it at `src/server/index.tsx`.

```tsx
// src/server/index.tsx
export { MyDurableObject } from './do'
```

And write `vite.config.ts` as follows. This is a bit of a hack.

```ts
// vite.config.ts
import reactStack from 'hono-vite-react-stack'
import { defineConfig } from 'vite'
import { defaultOptions as buildDefaultOptions } from '@hono/vite-build/cloudflare-workers'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['cloudflare:workers'],
    },
  },
  plugins: [
    reactStack({
      buildPluginOptions: {
        entryContentAfterHooks: [
          ...buildDefaultOptions.entryContentAfterHooks,
          () => `export { MyDurableObject } from "/src/server/do"`,
        ],
        entryContentDefaultExportHook: buildDefaultOptions.entryContentDefaultExportHook,
      },
    }),
  ],
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

## Migration to vite-ssr-components

To migrate to the new [vite-ssr-components](https://github.com/yusukebe/vite-ssr-components) library:

1. **Install the new library**:

   ```bash
   npm uninstall hono-vite-react-stack
   npm i -D vite-ssr-components
   ```

2. **Update your vite.config.ts**:

   ```ts
   // Before
   import reactStack from 'hono-vite-react-stack'

   // After
   import ssrPlugin from 'vite-ssr-components/plugin'

   export default defineConfig({
     plugins: [ssrPlugin()],
   })
   ```

3. **Update component imports**:

   ```ts
   // Before
   import { Script, Link } from 'hono-vite-react-stack/components'

   // After
   import { Script, Link, ViteClient } from 'vite-ssr-components/react'
   ```

For detailed migration instructions and new features, please refer to the [vite-ssr-components documentation](https://github.com/yusukebe/vite-ssr-components).

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
