/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served at threadx.ai/assist: LMS/threadx-web/scripts/build_all.sh copies the build into /assist.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/assist/',
  server: {
    port: 3002,
  },
  build: {
    // One bundle of ~950 kB (~270 kB gzipped), mostly livekit-client and firebase. Fine for a
    // single-page tool; the default 500 kB warning would only be noise in the LMS build log.
    chunkSizeWarningLimit: 1200,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // functions/ is the Node token backend, tested with its own `npm test` (node --test).
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
