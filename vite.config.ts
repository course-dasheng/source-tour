// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom' // 或 'happy-dom', 'node'
  }
})