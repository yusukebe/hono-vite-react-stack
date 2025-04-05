import { defineConfig } from 'vite'
import reactStack from '../../src'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [reactStack(), tailwindcss()],
})
