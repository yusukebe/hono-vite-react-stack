import { cloudflare } from '@cloudflare/vite-plugin'
import build from '@hono/vite-build/cloudflare-workers'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin, PluginOption } from 'vite'
import ssrHotReload from 'vite-plugin-ssr-hot-reload'

interface Config {
  serverEntry?: string
  buildOutputDir?: string
  clientEntry?: string
  cssEntry?: string
  serverDirectories?: string[]
}

const defaultConfig: Required<Config> = {
  serverEntry: 'src/server/index.tsx',
  buildOutputDir: 'dist-server',
  clientEntry: 'src/client/index.tsx',
  cssEntry: 'src/style.css',
  serverDirectories: ['src/server/*'],
}

export function reactStack(config: Config = {}): PluginOption[] {
  const resolvedConfig: Required<Config> = {
    ...defaultConfig,
    ...config,
  }

  const configPlugin: Plugin = {
    name: 'hono-vite-react-stack',
    config: (_, env) => {
      if (env.command === 'build' && !env.isSsrBuild) {
        return {
          esbuild: {
            exclude: ['react', 'react-dom'],
          },
          build: {
            manifest: true,
            rollupOptions: {
              input: [resolvedConfig.clientEntry, resolvedConfig.cssEntry],
            },
          },
        }
      }
      if (env.command === 'build' && env.isSsrBuild) {
        return {
          resolve: {
            alias: {
              'react-dom/server': 'react-dom/server.edge',
            },
          },
        }
      }
    },
  }

  const cloudflarePlugins = cloudflare()
  for (const plugin of cloudflarePlugins) {
    plugin.apply = (_config, env) => env.command === 'serve'
  }

  const ssrHotReloadPlugin = ssrHotReload({
    entry: resolvedConfig.serverDirectories,
    injectReactRefresh: true,
  })
  ssrHotReloadPlugin.apply = (_config, env) => env.command === 'serve'

  const reactPlugins = react() as Plugin[]
  for (const plugin of reactPlugins) {
    plugin.apply = (_config, env) => env.command === 'serve'
  }

  const buildPlugin = build({
    entry: resolvedConfig.serverEntry,
    outputDir: resolvedConfig.buildOutputDir,
  })

  buildPlugin.apply = (_config, env) => env.command === 'build' && env.isSsrBuild === true

  return [
    configPlugin,
    cloudflarePlugins,
    reactPlugins,
    ssrHotReloadPlugin,
    buildPlugin,
    tailwindcss(),
  ]
}
